import { Outlet, useNavigate, Link } from "react-router";
import { useState } from "react";
import { useAuthStore } from "../../store/auth_store";
import { UserProfile } from "../UserProfile";
import { UserAvatar } from "../ui/UserAvatar";
import { ChevronDown, User, LogOut, Eye } from "lucide-react";

export const AppLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <aside className="w-64 flex-shrink-0 bg-slate-800 p-4">
        <Link to="/board" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-full bg-cyan-500" />
          <h1 className="text-xl font-bold">Conexions</h1>
        </Link>

        <nav className="mt-8">
          <ul>
            <li className="rounded-md bg-slate-700 p-2 text-sm font-semibold">
              Proyectos
            </li>
          </ul>
        </nav>
      </aside>
      
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 flex-shrink-0 items-center justify-end border-b border-slate-700 bg-slate-800 px-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-slate-700 rounded-lg p-2 transition-colors"
            >
              <UserAvatar user={user} size="md" />
              <div className="text-left">
                <div className="text-sm font-medium">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.username
                  }
                </div>
                <div className="text-xs text-gray-400">@{user.username}</div>
              </div>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <Eye size={16} />
                    Ver Perfil (Modal)
                  </button>
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <User size={16} />
                    Página de Perfil
                  </Link>
                  <hr className="my-1 border-slate-700" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-slate-700 rounded-md transition-colors text-red-400 hover:text-red-300"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
          <Outlet />
        </main>
      </div>

      {/* Modal de perfil de usuario */}
      <UserProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      {/* Cerrar dropdown al hacer clic fuera */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};
