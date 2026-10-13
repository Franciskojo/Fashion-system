'use client';

import React from 'react';
import { Role } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { 
  Scissors, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  ShoppingBag, 
  Sparkles, 
  LogOut, 
  KeyRound, 
  Clock, 
  PlusCircle,
  ChevronRight,
  TrendingUp,
  Users,
  CalendarCheck,
  BookOpen,
  CreditCard,
  Award,
  CalendarX,
  DollarSign,
  Ruler,
  Sparkle,
  Lock
} from 'lucide-react';

interface SidebarProps {
  activeRole: Role;
  activeSubTab?: string;
  onSelectSubTab?: (tab: string) => void;
  onSelectRole?: (role: Role) => void;
  onOpenAuthModal: () => void;
  onOpenNewStudent?: () => void;
  onOpenNewWorker?: () => void;
  onOpenNewOrder?: () => void;
  onToggleClock?: () => void;
  isClockedIn?: boolean;
  stats?: {
    totalRevenue: number;
    activeWorkers: number;
    totalStudents: number;
    inProgressOrders: number;
  };
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRole,
  activeSubTab,
  onSelectSubTab,
  onSelectRole,
  onOpenAuthModal,
  onOpenNewStudent,
  onOpenNewWorker,
  onOpenNewOrder,
  onToggleClock,
  isClockedIn = false,
  stats,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();

  // Current effective role based on authenticated user or active view
  const currentRole = user?.role || activeRole;

  // Role-specific navigation menus (Strictly showing only what each user is supposed to see)
  const getNavItemsForRole = (role: Role) => {
    switch (role) {
      case 'owner':
        return {
          sectionTitle: 'Owner Executive Hub',
          badge: 'Executive',
          badgeColor: 'bg-purple-100 text-purple-900',
          items: [
            { id: 'overview', label: 'Executive Dashboard', icon: ShieldCheck, sub: 'Revenue & Operations' },
            { id: 'academy', label: 'Academy Oversight', icon: GraduationCap, sub: 'Students & Completion' },
            { id: 'courses', label: 'Course Curricula & Syllabi', icon: BookOpen, sub: 'Programs & Modules' },
            { id: 'artisans', label: 'Tailor Productivity', icon: Scissors, sub: 'Commissions & Output' },
            { id: 'pipeline', label: 'Production Pipeline', icon: ShoppingBag, sub: 'Active Garments' },
            { id: 'financials', label: 'Financial & Payroll', icon: DollarSign, sub: 'Monthly Audit' },
          ],
        };

      case 'admin':
        return {
          sectionTitle: 'Admin & Reception',
          badge: 'Management',
          badgeColor: 'bg-blue-100 text-blue-900',
          items: [
            { id: 'students', label: 'Student Directory', icon: GraduationCap, sub: 'Enrollment & Fees' },
            { id: 'workers', label: 'Staff & Tailor Roster', icon: Users, sub: 'Shift Roster & Rates' },
            { id: 'accounts', label: 'Accounts & Passwords', icon: KeyRound, sub: 'Credentials Vault' },
            { id: 'attendance', label: 'Attendance Master Log', icon: CalendarCheck, sub: 'Daily QR/PIN Check-ins' },
            { id: 'orders', label: 'Workshop Dispatch', icon: ShoppingBag, sub: 'Garments & Tailor Assignment' },
            { id: 'courses', label: 'Course Curricula', icon: BookOpen, sub: 'Syllabus & Schedules' },
          ],
        };

      case 'student':
        return {
          sectionTitle: 'Student Academy Hub',
          badge: 'Enrolled Student',
          badgeColor: 'bg-emerald-100 text-emerald-900',
          items: [
            { id: 'attendance', label: 'My Attendance', icon: CalendarCheck, sub: 'QR Scanner & PIN' },
            { id: 'courses', label: 'My Courses & Syllabus', icon: BookOpen, sub: 'Curriculum Checklist' },
            { id: 'fees', label: 'Pay Program Fees', icon: CreditCard, sub: 'Installments & Receipts' },
            { id: 'progress', label: 'My Learning Progress', icon: Sparkles, sub: 'Module Milestones' },
            { id: 'certificate', label: 'My Verified Diploma', icon: Award, sub: 'Official Certificate' },
          ],
        };

      case 'worker':
        return {
          sectionTitle: 'Tailoring Staff Terminal',
          badge: 'Artisan Staff',
          badgeColor: 'bg-amber-100 text-amber-900',
          items: [
            { id: 'clock', label: 'Shift Clock Terminal', icon: Clock, sub: 'Start / End Work Shift' },
            { id: 'worklogs', label: 'My Assigned Jobs', icon: Scissors, sub: 'Active Garment Tasks' },
            { id: 'attendance', label: 'My Shift History', icon: CalendarCheck, sub: 'Hours & Punctuality' },
            { id: 'payroll', label: 'My Payroll & Slips', icon: DollarSign, sub: 'Commissions per Piece' },
            { id: 'leaves', label: 'Leave Requests', icon: CalendarX, sub: 'Submit Time-off' },
          ],
        };

      case 'customer':
        return {
          sectionTitle: 'Customer Bespoke Hub',
          badge: 'Client',
          badgeColor: 'bg-rose-100 text-rose-900',
          items: [
            { id: 'orders', label: 'My Custom Orders', icon: ShoppingBag, sub: 'Garment History' },
            { id: 'track', label: 'Live 6-Step Tracker', icon: Clock, sub: 'Cutting, Sewing & Ready' },
            { id: 'measurements', label: 'Measurement Vault', icon: Ruler, sub: 'Visual Anatomy Guide' },
          ],
        };

      default:
        return {
          sectionTitle: 'Workspace Navigation',
          badge: 'User',
          badgeColor: 'bg-gray-100 text-gray-800',
          items: [],
        };
    }
  };

  const currentNav = getNavItemsForRole(currentRole);

  const handleItemClick = (id: string) => {
    if (onSelectSubTab) {
      onSelectSubTab(id);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-purple-100 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } shadow-xl lg:shadow-none`}>
        
        {/* Top: Brand Header & User Profile */}
        <div className="overflow-y-auto no-scrollbar">
          <div className="p-5 border-b border-purple-50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-700 via-pink-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-purple-500/30">
                <Scissors className="w-5 h-5 -rotate-45" />
                <Sparkle className="w-2.5 h-2.5 absolute -top-1 -right-1 text-pink-200 fill-pink-200 animate-ping" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-900 via-fuchsia-800 to-pink-600 bg-clip-text text-transparent">
                    StitchFlow
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                  Fashion ERP &amp; Academy
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                ✕
              </button>
            )}
          </div>



          {/* Dedicated Navigation Menu for Currently Logged-In User */}
          <div className="px-3 space-y-1.5 pt-1">
            <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center justify-between">
              <span>{currentNav.sectionTitle}</span>
              <span className="text-[9px] lowercase font-normal bg-gray-100 text-gray-600 px-1.5 rounded">
                {currentNav.items.length} tools
              </span>
            </div>

            {currentNav.items.map((item, index) => {
              const Icon = item.icon;
              // Default active to the first item if not set, or matched by activeSubTab
              const isActive = activeSubTab ? activeSubTab === item.id : index === 0;

              const activeColorClass: Record<Role, string> = {
                owner: 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white shadow-md shadow-purple-900/20',
                admin: 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md shadow-blue-800/20',
                student: 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md shadow-emerald-800/20',
                worker: 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-md shadow-amber-800/20',
                customer: 'bg-gradient-to-r from-rose-600 to-pink-700 text-white shadow-md shadow-rose-800/20',
              };

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? activeColorClass[currentRole] || 'bg-purple-900 text-white'
                      : 'text-gray-700 hover:bg-purple-50/70 hover:text-purple-900'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left truncate">
                      <div className="leading-tight">{item.label}</div>
                      <div className={`text-[10px] font-normal truncate ${
                        isActive ? 'text-white/80' : 'text-gray-400'
                      }`}>
                        {item.sub}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 opacity-50 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                </button>
              );
            })}
          </div>

          {currentRole === 'student' && (
            <div className="p-4 mx-3 my-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 space-y-1 text-xs text-emerald-950">
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Learn Today, Create Tomorrow</span>
              </div>
              <p className="text-[11px] text-emerald-800">Check in daily via QR badge or personal PIN.</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
