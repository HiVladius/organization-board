import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createProjectSchema,
  type TCreateProjectSchema,
} from "../lib/validators";
import { useProjectStore } from "../store/project.store";
import { useState } from "react";
import { AxiosError } from "axios";

interface CreateProjectFormProps {
  onSucces: () => void;
}

export const CreateProjectForm = ({ onSucces }: CreateProjectFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const { createNewProject } = useProjectStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({
      resolver: zodResolver(createProjectSchema),
    });

  const onSubmit = async (data: TCreateProjectSchema) => {
    try {
      await createNewProject(data);
      onSucces();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setError(
          error.response.data.message || "Error al crear el proyecto",
        );
      } else {
        setError("Ha ocurrido un errror inesperado");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-300"
        >
          Nombre del proyecto
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          className="mt-1 block w-full rounded-md border-0 bg-white/5 p-2 text-white ring-1 ring-inset ring-white/10"
        />
        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="key"
          className="block text-sm font-medium text-slate-300"
        >
          Clave del proyecto
        </label>
        <input
          {...register("key")}
          id="key"
          type="text"
          className="mt-1 block w-full rounded-md border-0 bg-white/5 p-2 text-white ring-1 ring-inset ring-white/10"
        />
        {errors.key && (
          <p className="text-sm text-red-500">{errors.key.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-300"
        >
          Descripción del proyecto
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-0 bg-white/5 p-2 text-white ring-inset ring-white/10"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center items-center gap-2 rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting && (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          )}
          {isSubmitting ? "Creando..." : "Crear proyecto"}
        </button>
      </div>
    </form>
  );
};
