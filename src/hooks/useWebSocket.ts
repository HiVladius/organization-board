import { useEffect, useRef } from "react";
import { useTaskStore } from "../store/task.store";
import type { Task } from "../types/index.types";

interface WebSocketMessage {
  event_type: string;
  task: Task;
}

const urlWS = import.meta.env.VITE_API_WS as string; // Asegúrate de que esta URL sea correcta

export const useWebSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const { updateTaskFromWebSocket } = useTaskStore();




  useEffect(() => {
    const wsUrl = urlWS; // Cambia esto a tu URL de WebSocket

    const socket = new WebSocket(wsUrl);
    ws.current = socket;

    socket.onopen = () => console.log("WebSocket conectado");
    socket.onclose = () => console.log("WebSocket cerrado");

    socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.event_type === "TASK_UPDATED") {
          console.log("Tarea recibida desde WebSocket:", message.task);
          updateTaskFromWebSocket(message.task);
        }
      } catch (error) {
        console.error("Error al procesar el mensaje del WebSocket:", error);
      }
    };

    socket.onerror = (errro) => {
        console.error("Error en WebSocket:", errro);
    };

    return () => {
        if(ws.current) ws.current.close();
    }

  }, [updateTaskFromWebSocket]);
};
