import { TaskPriority } from '../types/index.types';



export const getPriorityColors = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.Low:
      return {
        bg: "bg-green-100 dark:bg-green-900/20",
        border: "border-green-300 dark:border-green-700",
        text: "text-green-800 dark:text-green-300",
        badge: "bg-green-500",
        hover: "hover:bg-green-200 dark:hover:bg-green-800/20"
      };
    case TaskPriority.Medium:
      return {
        bg: "bg-yellow-100 dark:bg-yellow-900/20",
        border: "border-yellow-300 dark:border-yellow-700",
        text: "text-yellow-800 dark:text-yellow-300",
        badge: "bg-yellow-500",
        hover: "hover:bg-yellow-200 dark:hover:bg-yellow-800/20"
      };
    case TaskPriority.High:
      return {
        bg: "bg-orange-100 dark:bg-orange-900/20",
        border: "border-orange-300 dark:border-orange-700",
        text: "text-orange-800 dark:text-orange-300",
        badge: "bg-orange-500",
        hover: "hover:bg-orange-200 dark:hover:bg-orange-800/20"

      };
    case TaskPriority.Urgent:
      return {
        bg: "bg-red-100 dark:bg-red-900/20",
        border: "border-red-300 dark:border-red-700",
        text: "text-red-800 dark:text-red-300",
        badge: "bg-red-500",
        hover: "hover:bg-red-200 dark:hover:bg-red-800/20"
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-900/20",
        border: "border-gray-300 dark:border-gray-700",
        text: "text-gray-800 dark:text-gray-300",
        badge: "bg-gray-500",
        hover: "hover:bg-gray-200 dark:hover:bg-gray-800/20"
      };
  }
};

export const getPriorityLabel = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.Low:
      return "Baja";
    case TaskPriority.Medium:
      return "Media";
    case TaskPriority.High:
      return "Alta";
    case TaskPriority.Urgent:
      return "Urgente";
    default:
      return "Sin prioridad";
  }
};