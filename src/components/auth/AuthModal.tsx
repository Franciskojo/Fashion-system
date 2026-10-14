'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/lib/types';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRole?: (role: Role) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessRole }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign Up Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (onSuccessRole) {
        // Will match user's role
      }
      onClose();
    } else {
      setErrorMsg(res.error || 'Authentication failed');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await register(regName, regEmail, regPassword, regPhone);
    setIsSubmitting(false);

    if (res.success) {
      if (onSuccessRole) onSuccessRole('customer');
      onClose();
    } else {
      setErrorMsg(res.error || 'Registration failed');
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in duration-200 border border-purple-100 my-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 via-pink-600 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">
                {tab === 'signin' ? 'StitchFlow Sign In' : 'Join StitchFlow'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Enterprise Fashion ERP &amp; Academy Access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => {
              setTab('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              tab === 'signin' ? 'bg-white text-purple-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              tab === 'signup' ? 'bg-white text-purple-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB: SIGN IN FORM */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. evelyn@stitchflow.io"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-purple-800 to-pink-700 hover:from-purple-900 hover:to-pink-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB: SIGN UP FORM */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Abena Mensah"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="abena@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+233 24..."
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={regPassword}
                  minLength={8}
                  autoComplete="new-password"
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-purple-800 to-pink-700 hover:from-purple-900 hover:to-pink-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
