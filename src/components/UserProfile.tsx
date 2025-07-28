import React, { useState, useRef } from 'react';
import { useProjectStore } from '../store/project.store';
import { useUserProfile } from '../hooks/useUserProfile';
import { Modal } from './ui/Modal';
import { Camera, Edit3, Users, Calendar, Mail, User as UserIcon, Trash2 } from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = (
  { isOpen, onClose },
) => {
  const {
    user,
    updateProfile,
    updateAvatar,
    removeAvatar,
    processImageFile,
    isLoading,
  } = useUserProfile();
  const { projects } = useProjectStore();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.bio || "",
    role: user?.role || "Usuario",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtrar proyectos donde el usuario es miembro o propietario
  const userProjects = projects.filter((project) =>
    project.members.includes(user?.id || "") || project.owner_id === user?.id
  );

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64Avatar = await processImageFile(file);
      setAvatar(base64Avatar);

      // Si no estamos en modo edición, actualizar inmediatamente
      if (!isEditing) {
        await updateAvatar(base64Avatar);
      }
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Error al procesar la imagen",
      );
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setAvatar("");
      if (!isEditing) {
        await removeAvatar();
      }
    } catch (error) {
      alert("Error al eliminar el avatar");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      // Actualizar el perfil
      await updateProfile(formData);

      // Si hay un nuevo avatar, actualizarlo
      if (avatar !== user?.avatar) {
        if (avatar) {
          await updateAvatar(avatar);
        } else {
          await removeAvatar();
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar el perfil");
    }
  };

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Perfil de Usuario">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header del perfil */}
        <div className="text-center">
          <div className="relative inline-block">
            {avatar
              ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-cyan-500"
                />
              )
              : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(user.username)}
                </div>
              )}

            {isEditing && (
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full transition-colors"
                  title="Cambiar avatar"
                  disabled={isLoading}
                >
                  <Camera size={16} />
                </button>
                {avatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    title="Eliminar avatar"
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.gif,.jpg,.jpeg"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={isLoading}
            />
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-white">
              {formData.firstName && formData.lastName
                ? `${formData.firstName} ${formData.lastName}`
                : formData.username}
            </h2>
            <p className="text-gray-400">@{formData.username}</p>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
          </div>
        </div>

        {/* Botón de edición */}
        <div className="flex justify-center">
          {!isEditing
            ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <Edit3 size={16} />
                Editar Perfil
              </button>
            )
            : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      username: user?.username || "",
                      email: user?.email || "",
                      firstName: user?.firstName || "",
                      lastName: user?.lastName || "",
                      bio: user?.bio || "",
                      role: user?.role || "Usuario",
                    });
                    setAvatar(user?.avatar || "");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              </div>
            )}
        </div>

        {/* Información del usuario */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <UserIcon size={20} />
            Información Personal
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre de Usuario
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                  disabled={isLoading}
                />
              ) : (
                <p className="text-white bg-slate-700 px-3 py-2 rounded-lg">{formData.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                <Mail size={16} className="inline mr-1" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                  disabled={isLoading}
                />
              ) : (
                <p className="text-white bg-slate-700 px-3 py-2 rounded-lg">{formData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                  disabled={isLoading}
                />
              ) : (
                <p className="text-white bg-slate-700 px-3 py-2 rounded-lg">
                  {formData.firstName || 'No especificado'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Apellido
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Apellido"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                  disabled={isLoading}
                />
              ) : (
                <p className="text-white bg-slate-700 px-3 py-2 rounded-lg">
                  {formData.lastName || 'No especificado'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Rol
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Rol en la organización"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
                  disabled={isLoading}
                />
              ) : (
                <p className="text-white bg-slate-700 px-3 py-2 rounded-lg">{formData.role}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                <Calendar size={16} className="inline mr-1" />
                Miembro desde
              </label>
              <p className="text-white bg-slate-700 px-3 py-2 rounded-lg">
                {formatDate(user.created_at)}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Biografía
            </label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Cuéntanos sobre ti..."
                rows={3}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 resize-none"
                disabled={isLoading}
              />
            ) : (
              <p className="text-white bg-slate-700 px-3 py-2 rounded-lg min-h-[80px]">
                {formData.bio || 'No hay biografía disponible'}
              </p>
            )}
          </div>
        </div>

        {/* Proyectos del usuario */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Users size={20} />
            Proyectos ({userProjects.length})
          </h3>
          
          {userProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-700 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{project.name}</h4>
                      <p className="text-sm text-gray-400">{project.project_key}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.owner_id === user.id 
                          ? 'bg-cyan-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {project.owner_id === user.id ? 'Propietario' : 'Miembro'}
                      </span>
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-gray-500 mb-2" />
              <p className="text-gray-400">No participas en ningún proyecto aún</p>
            </div>
          )}
        </div>

        {/* Estadísticas adicionales */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Estadísticas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-500">
                {userProjects.length}
              </div>
              <div className="text-sm text-gray-400">Proyectos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {userProjects.filter((p) => p.owner_id === user.id).length}
              </div>
              <div className="text-sm text-gray-400">Como Propietario</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {userProjects.filter((p) => p.owner_id !== user.id).length}
              </div>
              <div className="text-sm text-gray-400">Como Miembro</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {userProjects.reduce((acc, p) => acc + p.members.length, 0)}
              </div>
              <div className="text-sm text-gray-400">Colaboradores</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
