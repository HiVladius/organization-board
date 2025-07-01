export const normalizeId = (item: any): string => {
  if (!item) return "";
  
  // Si tiene _id, úsalo (MongoDB)
  if (item._id) {
    if (typeof item._id === "object" && item._id.$oid) {
      return item._id.$oid;
    }
    return String(item._id);
  }
  
  // Si no tiene _id, usar id
  if (item.id) {
    if (typeof item.id === "object" && item.id.$oid) {
      return item.id.$oid;
    }
    return String(item.id);
  }
  
  // Si el item en sí mismo es un ID
  if (typeof item === "object" && item.$oid) {
    return item.$oid;
  }
  
  return String(item);
};

// Función auxiliar para normalizar arrays de IDs
export const normalizeIdArray = (items: any[]): string[] => {
  if (!Array.isArray(items)) return [];
  return items.map(item => normalizeId(item));
};
