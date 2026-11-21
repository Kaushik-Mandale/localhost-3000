import React, { useState } from 'react';
import { X, Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Client-side authentication credentials for local demonstration
const AUTH_CONFIG = {
  adminId: 'kaushik',
  adminPassword: '321',
};

export const LoginModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Both Username / ID and Password are required.');
      return;
    }

    if (
      username.trim().toLowerCase() === AUTH_CONFIG.adminId.toLowerCase() &&
      password === AUTH_CONFIG.adminPassword
    ) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setUsername('');
        setPassword('');
        onSuccess();
      }, 700);
    } else {
      setError('Invalid ID or Password. Please verify your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 select-none">
      <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-2">
            <Lock size={15} className="text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-xs text-neutral-800 dark:text-neutral-200">
              Admin Authentication
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
            Sign in to access the <span className="font-semibold text-neutral-800 dark:text-neutral-200">Practical Program Manager</span> to add, edit, or delete practical notebooks.
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div className="flex items-center space-x-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={14} className="flex-shrink-0" />
              <span>Authentication successful! Launching manager...</span>
            </div>
          )}

          {/* Username / ID */}
          <div className="space-y-1">
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium">
              Username / ID
            </label>
            <div className="relative">
              <User size={13} className="absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter ID (e.g. kaushik)"
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-2.5 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full pl-8 pr-8 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-sm"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
