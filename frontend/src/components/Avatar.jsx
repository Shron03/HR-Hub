import React from 'react';

export default function Avatar({
  name = 'User',
  initials,
  bg = '#2563eb',
  size = 'md',
  className = ''
}) {
  const getInitials = () => {
    if (initials) return initials;
    if (!name) return 'HR';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs font-semibold',
    md: 'w-9 h-9 text-xs font-bold',
    lg: 'w-11 h-11 text-sm font-bold',
    xl: 'w-16 h-16 text-lg font-bold'
  };

  return (
    <div
      style={{ backgroundColor: bg }}
      className={`rounded-full flex items-center justify-center text-white tracking-wider select-none shadow-sm flex-shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={name}
    >
      {getInitials()}
    </div>
  );
}
