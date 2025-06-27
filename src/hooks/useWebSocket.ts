import { useEffect, useRef, useCallback } from "react";
import { useTaskStore } from "../store/task.store";
import type { Task } from "../types/index.types";

interface WebSocketMessage {
  event_type: string;
  task: Task & { 
    _id?: any;
    created_at?: any;
    updated_at?: any;
  };
}

const urlWS = import.meta.env.VITE_API_WS as string;

export const useWebSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const { updateTaskFromWebSocket } = useTaskStore();

  // Función para convertir timestamp de MongoDB a string ISO
  const convertMongoTimestamp = useCallback((timestamp: any): string => {
    if (!timestamp) return new Date().toISOString();
    
    // Si ya es un string, devolverlo
    if (typeof timestamp === 'string') return timestamp;
    
    // Si es formato MongoDB: {$date: {$numberLong: "1750986958593"}}
    if (timestamp.$date && timestamp.$date.$numberLong) {
      return new Date(parseInt(timestamp.$date.$numberLong)).toISOString();
    }
    
    // Si es un número directamente
    if (typeof timestamp === 'number') {
      return new Date(timestamp).toISOString();
    }
    
    // Fallback
    return new Date().toISOString();
  }, []);

  // Función para mapear el ID de MongoDB a string
  const mapTaskId = useCallback((task: Task & { _id?: any }): string => {
    let taskId = task.id;
    
    // Manejar diferentes formatos de ID de MongoDB
    if (task._id) {
      if (typeof task._id === "object") {
        // Si es un objeto de MongoDB ObjectId
        if (task._id.$oid) {
          taskId = task._id.$oid;
        } else if (task._id.toString) {
          taskId = task._id.toString();
        } else {
          taskId = String(task._id);
        }
      } else if (typeof task._id === "string") {
        taskId = task._id;
      } else {
        taskId = String(task._id);
      }
    }
    
    // Asegurar que siempre sea un string válido
    taskId = String(taskId);
    
    // Validar que el ID no sea inválido
    if (!taskId || taskId === "undefined" || taskId === "null" || taskId.trim() === "") {
      console.error("❌ ID de tarea inválido después del mapeo:", { 
        originalTask: task, 
        mappedId: taskId 
      });
      return `fallback-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    
    return taskId;
  }, []);

  // Función para conectar WebSocket
  const connectWebSocket = useCallback(() => {
    if (!urlWS) {
      console.error("❌ URL de WebSocket no configurada");
      return;
    }

    try {
      console.log("🔌 Intentando conectar WebSocket...", urlWS);
      const socket = new WebSocket(urlWS);
      ws.current = socket;

      socket.onopen = () => {
        console.log("✅ WebSocket conectado exitosamente");
        reconnectAttempts.current = 0;
      };

      socket.onclose = (event) => {
        console.log("🔌 WebSocket cerrado:", event.code, event.reason);
        
        // Intentar reconectar si no fue un cierre intencional
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`🔄 Reintentando conexión (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
          setTimeout(connectWebSocket, 3000 * reconnectAttempts.current);
        }
      };

      socket.onmessage = (event) => {
        try {
          console.log("📨 RAW WebSocket mensaje recibido:", event.data);
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log("📨 PARSED WebSocket mensaje:", message);

          if (message.event_type === "TASK_UPDATED") {
            console.log("🔄 Procesando actualización de tarea:", {
              rawTask: message.task,
              originalId: message.task.id,
              mongoId: message.task._id
            });
            
            // Mapear el ID correctamente
            const taskId = mapTaskId(message.task);
            
            // Crear tarea mapeada con ID correcto
            const mappedTask: Task = {
              ...message.task,
              id: taskId,
              // Mapear timestamps de MongoDB a strings ISO
              created_at: convertMongoTimestamp(message.task.created_at),
              updated_at: convertMongoTimestamp(message.task.updated_at),
            };
            
            // Validar que la tarea tenga campos requeridos
            if (!mappedTask.title || !mappedTask.status || !mappedTask.project_id) {
              console.error("❌ Tarea incompleta recibida por WebSocket:", mappedTask);
              return;
            }
            
            console.log("✅ Tarea mapeada para WebSocket:", {
              id: mappedTask.id,
              title: mappedTask.title,
              status: mappedTask.status,
              updated_at: mappedTask.updated_at
            });
            
            updateTaskFromWebSocket(mappedTask);
          } else {
            console.log("⚠️ Evento WebSocket ignorado:", message.event_type);
          }
        } catch (error) {
          console.error("❌ Error al procesar mensaje WebSocket:", error);
          console.error("❌ Datos recibidos:", event.data);
        }
      };

      socket.onerror = (error) => {
        console.error("❌ Error en WebSocket:", error);
      };

    } catch (error) {
      console.error("❌ Error al crear conexión WebSocket:", error);
    }
  }, [updateTaskFromWebSocket, mapTaskId]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close(1000, "Componente desmontado");
      }
    };
  }, [connectWebSocket]);

  return {
    isConnected: ws.current?.readyState === WebSocket.OPEN,
    reconnectAttempts: reconnectAttempts.current
  };
};
