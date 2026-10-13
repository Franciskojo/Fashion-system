'use client';

import React from 'react';
import { Role } from '@/lib/types';
import {
  GraduationCap,
  Scissors,
  ShoppingBag,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Heart,
  Layers,
  ArrowDown
} from 'lucide-react';

interface InfographicHeroProps {
  onSelectRole: (role: Role) => void;
}

export const InfographicHero: React.FC<InfographicHeroProps> = ({ onSelectRole }) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-950 to-fuchsia-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-purple-800/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-pink-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              Unified Fashion ERP &amp; Academy System
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              One System. <span className="bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent">Many Possibilities.</span>
            </h1>
            <p className="text-purple-200 text-sm sm:text-base leading-relaxed">
              Students, Workers, Customers and Your Entire Tailoring Business — All seamlessly integrated in one place.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-right shrink-0">
            <div className="flex items-center justify-end gap-1.5 text-pink-300 font-serif italic text-lg">
              <span>&ldquo;More Than Tailoring, It&apos;s a Future&rdquo;</span>
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-purple-200 mt-1 uppercase tracking-widest font-medium">
              Designing People • Creating Opportunities • Stitching the Future
            </p>
          </div>
        </div>
      </div>

      {/* 5 User Roles Bar (Interactive Jump Cards) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Interactive User Roles &amp; Portals
            </h2>
          </div>
          <span className="text-xs text-gray-500">Click any role to launch its interactive workspace</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Owner */}
          <div
            onClick={() => onSelectRole('owner')}
            className="group relative bg-white hover:bg-purple-50/50 p-4 rounded-2xl border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-3 mb-2.5">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden ring-2 ring-purple-200 group-hover:ring-purple-400">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                    alt="Owner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-purple-900 text-sm flex items-center gap-1">
                    Owner
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                    Full Access
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Full access, financial reports, shop settings and oversee overall business growth.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] text-purple-700 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Admin / Reception */}
          <div
            onClick={() => onSelectRole('admin')}
            className="group relative bg-white hover:bg-blue-50/50 p-4 rounded-2xl border border-blue-100 hover:border-blue-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-3 mb-2.5">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden ring-2 ring-blue-200 group-hover:ring-blue-400">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Admin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-900 text-sm flex items-center gap-1">
                    Admin / Reception
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    Operations
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Register students, workers, customer intakes and manage daily shop operations.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-blue-50 flex items-center justify-between text-[11px] text-blue-700 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>Open Reception</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Student */}
          <div
            onClick={() => onSelectRole('student')}
            className="group relative bg-white hover:bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-3 mb-2.5">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden ring-2 ring-emerald-200 group-hover:ring-emerald-400">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80"
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-emerald-900 text-sm flex items-center gap-1">
                    Student (Ama)
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Academy Portal
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mark attendance via QR/PIN, view progress, pay fees, and earn verified certificates.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-50 flex items-center justify-between text-[11px] text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>Open Student Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Worker */}
          <div
            onClick={() => onSelectRole('worker')}
            className="group relative bg-white hover:bg-amber-50/50 p-4 rounded-2xl border border-amber-100 hover:border-amber-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-3 mb-2.5">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden ring-2 ring-amber-200 group-hover:ring-amber-400">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
                    alt="Worker"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-amber-900 text-sm flex items-center gap-1">
                    Worker (Akosua)
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    Staff Terminal
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Clock in/out terminal, view active work logs, see payroll commissions and submit leaves.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-50 flex items-center justify-between text-[11px] text-amber-700 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>Open Staff Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Customer */}
          <div
            onClick={() => onSelectRole('customer')}
            className="group relative bg-white hover:bg-rose-50/50 p-4 rounded-2xl border border-rose-100 hover:border-rose-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-3 mb-2.5">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden ring-2 ring-rose-200 group-hover:ring-rose-400">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                    alt="Customer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-rose-900 text-sm flex items-center gap-1">
                    Customer
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                    Bespoke Orders
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Place bespoke orders, enter measurements, make payments, and live track sewing progress.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-rose-50 flex items-center justify-between text-[11px] text-rose-700 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>Open Customer Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* STITCHFLOW SYSTEM Central Core Architecture Map */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-purple-900 font-black text-xl tracking-tight">
            <Scissors className="w-5 h-5 text-pink-600" />
            <span>STITCHFLOW SYSTEM ARCHITECTURE</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Integrated Core Modules for Tailoring Business Operations &amp; Fashion School Academy
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1: Student Management */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 pb-3 border-b border-emerald-200/80 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-emerald-950 text-sm">Student Management</h4>
              </div>
              <ul className="space-y-2 text-xs text-emerald-900 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Student Registration &amp; Profiles
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  QR / PIN Attendance Logging
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Courses &amp; Class Schedules
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Fee Management &amp; Invoices
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Syllabus Progress Tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Verified Digital Certificates
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectRole('student')}
              className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors text-center"
            >
              Explore Student Module
            </button>
          </div>

          {/* Pillar 2: Worker Management */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 pb-3 border-b border-amber-200/80 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                  <Scissors className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-amber-950 text-sm">Worker Management</h4>
              </div>
              <ul className="space-y-2 text-xs text-amber-900 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Worker / Tailor Registration
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Attendance (Clock In / Clock Out)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Work Logs &amp; Job Queues
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Automated Payroll Calculation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Performance &amp; Quality Tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Leave Requests &amp; Approvals
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectRole('worker')}
              className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors text-center"
            >
              Explore Worker Module
            </button>
          </div>

          {/* Pillar 3: Customer Order Management */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 pb-3 border-b border-rose-200/80 mb-3">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-rose-950 text-sm">Order Management</h4>
              </div>
              <ul className="space-y-2 text-xs text-rose-900 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Place Custom &amp; Bespoke Orders
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Upload Design Photos &amp; Style
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Visual Body Measurement Vault
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Multi-Stage Payment Invoicing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Live 6-Step Order Tracker
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Fitting, Delivery &amp; Pickup Logs
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectRole('customer')}
              className="mt-4 w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors text-center"
            >
              Explore Order Module
            </button>
          </div>

          {/* Pillar 4: Reports & Analytics */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 pb-3 border-b border-sky-200/80 mb-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sky-950 text-sm">Reports &amp; Analytics</h4>
              </div>
              <ul className="space-y-2 text-xs text-sky-900 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  Student &amp; Staff Attendance Logs
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  Payroll &amp; Piece Commission Logs
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  Order Pipeline &amp; Bottlenecks
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  Revenue, Sales &amp; Fee Insights
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  Student Completion &amp; Grades
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  Business Growth Intelligence
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectRole('owner')}
              className="mt-4 w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors text-center"
            >
              Explore Analytics Module
            </button>
          </div>
        </div>
      </div>

      {/* Key Benefits Section from Infographic */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50/40 to-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-purple-700" />
          <h3 className="text-base font-bold text-purple-950 tracking-tight">
            Key Enterprise Benefits of StitchFlow
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-purple-100/60 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-gray-900">Saves Time &amp; Eliminates Manual Books</h5>
              <p className="text-[11px] text-gray-500">Automates paper records, fee cards, paper receipts and fabric tags.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-purple-100/60 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-gray-900">Accurate Tailor Payroll &amp; Commissions</h5>
              <p className="text-[11px] text-gray-500">Calculates exact base salary plus per-garment completed commission bonuses.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-purple-100/60 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-gray-900">Enhanced Fashion Student Academy</h5>
              <p className="text-[11px] text-gray-500">Tracks syllabus milestones, attendance QR codes, fee installments and certificates.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-purple-100/60 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-gray-900">Seamless Local &amp; Diaspora Orders</h5>
              <p className="text-[11px] text-gray-500">Online bespoke orders, measurement vault, and transparent stage tracking.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-purple-100/60 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-gray-900">Modern &amp; Professional Brand Image</h5>
              <p className="text-[11px] text-gray-500">Elevates the fashion house credibility with automated receipts and certificates.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-purple-100/60 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-gray-900">All Operations In One Single Place</h5>
              <p className="text-[11px] text-gray-500">No more juggling separate WhatsApp chats, sticky notes, and spreadsheets.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
