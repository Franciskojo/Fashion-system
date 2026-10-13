'use client';

import React, { useState } from 'react';
import { Worker, Order, AttendanceRecord, PayrollRecord, LeaveRequest } from '@/lib/types';
import { 
  Scissors, 
  Clock, 
  CalendarCheck, 
  FileText, 
  DollarSign, 
  CalendarX, 
  CheckCircle2, 
  Sparkles, 
  Heart,
  ChevronRight,
  ArrowRight,
  Send
} from 'lucide-react';

interface WorkerPortalProps {
  worker: Worker;
  assignedOrders: Order[];
  attendance: AttendanceRecord[];
  payroll: PayrollRecord[];
  leaveRequests: LeaveRequest[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onToggleClock: (workerId: string) => void;
  onAdvanceOrderStage: (orderId: string, nextStatus: any, note: string) => void;
  onSubmitLeave: (data: { startDate: string; endDate: string; daysCount: number; leaveType: any; reason: string }) => void;
}

export const WorkerPortal: React.FC<WorkerPortalProps> = ({
  worker,
  assignedOrders,
  attendance,
  payroll,
  leaveRequests,
  activeTab: controlledActiveTab,
  onTabChange,
  onToggleClock,
  onAdvanceOrderStage,
  onSubmitLeave,
}) => {
  const [internalTab, setInternalTab] = useState<'clock' | 'worklogs' | 'attendance' | 'payroll' | 'leaves'>('clock');
  const activeTab = (controlledActiveTab as any) || internalTab;
  const setActiveTab = (tab: any) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Leave form states
  const [startDate, setStartDate] = useState('2026-10-18');
  const [endDate, setEndDate] = useState('2026-10-20');
  const [leaveType, setLeaveType] = useState<'Sick' | 'Annual' | 'Compassionate' | 'Maternity/Paternity'>('Annual');
  const [reason, setReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const workerPayroll = payroll.filter((p) => p.workerId === worker.id || p.workerName === worker.name);
  const workerLeaves = leaveRequests.filter((l) => l.workerId === worker.id || l.workerName === worker.name);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitLeave({
      startDate,
      endDate,
      daysCount: 3,
      leaveType,
      reason,
    });
    setLeaveSubmitted(true);
    setReason('');
    setTimeout(() => setLeaveSubmitted(false), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

      {/* Main Content Workspace (Full Width) */}
      <div className="lg:col-span-4 space-y-6">
        {/* TAB 1: CLOCK TERMINAL */}
        {activeTab === 'clock' && (
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-gray-900">Shift Clock-In Terminal</h3>
                <p className="text-xs text-gray-500">Track daily workshop shift hours, overtime, and punctuality</p>
              </div>
              <div className={`px-4 py-2 rounded-2xl border text-center ${
                worker.isClockedIn ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}>
                <div className="text-[11px] font-bold">Current Status</div>
                <div className="text-base font-black">
                  {worker.isClockedIn ? '● Active on Shift' : '○ Clocked Out'}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl border border-amber-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Clock className="w-8 h-8" />
              </div>
              <div className="text-3xl font-mono font-black text-gray-900">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <p className="text-xs text-gray-600">
                {worker.isClockedIn 
                  ? `Shift started today at ${new Date(worker.lastClockIn || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Ready to begin your tailoring shift for today.'
                }
              </p>

              <button
                onClick={() => onToggleClock(worker.id)}
                className={`px-8 py-3 rounded-2xl font-bold text-sm shadow-md transition-all ${
                  worker.isClockedIn
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                }`}
              >
                {worker.isClockedIn ? 'End Shift (Clock Out)' : 'Start Shift (Clock In)'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: WORK LOGS / ASSIGNED ORDERS */}
        {activeTab === 'worklogs' && (
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">My Assigned Garment Jobs</h3>
                <p className="text-xs text-gray-500">Custom orders assigned to you for cutting, sewing, and fitting</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full">
                {assignedOrders.length} Active Jobs
              </span>
            </div>

            <div className="space-y-4">
              {assignedOrders.map((order) => (
                <div key={order.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
                    <div>
                      <span className="font-mono text-xs font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                        {order.orderNumber}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm mt-1">{order.items[0]?.garmentName}</h4>
                      <p className="text-xs text-gray-500">Client: {order.customerName} ({order.customerPhone})</p>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                        Current Stage: {order.status}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">Due: {order.targetDeliveryDate}</div>
                    </div>
                  </div>

                  {/* Garment Details & Measurements */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-3 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Fabric:</span>
                      <span className="font-medium text-gray-800">{order.items[0]?.fabricType}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Bust/Chest:</span>
                      <span className="font-bold text-gray-900">{order.measurements.bust || order.measurements.chest || 36}&quot;</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Waist:</span>
                      <span className="font-bold text-gray-900">{order.measurements.waist || 28}&quot;</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Full Length:</span>
                      <span className="font-bold text-gray-900">{order.measurements.fullLength || 58}&quot;</span>
                    </div>
                  </div>

                  {/* Stage Progress Action */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-semibold text-emerald-700">
                      Earns GH₵ {worker.commissionPerPiece} on completion
                    </span>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-gray-700">Update Status:</label>
                      <select
                        value={order.status}
                        disabled={order.status === 'delivered'}
                        onChange={(e) => {
                          if (e.target.value !== order.status) {
                            onAdvanceOrderStage(order.id, e.target.value, `Status updated by tailor ${worker.name}`);
                          }
                        }}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold capitalize focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
                      >
                        <option value="received">Received</option>
                        <option value="designing">Designing</option>
                        <option value="sewing">Sewing</option>
                        <option value="finishing">Finishing</option>
                        <option value="ready">Ready</option>
                        {order.status === 'delivered' && <option value="delivered">Delivered</option>}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-gray-900">Work Shift &amp; Attendance Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-bold">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Clock In</th>
                    <th className="pb-3">Clock Out</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700">
                  {attendance.map((rec) => (
                    <tr key={rec.id}>
                      <td className="py-3 font-medium">{rec.date}</td>
                      <td className="py-3 font-bold text-emerald-700">{rec.checkInTime}</td>
                      <td className="py-3 text-gray-500">{rec.checkOutTime || '—'}</td>
                      <td className="py-3">{rec.method}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PAYROLL */}
        {activeTab === 'payroll' && (
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-black text-gray-900">Monthly Compensation &amp; Commission Slips</h3>
              <p className="text-xs text-gray-500">Transparent breakdown of base salary + per-piece tailoring commissions</p>
            </div>

            {/* Current Month Projected Salary Card */}
            <div className="p-6 bg-gradient-to-br from-amber-50 to-purple-50 rounded-3xl border border-amber-200/80 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-amber-200">
                <span className="font-bold text-gray-900 text-sm">September 2026 Earnings Summary</span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                  Disbursed &amp; Paid
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block">Base Salary:</span>
                  <span className="font-bold text-gray-900 text-base">GH₵ {worker.baseSalary}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Completed Pieces:</span>
                  <span className="font-bold text-purple-900 text-base">14 Pieces</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Piece Commissions:</span>
                  <span className="font-bold text-emerald-700 text-base">GH₵ 1,680</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Net Pay Disbursed:</span>
                  <span className="font-black text-purple-950 text-base">GH₵ 4,630</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LEAVES */}
        {activeTab === 'leaves' && (
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-gray-900">Submit Time-Off &amp; Leave Request</h3>

            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={(e: any) => setLeaveType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Annual">Annual Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Compassionate">Compassionate Leave</option>
                    <option value="Maternity/Paternity">Maternity/Paternity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reason / Notes</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain reason for time-off..."
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Leave Request</span>
              </button>

              {leaveSubmitted && (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl font-bold text-xs">
                  ✓ Leave request submitted to management for review!
                </div>
              )}
            </form>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 text-sm mb-3">Your Past Leave Requests</h4>
              <div className="space-y-2">
                {workerLeaves.map((l) => (
                  <div key={l.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{l.leaveType} Leave ({l.daysCount} Days)</span>
                      <p className="text-[11px] text-gray-500">{l.startDate} to {l.endDate} — &quot;{l.reason}&quot;</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      l.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
