import type { ReactNode } from "react";

interface SkeletonProps {
  className?: string;
  children?: ReactNode;
}

// Componente base Skeleton
export const Skeleton = ({ className = "", children }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%] rounded-md ${className}`}
      style={{
        animation: "skeleton-shimmer 2s ease-in-out infinite",
      }}
    >
      {children}
    </div>
  );
};

// Skeleton para texto
export const SkeletonText = ({ lines = 1, className = "" }: { lines?: number; className?: string }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${
            index === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          }`}
        />
      ))}
    </div>
  );
};

// Skeleton para proyectos en grid
export const SkeletonProjectCard = () => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-700 bg-slate-800 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
};

// Skeleton para lista de proyectos
export const SkeletonProjectList = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonProjectCard key={index} />
      ))}
    </div>
  );
};

// Skeleton para tarjetas de tareas
export const SkeletonTaskCard = () => {
  return (
    <div className="rounded-md border border-slate-700 bg-slate-800 p-3">
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Skeleton para columnas de tareas
export const SkeletonTaskColumn = () => {
  return (
    <div className="w-72 flex-shrink-0 rounded-lg bg-slate-800 p-3">
      <Skeleton className="h-5 w-20 mb-3" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonTaskCard key={index} />
        ))}
      </div>
    </div>
  );
};

// Skeleton para tablero de tareas completo
export const SkeletonTaskBoard = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="flex flex-1 gap-6 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonTaskColumn key={index} />
        ))}
      </div>
    </div>
  );
};

// Skeleton para detalles de tarea
export const SkeletonTaskDetails = () => {
  return (
    <div className="text-white space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
      
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <SkeletonText lines={3} />
      </div>
      
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex gap-3 p-3 bg-slate-800 rounded-md">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <SkeletonText lines={2} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Skeleton para configuración de proyecto
export const SkeletonProjectSettings = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      
      <div className="bg-slate-800/50 rounded-lg p-6 space-y-4">
        <Skeleton className="h-5 w-36" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
        
        <div className="bg-slate-800/50 rounded-lg border border-slate-700">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="p-4 border-b border-slate-700 last:border-b-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Skeleton para carga general con spinner
export const SkeletonSpinner = ({ text = "Cargando..." }: { text?: string }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center space-x-3">
        <div className="animate-spin h-6 w-6 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
        <span className="text-slate-300">{text}</span>
      </div>
    </div>
  );
};

// Skeleton para miembros de proyecto
export const SkeletonMembersList = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-4 border-b border-slate-700 last:border-b-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton para botones de carga
export const SkeletonButton = ({ 
  className = "", 
  text = "Cargando..." 
}: { 
  className?: string; 
  text?: string; 
}) => {
  return (
    <button 
      disabled 
      className={`inline-flex items-center justify-center gap-2 opacity-75 cursor-not-allowed ${className}`}
    >
      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
      {text}
    </button>
  );
};

// Skeleton para área de drop de tareas
export const SkeletonDropArea = () => {
  return (
    <div className="flex-1 min-h-[200px] border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center opacity-50">
      <div className="text-center text-slate-500">
        <div className="text-4xl mb-2 opacity-30">📋</div>
        <div>Cargando tareas...</div>
      </div>
    </div>
  );
};

// Skeleton para formularios
export const SkeletonForm = ({ fields = 2 }: { fields?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex justify-end space-x-3 pt-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

// Indicador de actualización para tareas
export const TaskUpdatingIndicator = () => {
  return (
    <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
      <div className="flex items-center gap-2 text-cyan-400">
        <div className="animate-spin h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
        <span className="text-sm font-medium">Actualizando...</span>
      </div>
    </div>
  );
};

// Skeleton para comentarios
export const SkeletonCommentsList = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-3 p-3 bg-slate-800 rounded-md">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <SkeletonText lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
};
