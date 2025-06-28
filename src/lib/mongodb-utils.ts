import type { Task } from "../types/index.types";

/**
 * Convierte un timestamp de MongoDB a string ISO
 */
export const convertMongoTimestamp = (timestamp: any): string => {
  if (!timestamp) return new Date().toISOString();

  // Si ya es un string, devolverlo
  if (typeof timestamp === "string") return timestamp;

  // Si es formato MongoDB: {$date: {$numberLong: "1750986958593"}}
  if (timestamp.$date && timestamp.$date.$numberLong) {
    return new Date(parseInt(timestamp.$date.$numberLong)).toISOString();
  }

  // Si es un número directamente
  if (typeof timestamp === "number") {
    return new Date(timestamp).toISOString();
  }

  // Fallback
  return new Date().toISOString();
};

/**
 * Mapea un ID de MongoDB a string válido
 */
export const mapMongoId = (task: any): string => {
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
  if (
    !taskId || taskId === "undefined" || taskId === "null" ||
    taskId.trim() === ""
  ) {
    console.warn("⚠️ ID de tarea inválido, generando fallback:", {
      originalTask: task,
      mappedId: taskId,
    });
    return `fallback-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  return taskId;
};

/**
 * Normaliza una tarea de MongoDB a formato Task estándar
 */
export const normalizeMongoTask = (rawTask: any): Task => {
  const taskId = mapMongoId(rawTask);

  return {
    ...rawTask,
    id: taskId,
    created_at: convertMongoTimestamp(rawTask.created_at),
    updated_at: convertMongoTimestamp(rawTask.updated_at),
  };
};
