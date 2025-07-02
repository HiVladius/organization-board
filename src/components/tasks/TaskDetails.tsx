import { useState } from "react";
import { useTaskStore } from "@/store/task.store";
import { CreateCommentForm } from "./CreateCommentForm";
import { EditTaskForm } from "./EditTaskForm";

export const TaskDetails = () => {
  const { selectedTask, comments, isLoadingTaskDetails } = useTaskStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoadingTaskDetails || !selectedTask) {
    return <p className="text-center text-slate-400">Cargando detalles...</p>;
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-slate-400">{selectedTask.project_key}-ID</p>
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

      <div className="mt-6">
        <h3 className="text-lg font-semibold ">Comentarios</h3>
        <div className="mt-2 space-y-3">
          {comments.map((coment) => (
            <div key={coment.id} className="p-3 bg-slate-800 rounded-md">
              <p className="text-sm text-slate-400">{coment.author.username}</p>
              <p className="mt-1 text-slate-300">{coment.content}</p>
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
