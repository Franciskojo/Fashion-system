'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Scissors, 
  Sparkles, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push('/');
    } else {
      setErrorMsg(res.error || 'Invalid email or password. Please verify credentials provided by Admin.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 selection:bg-pink-500">
      {/* Top Brand Tagline */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <Scissors className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-pink-300 via-rose-200 to-purple-200 bg-clip-text text-transparent">
              StitchFlow
            </span>
            <span className="ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 bg-purple-500/30 text-purple-200 rounded border border-purple-400/30">
              Enterprise
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-purple-200 font-medium">
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>&ldquo;More Than Tailoring — It&apos;s a Future&rdquo;</span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-8">
        {/* Form Card */}
        <div className="bg-white text-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-black text-gray-900">Sign In to Your Workspace</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Enter your assigned email and password to access your portal
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. evelyn@stitchflow.io or ama.student@stitchflow.io"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Login Password</label>
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
              className="w-full py-3 bg-gradient-to-r from-purple-800 to-pink-700 hover:from-purple-900 hover:to-pink-800 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 text-xs"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-gray-100 text-center text-[11px] text-gray-500">
            Need an account? Please contact StitchFlow Academy Administration or Workshop Reception to be provisioned.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl w-full mx-auto text-center text-xs text-purple-300/60 py-4">
        &copy; 2026 StitchFlow Fashion ERP &amp; Academy Management System.
      </div>
    </div>
  );
}
