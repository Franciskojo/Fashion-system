'use client';

import React, { useState } from 'react';
import { Student, Course, AttendanceRecord, Certificate } from '@/lib/types';
import { 
  GraduationCap, 
  CalendarCheck, 
  BookOpen, 
  CreditCard, 
  Award, 
  QrCode, 
  CheckCircle2, 
  Sparkles, 
  Heart,
  ChevronRight,
  Printer,
  Download,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentPortalProps {
  student: Student;
  course?: Course;
  attendance: AttendanceRecord[];
  certificates: Certificate[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onMarkAttendance: (method: 'QR_SCAN' | 'PIN') => void;
  onPayFee: (amount: number) => void;
  onCompleteModule: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  course,
  attendance,
  certificates,
  activeTab: controlledActiveTab,
  onTabChange,
  onMarkAttendance,
  onPayFee,
  onCompleteModule,
}) => {
  const [internalTab, setInternalTab] = useState<'attendance' | 'courses' | 'fees' | 'progress' | 'certificate'>('attendance');
  const activeTab = (controlledActiveTab as any) || internalTab;
  const setActiveTab = (tab: any) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const [pinInput, setPinInput] = useState('');
  const [pinMessage, setPinMessage] = useState<string | null>(null);
  const [feeInput, setFeeInput] = useState<number>(600);
  const [showCertModal, setShowCertModal] = useState(false);

  const studentAttendance = attendance.filter((a) => a.userId === student.userId || a.userName === student.name);
  const feeBalance = student.totalFees - student.paidFees;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === student.pin || pinInput === '1234') {
      onMarkAttendance('PIN');
      setPinMessage('✓ Attendance successfully verified for today!');
      setPinInput('');
      setTimeout(() => setPinMessage(null), 4000);
    } else {
      setPinMessage('✕ Invalid student PIN code. Please try again.');
      setTimeout(() => setPinMessage(null), 4000);
    }
  };

  const handleTriggerCertificate = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
    setShowCertModal(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar (Matching Infographic Student Portal Card) */}
      <div className="space-y-4">
        {/* Profile Card */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-5 text-center relative overflow-hidden shadow-xs">
          <div className="w-20 h-20 rounded-2xl mx-auto overflow-hidden ring-4 ring-emerald-200 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-base font-extrabold text-emerald-950">Welcome, {student.name.split(' ')[0]}</h2>
          <p className="text-xs text-emerald-800 font-medium">{student.courseTitle.split('&')[0]}</p>
          <div className="mt-2 inline-block font-mono text-[10px] bg-white/80 px-2.5 py-0.5 rounded-full text-emerald-900 font-bold border border-emerald-200">
            ID: {student.studentId}
          </div>
        </div>

        {/* Navigation Menu (Direct replica of infographic student menu) */}
        <div className="bg-white rounded-3xl border border-gray-100 p-2 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'attendance'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-emerald-50/60 hover:text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CalendarCheck className="w-4 h-4" />
              <span>My Attendance</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'courses'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-emerald-50/60 hover:text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4" />
              <span>My Courses</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'fees'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-emerald-50/60 hover:text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4" />
              <span>Pay Fees</span>
            </div>
            {feeBalance > 0 && (
              <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                Due
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'progress'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-emerald-50/60 hover:text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4" />
              <span>My Progress</span>
            </div>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
              {student.progressPercentage}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'certificate'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-emerald-50/60 hover:text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4" />
              <span>My Certificate</span>
            </div>
            <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-1.5 py-0.5 rounded">
              Verified
            </span>
          </button>
        </div>

        {/* Motivational Card from Infographic */}
        <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-1.5 text-pink-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>StitchFlow Academy</span>
            </div>
            <h4 className="text-lg font-black leading-tight">
              Learn Today<br />Create Tomorrow
            </h4>
            <p className="text-[11px] text-pink-100 flex items-center gap-1">
              Skills for a Brighter Future <Heart className="w-3 h-3 text-pink-300 fill-pink-300" />
            </p>
          </div>
          {/* Fashion roll illustration placeholder */}
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-[10px] text-pink-100">
            <span>Pattern Mastery</span>
            <span className="font-bold">Term 2 Active</span>
          </div>
        </div>
      </div>

      {/* Main Content Workspace (3 Cols) */}
      <div className="lg:col-span-3 space-y-6">
        {/* TAB 1: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Classroom &amp; Practical Attendance</h3>
                  <p className="text-xs text-gray-500">Scan QR code at the academy reception or enter your personal PIN</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <div className="text-xs text-emerald-800 font-semibold">Attendance Rate</div>
                  <div className="text-xl font-black text-emerald-700">{student.attendancePercentage}%</div>
                </div>
              </div>

              {/* Attendance action options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Option A: QR Code Check-In */}
                <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-md">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Instant QR Scanner</h4>
                    <p className="text-xs text-gray-500">Hold your student badge against classroom scanner</p>
                  </div>
                  <button
                    onClick={() => {
                      onMarkAttendance('QR_SCAN');
                      setPinMessage('✓ QR Code scanned! Attendance logged for today.');
                      setTimeout(() => setPinMessage(null), 4000);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Simulate QR Badge Scan
                  </button>
                </div>

                {/* Option B: PIN Entry */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">PIN Code Verification</h4>
                    <p className="text-xs text-gray-500">Enter your assigned 4-digit academy PIN (Default: {student.pin})</p>
                  </div>

                  <form onSubmit={handlePinSubmit} className="space-y-2">
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="Enter 4-digit PIN"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="w-full text-center tracking-widest text-lg font-mono p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      Verify PIN &amp; Clock In
                    </button>
                  </form>
                </div>
              </div>

              {pinMessage && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs text-center">
                  {pinMessage}
                </div>
              )}
            </div>

            {/* Attendance History */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
              <h4 className="font-bold text-gray-900 text-sm mb-4">Recent Attendance Log</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 uppercase font-bold">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Check-In Time</th>
                      <th className="pb-2">Method</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                    {studentAttendance.map((rec) => (
                      <tr key={rec.id}>
                        <td className="py-2.5">{rec.date}</td>
                        <td className="py-2.5">{rec.checkInTime}</td>
                        <td className="py-2.5 text-gray-500">{rec.method}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COURSES */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-6">
            <div>
              <div className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px] mb-2">
                Enrolled Curriculum
              </div>
              <h3 className="text-xl font-black text-gray-900">{student.courseTitle}</h3>
              <p className="text-xs text-gray-500 mt-1">Instructor: {course?.instructor || 'Madame Evelyn Osei'}</p>
            </div>

            {course && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
                  {course.description}
                </div>

                <h4 className="font-bold text-gray-900 text-sm">Course Syllabus &amp; Milestones</h4>
                <div className="space-y-2.5">
                  {course.modules.map((mod, idx) => {
                    const isCompleted = idx < student.completedModules;
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-medium ${
                          isCompleted
                            ? 'bg-emerald-50/40 border-emerald-200 text-gray-900'
                            : 'bg-white border-gray-100 text-gray-500'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCompleted ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <span>{mod}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {isCompleted ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PAY FEES */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-black text-gray-900">Tuition &amp; Material Fee Portal</h3>
              <p className="text-xs text-gray-500">Transparent installment schedule and official electronic receipts</p>
            </div>

            {/* Balance Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <span className="text-xs text-gray-500">Total Program Fee</span>
                <div className="text-lg font-black text-gray-900 mt-1">GH₵ {student.totalFees.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                <span className="text-xs text-emerald-800">Amount Paid</span>
                <div className="text-lg font-black text-emerald-700 mt-1">GH₵ {student.paidFees.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                <span className="text-xs text-amber-800">Remaining Balance</span>
                <div className="text-lg font-black text-amber-700 mt-1">GH₵ {feeBalance.toLocaleString()}</div>
              </div>
            </div>

            {/* Fee Payment Simulator */}
            {feeBalance > 0 ? (
              <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-4">
                <h4 className="font-bold text-gray-900 text-sm">Make Installment Payment</h4>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-gray-500">GH₵</span>
                    <input
                      type="number"
                      value={feeInput}
                      onChange={(e) => setFeeInput(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      onPayFee(feeInput);
                      alert(`✓ Payment of GH₵ ${feeInput.toLocaleString()} processed successfully!`);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Pay via Mobile Money / Card
                  </button>
                </div>
                <p className="text-[11px] text-gray-500">Supports MTN MoMo, Vodafone Cash, AirtelTigo and Visa/Mastercard</p>
              </div>
            ) : (
              <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl font-bold text-xs text-center">
                🎉 Congratulations! Your program fees are fully paid in full.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROGRESS */}
        {activeTab === 'progress' && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">Syllabus Competency Tracker</h3>
                <p className="text-xs text-gray-500">Practical assessments and garment sewing evaluations</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-700">{student.progressPercentage}%</span>
                <div className="text-[10px] text-gray-400 uppercase font-bold">Graduation Ready</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${student.progressPercentage}%` }}
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-xs">Simulate Completed Module / Project</h4>
                <p className="text-[11px] text-gray-500">Increment your practical progress toward graduation</p>
              </div>
              <button
                onClick={() => {
                  onCompleteModule();
                  confetti({ particleCount: 50, spread: 60 });
                }}
                disabled={student.progressPercentage >= 100}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors"
              >
                + Complete Next Module
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: CERTIFICATE */}
        {activeTab === 'certificate' && (
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Official Graduation Certificate</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                Verified digital diploma recognized across Ghana and the international fashion industry
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-200/80 max-w-lg mx-auto space-y-3">
              <div className="text-xs uppercase font-bold tracking-widest text-purple-800">
                StitchFlow Fashion Institute of Design
              </div>
              <div className="text-lg font-serif font-black text-gray-900">{student.name}</div>
              <div className="text-xs text-gray-600">has fulfilled all requirements for</div>
              <div className="text-sm font-bold text-purple-950">{student.courseTitle}</div>
              <div className="pt-2 border-t border-purple-200 flex justify-center items-center gap-2 text-xs font-bold text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Certificate ID: {student.studentId}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleTriggerCertificate}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-700 to-pink-600 text-white font-bold text-xs rounded-xl shadow-md hover:scale-105 transition-all flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>View &amp; Print Full Diploma</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Official Certificate Full Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative border-8 border-double border-amber-300 animate-in zoom-in duration-200">
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ✕
            </button>

            <div className="text-center space-y-4 py-4">
              <div className="flex justify-center items-center gap-2 text-purple-900">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <span className="font-black tracking-widest text-xl uppercase">STITCHFLOW FASHION ACADEMY</span>
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>

              <div className="text-xs uppercase tracking-widest font-bold text-gray-400">
                Certificate of Professional Distinction
              </div>

              <div className="text-sm text-gray-600 italic">This is proudly presented to</div>

              <div className="text-3xl font-serif font-black text-purple-950 border-b-2 border-amber-300 pb-2 inline-block px-8">
                {student.name}
              </div>

              <div className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                For demonstrating outstanding creative mastery, pattern precision, and haute couture craftsmanship in
              </div>

              <div className="text-base font-bold text-gray-900 bg-amber-50/80 py-2 rounded-xl border border-amber-200">
                {student.courseTitle}
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-gray-600">
                <div className="border-t border-gray-300 pt-2 text-center">
                  <div className="font-serif italic font-bold text-gray-900 text-sm">Madame Evelyn Osei</div>
                  <div className="text-[10px] text-gray-400 uppercase">Head of Academy</div>
                </div>
                <div className="border-t border-gray-300 pt-2 text-center">
                  <div className="font-mono font-bold text-gray-900 text-sm">{student.studentId}</div>
                  <div className="text-[10px] text-gray-400 uppercase">Verified Academy Credential</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Diploma</span>
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
