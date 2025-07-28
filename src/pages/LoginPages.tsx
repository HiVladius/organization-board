import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { loginSchema } from "../lib/validators";
import type { TLoginSchema } from "../lib/validators";
import { useAuthStore } from "../store/auth_store";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const LoginPages = () => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<TLoginSchema>({
      resolver: zodResolver(loginSchema),
    });

  const onSubmit = async (data: TLoginSchema) => {
    setError(null);
    try {
      await login(data);
      navigate("/board"); // Redirige a la página de proyectos después de iniciar sesión
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setError(
          error.response.data.error || "Error al iniciar sesión",
        );
      } else {
        setError("Error al iniciar sesión");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Conexions {/*Nombre alternativo */}
          </h1>
          <p className="mt-2 text-slate-400">
            Inicia sesion para contininuar
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="spaces-y-6">
          {error && (
            <p className="text-center text-sm font-medium, text-red-500">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium, text-slate-300"
            >
              Correo electrónico
            </label>
            <div className="mt-2">
              <input
                type="email"
                {...register("email")}
                id="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 bg-white/5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm "
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="mt-4 block text-sm font-medium, text-slate-300"
            >
              Contraseña
            </label>
            <div className="mt-2">
              <input
                type="password"
                {...register("password")}
                id="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 bg-white/5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm "
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting && (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full">
                  </div>
                )}
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
