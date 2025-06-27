import type { Task } from "../types/index.types";

/**
 * Mapea un ID de MongoDB a string válido
 */
export const mapMongoId = (mongoObject: any): string => {
  if (!mongoObject) return "";
  
  let id = mongoObject.id;
  
  // Manejar diferentes formatos de ID de MongoDB
  if (mongoObject._id) {
    if (typeof mongoObject._id === "object") {
      if (mongoObject._id.$oid) {
        id = mongoObject._id.$oid;
      } else if (mongoObject._id.toString) {
        id = mongoObject._id.toString();
      } else {
        id = String(mongoObject._id);
      }
    } else if (typeof mongoObject._id === "string") {
      id = mongoObject._id;
    } else {
      id = String(mongoObject._id);
    }
  }
  
  // Asegurar que siempre sea un string válido
  id = String(id);
  
  // Validar que el ID no sea inválido
  if (!id || id === "undefined" || id === "null" || id.trim() === "") {
    console.warn("⚠️ ID inválido detectado, generando fallback");
    return `fallback-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
  
  return id;
};

/**
 * Convierte timestamp de MongoDB a string ISO
 */
export const convertMongoTimestamp = (timestamp: any): string => {
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
};

/**
 * Normaliza una tarea de MongoDB a formato interno
 */
export const normalizeMongoTask = (rawTask: any): Task => {
  return {
    ...rawTask,
    id: mapMongoId(rawTask),
    created_at: convertMongoTimestamp(rawTask.created_at),
    updated_at: convertMongoTimestamp(rawTask.updated_at),
  };
};
