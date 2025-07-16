import React from 'react';
import { UserAvatar } from './ui/UserAvatar';
import type { User } from '../types/index.types';

interface UserProfileMiniProps {
  user: User;
  onClick?: () => void;
  showEmail?: boolean;
  className?: string;
}

export const UserProfileMini: React.FC<UserProfileMiniProps> = ({ 
  user, 
  onClick, 
  showEmail = false,
  className = '' 
}) => {
  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  return (
    <div 
      className={`flex items-center gap-3 ${onClick ? 'cursor-pointer hover:bg-slate-700 rounded-lg p-2 transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      <UserAvatar user={user} size="md" showTooltip={!onClick} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">
          {getDisplayName()}
        </div>
        <div className="text-xs text-gray-400 truncate">
          @{user.username}
          {showEmail && user.email && (
            <span className="block">{user.email}</span>
          )}
        </div>
        {user.role && (
          <div className="text-xs text-cyan-400 truncate">
            {user.role}
          </div>
        )}
      </div>
    </div>
  );
};
