'use client';

import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showLockIcon?: boolean;
}

export function PasswordInput({
  showLockIcon = true,
  className = '',
  disabled,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      {showLockIcon && (
        <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
      )}
      <input
        type={showPassword ? 'text' : 'password'}
        disabled={disabled}
        className={`w-full bg-[#060a17] border border-white/15 ${
          showLockIcon ? 'pl-10' : 'pl-4'
        } pr-11 py-3 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:border-[var(--color-yellow)] transition-colors disabled:opacity-50 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer disabled:pointer-events-none"
        title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {showPassword ? (
          <FiEyeOff className="w-4 h-4 text-[var(--color-yellow)]" />
        ) : (
          <FiEye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
