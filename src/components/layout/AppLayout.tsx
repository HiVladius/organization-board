import { Outlet, useNavigate } from "react-router";

import { useAuthStore } from "../../store/auth_store";

export const AppLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (
        <div className="flex h-screen bg-slate-900 text-white">
            <aside className="w-64 flex-shrink-0 bg-slate-800 p-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-cyan-500" />
                    <h1 className="text-xl font-bold">Conexions</h1>
                </div>

                <nav className="mt-8">
                    <ul>
                        <li className="rounded-md bg-slate-700 p-2 text-sm font-semibold">
                            Proyectos
                        </li>
                    </ul>
                </nav>
            </aside>
            <div className="flex flex-1 flex-col">
                <header className=" flex h-16 flex-shrink-0 items-center justify-end border-b border-slate-700 bg-slate-800 px-6">
                    <div className="flex items-center gap-4">
                        <span>{user?.username}</span>
                        <button
                            onClick={handleLogout}
                            className="rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold hover:bg-cyan-500"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </header>{" "}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
