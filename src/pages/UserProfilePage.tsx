import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth_store';
import { useProjectStore } from '../store/project.store';
import { UserAvatar } from '../components/ui/UserAvatar';
import {  updateUserProfile, getUserStats } from '../api/user';
import { 
  Edit3, 
  Users, 
  Calendar, 
  Mail, 
  User as UserIcon, 
  Briefcase,
  CheckCircle,
  Clock,
  Star,
  Activity
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const { projects } = useProjectStore();
  const [isEditing, setIsEditing] = useState(false);
  const [_loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    ownedProjects: 0,
    memberProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    role: user?.role || 'Usuario'
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Aquí podrías cargar datos adicionales del usuario
      const userStats = await getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser, localStorage.getItem('token'));
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar el perfil');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filtrar proyectos donde el usuario es miembro o propietario
  const userProjects = projects.filter(project => 
    project.members.includes(user?.id || '') || project.owner_id === user?.id
  );

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <UserAvatar user={user} size="xl" />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user.username
              }
            </h1>
            <p className="text-gray-400 text-lg mb-1">@{user.username}</p>
            <p className="text-gray-500 text-sm mb-4">ID: {user.id}</p>
            <p className="text-gray-300">{user.bio || 'No hay biografía disponible'}</p>
            
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={16} />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={16} />
                <span className="text-sm">Miembro desde {formatDate(user.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Briefcase size={16} />
                <span className="text-sm">{user.role || 'Usuario'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Edit3 size={16} />
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-cyan-500 mb-1">{stats.totalProjects}</div>
          <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <Users size={14} />
            Proyectos
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-500 mb-1">{stats.ownedProjects}</div>
          <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <Star size={14} />
            Como Owner
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-500 mb-1">{stats.memberProjects}</div>
          <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <Users size={14} />
            Como Miembro
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-500 mb-1">{stats.totalTasks}</div>
          <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <Activity size={14} />
            Tareas Total
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{stats.completedTasks}</div>
          <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <CheckCircle size={14} />
            Completadas
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-500 mb-1">{stats.pendingTasks}</div>
          <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <Clock size={14} />
            Pendientes
          </div>
        </div>
      </div>

      {/* Formulario de edición */}
      {isEditing && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
            <UserIcon size={20} />
            Editar Información Personal
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Nombre"
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Apellido
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Apellido"
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rol
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Rol en la organización"
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Biografía
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Cuéntanos sobre ti..."
                rows={4}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  username: user?.username || '',
                  email: user?.email || '',
                  firstName: user?.firstName || '',
                  lastName: user?.lastName || '',
                  bio: user?.bio || '',
                  role: user?.role || 'Usuario'
                });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Proyectos */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
          <Users size={20} />
          Mis Proyectos ({userProjects.length})
        </h3>
        
        {userProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProjects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-cyan-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-white">{project.name}</h4>
                    <p className="text-sm text-gray-400">{project.project_key}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.owner_id === user.id 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {project.owner_id === user.id ? 'Owner' : 'Member'}
                  </span>
                </div>
                
                {project.description && (
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{project.members.length} miembros</span>
                  <span>{formatDate(project.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 text-lg">No participas en ningún proyecto aún</p>
            <p className="text-gray-500 text-sm">Únete a un proyecto o crea uno nuevo para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
};
