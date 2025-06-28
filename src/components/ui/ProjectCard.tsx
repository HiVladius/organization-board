
import { Link } from "react-router-dom";
import type { Project } from "../../types/index.types";

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <Link to={`/project/${project.id}`} className="flex flex-col gap-4 rounded-lg border border-slate-700 bg-slate-800 p-4 transition-colors hover:bg-slate-700/50" >
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-700 text-lg font-bold">
                        {project.project_key}
                    </div>
                </div>
                <h3 className="text-base font-semibold text-white">
                    {project.name}
                </h3>
                <p className="text-sm text-slate-400">Projecto de Sofware</p>
            </div>

            {project.description && (
                <p className="mt-4 text-sm text-slate-400 line-clamp-2">
                    {project.description}
                </p>
            )}
        </Link>
    );
};
