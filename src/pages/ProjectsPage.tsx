import { useEffect, useState } from "react";
import { ProjectCard } from "../components/ui/ProjectCard";
import { useProjectStore } from "../store/project.store";
import { Modal } from "../components/ui/Modal";
import { CreateProjectForm } from "../components/CreateProjectForm";

export const ProjectPage = () => {
  const { projects, isLoading, fetchProjects } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const projectsData = use(fetchProjects());

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  

  return (
    <>
      <div>
        <div className="flex  items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Proyectos</h1>
            <p className="mt-1 text-slate-400">
              Aquí estan los proyectos en los que estás trabajando
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500"
          >
            Crear Proyecto
          </button>
        </div>
        {isLoading && (
          <p className="mt-8 text-center text-slate-400">
            Cargando Proyecto...
          </p>
        )}
        {!isLoading && projects.length === 0 && (
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-white">
              No hay proyectos todavia
            </h3>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects
            .map((project, index) => (
              <ProjectCard
                key={`${project.id}-${project.name || index}`}
                project={project}
              />
            ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Proyecto"
      >
        <CreateProjectForm onSucces={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};
