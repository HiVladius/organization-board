import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  createCommentSchema,
  type TCreateCommentSchema,
} from "@/lib/validators";
import { useTaskStore } from "@/store/task.store";

interface CreateCommentFormProps {
  taskId: string;
}

export const CreateCommentForm = ({ taskId }: CreateCommentFormProps) => {
  const { addComment } = useTaskStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<TCreateCommentSchema>({
    resolver: zodResolver(createCommentSchema),
  });

  const commentContent = watch("content");
  const hasContent = commentContent && commentContent.trim().length > 0;

  const onSubmit = async (data: TCreateCommentSchema) => {
    try {
      await addComment(taskId, data.content);
      reset(); // Limpia el formulario después de enviar
      setIsExpanded(false); // Colapsa el formulario
    } catch (error) {
      // El error ya es manejado por el store
    }
  };

  const handleCancel = () => {
    reset();
    setIsExpanded(false);
  };

  const handleTextareaFocus = () => {
    setIsExpanded(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enviar con Ctrl + Enter
    if (e.ctrlKey && e.key === "Enter" && hasContent && !isSubmitting) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <textarea
            {...register("content")}
            placeholder="Añade un comentario..."
            rows={isExpanded ? 4 : 2}
            onFocus={handleTextareaFocus}
            onKeyDown={handleKeyDown}
            className={`w-full rounded-md border-0 bg-white/5 p-3 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-500 resize-none transition-all duration-200 ${
              errors.content ? "ring-red-500" : ""
            }`}
          />

          {/* Contador de caracteres */}
          {isExpanded && (
            <div className="absolute bottom-2 right-2 text-xs text-slate-400">
              {commentContent?.length || 0} caracteres
            </div>
          )}
        </div>

        {/* Mostrar error de validación */}
        {errors.content && (
          <p className="mt-1 text-sm text-red-400">
            {errors.content.message}
          </p>
        )}

        {/* Botones - Solo aparecen cuando está expandido */}
        {isExpanded && (
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Presiona{" "}
              <kbd className="px-1 py-0.5 bg-slate-700 rounded text-xs">
                Ctrl + Enter
              </kbd>{" "}
              para enviar
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !hasContent}
                className="rounded-md bg-cyan-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting
                  ? (
                    <>
                      <span className="inline-block w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2">
                      </span>
                      Enviando...
                    </>
                  )
                  : (
                    "Comentar"
                  )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Hint cuando no está expandido */}
      {!isExpanded && (
        <p className="mt-2 text-xs text-slate-500">
          Haz clic en el área de texto para escribir un comentario
        </p>
      )}
    </div>
  );
};
