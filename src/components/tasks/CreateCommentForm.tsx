import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  createCommentSchema,
  type TCreateCommentSchema,
} from "@/lib/validators";
import { useTaskStore } from "@/store/task.store";
import { deleteImage, uploadImage } from "@/api/images";

interface CreateCommentFormProps {
  taskId: string;
}

export const CreateCommentForm = ({ taskId }: CreateCommentFormProps) => {
  const { addComment } = useTaskStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<
    Array<{
      id: string;
      url: string;
      filename: string;
    }>
  >([]);
  const [isuploadingImage, setIsuploadingImage] = useState(false);

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
  const hasContent = (commentContent && commentContent.trim().length > 0) || uploadedImages.length > 0;

  const hadleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("El tamaño máximo permitido es de 5 MB");
      return;
    }

    setIsuploadingImage(true);
    try {
      const response = await uploadImage(file);
      const newImage = {
        id: response.id,
        url: response.url,
        filename: response.filename,
      };

      setUploadedImages((prev) => [...prev, newImage]);
      console.log("Imagen subida:", newImage);

      // No agregamos el markdown al textarea, solo guardamos las imágenes
      // El markdown se agregará al enviar el comentario
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Error al subir la imagen");
    } finally {
      setIsuploadingImage(false);
      event.target.value = ""; // Limpiar el input después de subir
    }
  };

  const removeImage = async (imageId: string) => {
    try {
      await deleteImage(imageId);
      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));

      // Ya no necesitamos remover markdown del contenido porque
      // las imágenes no se agregan al textarea
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error al eliminar la imagen");
    }
  };

  const onSubmit = async (data: TCreateCommentSchema) => {
    try {
      // Construir el contenido final con texto e imágenes
      let finalContent = data.content || "";
      
      // Agregar las imágenes al final del contenido
      if (uploadedImages.length > 0) {
        const imageMarkdowns = uploadedImages.map(img => 
          `![${img.filename}](${img.url})`
        ).join('\n\n');
        
        finalContent = finalContent + (finalContent ? '\n\n' : '') + imageMarkdowns;
      }

      await addComment(taskId, finalContent);
      reset(); // Limpia el formulario después de enviar
      setUploadedImages([]); // Limpia las imágenes subidas
      setIsExpanded(false); // Colapsa el formulario
    } catch (error) {
      // El error ya es manejado por el store
    }
  };

  const handleCancel = async () => {
    // Eliminar imágenes subidas si se cancela
    if (uploadedImages.length > 0) {
      try {
        await Promise.all(uploadedImages.map(img => deleteImage(img.id)));
      } catch (error) {
        console.error('Error al limpiar imágenes:', error);
      }
    }
    
    reset();
    setUploadedImages([]);
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

        {uploadedImages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.filename}
                  className="w-20 h-20 object-cover rounded-md border border-white/10 "
                />
                <button
                  type="button"
                  onClick={() =>
                    removeImage(image.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}

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

            <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={hadleImageUpload}
                  className="hidden"
                  disabled={isuploadingImage}
                />
                <span className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                  {isuploadingImage ? (
                    <>
                      <span className="inline-block w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Imagen
                    </>
                  )}
                </span>
              </label>

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
