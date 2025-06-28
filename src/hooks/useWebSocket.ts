import { useCallback, useEffect, useRef } from "react";
import { useTaskStore } from "../store/task.store";
import { normalizeMongoTask } from "../lib/mongodb-utils";

interface WebSocketMessage {
  event_type: string;
  task: any; // Raw task from MongoDB
}

const urlWS = import.meta.env.VITE_API_WS as string;

export const useWebSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const { updateTaskFromWebSocket } = useTaskStore();

  // Función para conectar WebSocket
  const connectWebSocket = useCallback(() => {
    if (!urlWS) {
      console.error("❌ WebSocket: URL no configurada");
      return;
    }

    try {
      const socket = new WebSocket(urlWS);
      ws.current = socket;

      socket.onopen = () => {
        reconnectAttempts.current = 0;
      };

      socket.onclose = (event) => {
        // Intentar reconectar si no fue un cierre intencional
        if (
          event.code !== 1000 &&
          reconnectAttempts.current < maxReconnectAttempts
        ) {
          reconnectAttempts.current++;
          setTimeout(connectWebSocket, 3000 * reconnectAttempts.current);
        }
      };

      socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          if (message.event_type === "TASK_UPDATED") {
            // Usar la utilidad de normalización
            const normalizedTask = normalizeMongoTask(message.task);

            // Validar que la tarea tenga campos requeridos
            if (
              !normalizedTask.title || !normalizedTask.status ||
              !normalizedTask.project_id
            ) {
              console.warn(
                "⚠️ WebSocket: Tarea con campos faltantes ignorada:",
                normalizedTask,
              );
              return;
            }

            updateTaskFromWebSocket(normalizedTask);
          }
        } catch (error) {
          console.error("❌ WebSocket: Error procesando mensaje:", error);
        }
      };

      socket.onerror = () => {
        console.error("❌ WebSocket: Error de conexión");
      };
    } catch (error) {
      console.error("❌ WebSocket: Error al conectar:", error);
    }
  }, [updateTaskFromWebSocket]);

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
    reconnectAttempts: reconnectAttempts.current,
  };
};
