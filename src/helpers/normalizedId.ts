

export const normalizeId = (item: any): string => {
  if (!item) return '';
  if (item._id) {
    if (typeof item._id === "object" && item._id.$oid) {
      return item._id.$oid;
    }
    return String(item._id);
  }
  return String(item.id);
};
