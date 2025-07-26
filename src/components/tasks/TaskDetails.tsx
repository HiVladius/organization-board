import { useState } from "react";
import { useTaskStore } from "@/store/task.store";
import { CreateCommentForm } from "./CreateCommentForm";
import { EditTaskForm } from "./EditTaskForm";
import { SkeletonTaskDetails } from "@/components/ui/Skeleton";

// Función para renderizar markdown básico con imágenes
const renderMarkdown = (content: string) => {
  const parts = content.split(/(\!\[.*?\]\(.*?\))/g);
  
  return parts.map((part, index) => {
    // Verificar si es una imagen en formato markdown
    const imageMatch = part.match(/\!\[(.*?)\]\((.*?)\)/);
    if (imageMatch) {
      const [, alt, src] = imageMatch;
      return (
        <img
          key={index}
          src={src}
          alt={alt}
          className="max-w-xs h-auto rounded-md border border-white/10 my-2"
          style={{ maxHeight: '200px' }}
        />
      );
    }
    // Si no es una imagen, renderizar como texto normal
    return part ? (
      <span key={index} style={{ whiteSpace: 'pre-wrap' }}>
        {part}
      </span>
    ) : null;
  });
};

export const TaskDetails = () => {
  const { selectedTask, comments, isLoadingTaskDetails } = useTaskStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoadingTaskDetails || !selectedTask) {
    return <SkeletonTaskDetails />;
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-slate-400">
            {selectedTask.project_key}-ID
          </p>
          <h2 className="text-2xl font-bold">{selectedTask.title}</h2>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-3 py-1 rounded-md bg-slate-600 hover:bg-slate-500 text-white text-sm"
        >
          Editar
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Description</h3>
        <p className="mt-1 text-slate-300">
          {selectedTask.description || "No hay descipción para esta tarea."}
        </p>
      </div>

      {/* Mostrar fechas si están disponibles */}
      {(selectedTask.start_date || selectedTask.end_date) && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Fechas</h3>
          <div className="mt-2 space-y-2">
            {selectedTask.start_date && (
              <div className="flex items-center gap-2 text-slate-300">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  <strong>Fecha de inicio:</strong>{" "}
                  {new Date(selectedTask.start_date).toLocaleDateString(
                    "es-ES",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
            )}
            {selectedTask.end_date && (
              <div className="flex items-center gap-2 text-slate-300">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  <strong>Fecha final:</strong>{" "}
                  {new Date(selectedTask.end_date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {selectedTask.start_date && selectedTask.end_date && (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Duración: {Math.ceil(
                    (new Date(selectedTask.end_date).getTime() -
                      new Date(selectedTask.start_date).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )} días
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold ">Comentarios</h3>
        <div className="mt-2 space-y-3">
          {comments.map((coment) => (
            <div key={coment.id} className="p-3 bg-slate-800 rounded-md">
              <p className="text-sm text-slate-400">{coment.author.username}</p>
              <div className="mt-1 text-slate-300">
                {renderMarkdown(coment.content)}
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-slate-400">Aun no hay comentarios</p>
          )}
        </div>
        <CreateCommentForm taskId={selectedTask.id} />
      </div>

      {selectedTask && (
        <EditTaskForm
          task={selectedTask}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};
