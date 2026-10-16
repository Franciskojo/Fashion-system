'use client';

import React, { useState } from 'react';
import { Role } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { 
  Sparkles, 
  Menu,
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  Scissors, 
  ShoppingBag,
  Clock,
  Sparkle,
  LogIn,
  LogOut,
  ChevronDown
} from 'lucide-react';

import { alertConfirm, showToast } from '@/lib/alerts';

interface NavbarProps {
  activeRole: Role;
  onSelectRole?: (role: Role) => void;
  onOpenAuthModal: () => void;
  onToggleMobileSidebar?: () => void;
  stats?: {
    totalRevenue: number;
    activeWorkers: number;
    totalStudents: number;
    inProgressOrders: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onOpenAuthModal,
  onToggleMobileSidebar,
  stats,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = async () => {
    setShowUserDropdown(false);
    const confirmed = await alertConfirm({
      title: 'Sign Out?',
      text: 'Are you sure you want to log out of your StitchFlow session?',
      confirmText: 'Yes, Sign Out',
      cancelText: 'Stay Logged In',
      icon: 'question',
    });
    if (confirmed) {
      showToast.info('Signing out of StitchFlow...');
      await logout();
    }
  };

  const roleTitles: Record<Role, { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
    owner: { title: 'Executive Owner Dashboard', subtitle: 'Business intelligence, revenue & school metrics', icon: ShieldCheck, color: 'text-purple-700' },
    admin: { title: 'Admin & Reception Desk', subtitle: 'Accounts vault, registrations & attendance register', icon: UserCheck, color: 'text-blue-700' },
    student: { title: 'Student Academy Hub', subtitle: 'Ama Mensah • Syllabus milestones & diploma', icon: GraduationCap, color: 'text-emerald-700' },
    worker: { title: 'Tailoring Staff Terminal', subtitle: 'Akosua Boateng • Shift clock & garment queue', icon: Scissors, color: 'text-amber-700' },
    customer: { title: 'Customer Bespoke Hub', subtitle: 'Nana Yaa • Custom orders & 6-step live tracker', icon: ShoppingBag, color: 'text-rose-700' },
  };

  const currentRoleInfo = roleTitles[activeRole] || roleTitles.owner;
  const CurrentIcon = currentRoleInfo.icon;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-2xs">
      {/* Top Banner Tagline */}
      <div className="bg-gradient-to-r from-purple-900 via-fuchsia-800 to-pink-700 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 sm:gap-2 text-center sm:text-left">
          <div className="flex items-center space-x-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
            <span>&ldquo;More Than Tailoring — It&apos;s a Future&rdquo;</span>
            <span className="hidden md:inline text-purple-200">|</span>
            <span className="hidden md:inline text-purple-100 font-light">Designing People • Creating Opportunities • Stitching the Future</span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-pink-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-pink-300" />
              Live Operations
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Left: Hamburger & Current View Title */}
        <div className="flex items-center space-x-3.5">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-purple-50 border border-gray-200 transition-colors"
            title="Open Sidebar Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Current Portal Indicator */}
          <div className="flex items-center space-x-2.5">
            <div className={`w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center ${currentRoleInfo.color} border border-purple-100 shadow-2xs`}>
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-gray-900 leading-tight flex items-center gap-1.5">
                <span>{currentRoleInfo.title}</span>
              </h1>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
                {currentRoleInfo.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Stat & User Menu */}
        <div className="flex items-center space-x-3">

          {/* User Profile Pill */}
          <div className="relative">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-1.5 rounded-2xl hover:bg-purple-50 border border-purple-100 transition-all text-xs text-left"
                >
                  <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-purple-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-bold text-gray-900 leading-tight">{user.name}</div>
                    <span className="text-[10px] uppercase font-black px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 top-12 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5 z-50 animate-in fade-in zoom-in duration-150 text-xs">
                    <div className="p-2 border-b border-gray-100 mb-1.5">
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-gray-500 truncate text-[11px]">{user.email}</div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-700 font-semibold flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-rose-600" />
                          <span>Sign Out</span>
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-800 to-pink-700 hover:from-purple-900 hover:to-pink-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
