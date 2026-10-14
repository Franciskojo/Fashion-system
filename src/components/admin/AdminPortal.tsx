'use client';

import React, { useState } from 'react';
import { Student, Worker, Order, Course, AttendanceRecord, User } from '@/lib/types';
import { 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  Search, 
  UserPlus, 
  QrCode, 
  CalendarCheck,
  ShoppingBag, 
  Clock, 
  BookOpen, 
  KeyRound, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Lock, 
  RefreshCw, 
  PlusCircle,
  ArrowLeft,
  Edit3,
  Save,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Award,
  Ruler,
  Scissors,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Plus,
  Trash2,
  User as UserIcon
} from 'lucide-react';

interface AdminPortalProps {
  students: Student[];
  workers: Worker[];
  orders: Order[];
  courses: Course[];
  attendance: AttendanceRecord[];
  users?: User[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenNewStudent: () => void;
  onOpenNewWorker: () => void;
  onOpenNewCourse?: () => void;
  onOpenNewOrder?: () => void;
  onMarkAttendance: (data: { userId: string; userName: string; userRole: 'student' | 'worker'; status: 'present' | 'late'; method: 'QR_SCAN' | 'PIN' }) => void;
  onUpdateOrderStatus: (orderId: string, status: any, note: string) => void;
  onUpdateStudentFees: (studentId: string, amount: number) => void;
  onResetPassword?: (userId: string, newPass: string) => void;
  onUpdateStudent?: (student: Student) => void;
  onUpdateWorker?: (worker: Worker) => void;
  onUpdateOrder?: (order: Order) => void;
  onUpdateCourse?: (course: Course) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  students,
  workers,
  orders,
  courses,
  attendance,
  users = [],
  activeTab: controlledActiveTab,
  onTabChange,
  onOpenNewStudent,
  onOpenNewWorker,
  onOpenNewCourse,
  onOpenNewOrder,
  onMarkAttendance,
  onUpdateOrderStatus,
  onUpdateStudentFees,
  onResetPassword,
  onUpdateStudent,
  onUpdateWorker,
  onUpdateOrder,
  onUpdateCourse,
}) => {
  const [internalTab, setInternalTab] = useState<'students' | 'workers' | 'accounts' | 'attendance' | 'orders' | 'courses'>('students');
  const activeTab = (controlledActiveTab as any) || internalTab;
  const setActiveTab = (tab: any) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [updateToast, setUpdateToast] = useState<string | null>(null);

  // ==========================================
  // DEDICATED FULL-PAGE VIEW STATES
  // ==========================================
  const [selectedStudentForView, setSelectedStudentForView] = useState<Student | null>(null);
  const [selectedWorkerForView, setSelectedWorkerForView] = useState<Worker | null>(null);
  const [selectedOrderForView, setSelectedOrderForView] = useState<Order | null>(null);
  const [selectedCourseForView, setSelectedCourseForView] = useState<Course | null>(null);

  // Student Edit State
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentEmail, setEditStudentEmail] = useState('');
  const [editStudentPhone, setEditStudentPhone] = useState('');
  const [editStudentCourseId, setEditStudentCourseId] = useState('');
  const [editStudentStatus, setEditStudentStatus] = useState<'enrolled' | 'graduated' | 'suspended'>('enrolled');
  const [editStudentCompletedModules, setEditStudentCompletedModules] = useState(0);
  const [editStudentTotalModules, setEditStudentTotalModules] = useState(5);
  const [editStudentAttendance, setEditStudentAttendance] = useState(100);
  const [editStudentTotalFees, setEditStudentTotalFees] = useState(3000);
  const [editStudentPaidFees, setEditStudentPaidFees] = useState(0);
  const [editStudentGraduation, setEditStudentGraduation] = useState('');
  const [editStudentPin, setEditStudentPin] = useState('');

  // Worker Edit State
  const [editWorkerName, setEditWorkerName] = useState('');
  const [editWorkerEmail, setEditWorkerEmail] = useState('');
  const [editWorkerPhone, setEditWorkerPhone] = useState('');
  const [editWorkerRoleTitle, setEditWorkerRoleTitle] = useState('Senior Tailor');
  const [editWorkerSpecialization, setEditWorkerSpecialization] = useState('Suits & Agbada');
  const [editWorkerBaseSalary, setEditWorkerBaseSalary] = useState(3000);
  const [editWorkerCommission, setEditWorkerCommission] = useState(120);
  const [editWorkerIsClockedIn, setEditWorkerIsClockedIn] = useState(false);
  const [editWorkerRating, setEditWorkerRating] = useState(5.0);
  const [editWorkerCompletedOrders, setEditWorkerCompletedOrders] = useState(0);
  const [editWorkerJoinDate, setEditWorkerJoinDate] = useState('');

  // Order Edit State
  const [editOrderCustomerName, setEditOrderCustomerName] = useState('');
  const [editOrderCustomerPhone, setEditOrderCustomerPhone] = useState('');
  const [editOrderCustomerEmail, setEditOrderCustomerEmail] = useState('');
  const [editOrderGarmentName, setEditOrderGarmentName] = useState('');
  const [editOrderCategory, setEditOrderCategory] = useState<any>('Bridal / Evening');
  const [editOrderFabric, setEditOrderFabric] = useState('');
  const [editOrderWorkerId, setEditOrderWorkerId] = useState('');
  const [editOrderTotalAmount, setEditOrderTotalAmount] = useState(1500);
  const [editOrderPaidAmount, setEditOrderPaidAmount] = useState(500);
  const [editOrderTargetDate, setEditOrderTargetDate] = useState('2026-10-30');
  const [editOrderNotes, setEditOrderNotes] = useState('');
  const [editOrderBust, setEditOrderBust] = useState(36);
  const [editOrderWaist, setEditOrderWaist] = useState(28);
  const [editOrderHips, setEditOrderHips] = useState(40);
  const [editOrderShoulder, setEditOrderShoulder] = useState(15);
  const [editOrderLength, setEditOrderLength] = useState(58);

  // Course Edit State
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseCode, setEditCourseCode] = useState('');
  const [editCourseDescription, setEditCourseDescription] = useState('');
  const [editCourseLevel, setEditCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Masterclass'>('Beginner');
  const [editCourseDurationWeeks, setEditCourseDurationWeeks] = useState(12);
  const [editCourseFee, setEditCourseFee] = useState(3000);
  const [editCourseInstructor, setEditCourseInstructor] = useState('');
  const [editCourseSchedule, setEditCourseSchedule] = useState('');
  const [editCourseModules, setEditCourseModules] = useState<string[]>([]);
  const [newModuleInput, setNewModuleInput] = useState('');

  // Accounts & Password provisioning state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [resetModalUser, setResetModalUser] = useState<User | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Filtered lists
  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) || s.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredWorkers = workers.filter(
    (w) => w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.workerId.toLowerCase().includes(searchQuery.toLowerCase()) || w.roleTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOrders = orders.filter(
    (o) => o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerPhone.includes(searchQuery)
  );

  // ==========================================
  // STUDENT HANDLERS
  // ==========================================
  const handleOpenStudent = (student: Student) => {
    setSelectedStudentForView(student);
    setSelectedWorkerForView(null);
    setSelectedOrderForView(null);
    setSelectedCourseForView(null);
    setEditStudentName(student.name);
    setEditStudentEmail(student.email);
    setEditStudentPhone(student.phone);
    setEditStudentCourseId(student.courseId);
    setEditStudentStatus(student.status);
    setEditStudentCompletedModules(student.completedModules);
    setEditStudentTotalModules(student.totalModules || 5);
    setEditStudentAttendance(student.attendancePercentage);
    setEditStudentTotalFees(student.totalFees);
    setEditStudentPaidFees(student.paidFees);
    setEditStudentGraduation(student.expectedGraduation);
    setEditStudentPin(student.pin);
    setUpdateToast(null);
  };

  const handleSaveStudent = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedStudentForView) return;

    const matchedCourse = courses.find((c) => c.id === editStudentCourseId);
    const courseTitle = matchedCourse ? matchedCourse.title : selectedStudentForView.courseTitle;
    const totalMods = matchedCourse ? matchedCourse.totalModules : Number(editStudentTotalModules) || 5;
    const completed = Math.max(0, Math.min(Number(editStudentCompletedModules), totalMods));
    const progress = Math.min(100, Math.round((completed / Math.max(1, totalMods)) * 100));

    const updated: Student = {
      ...selectedStudentForView,
      name: editStudentName,
      email: editStudentEmail,
      phone: editStudentPhone,
      courseId: editStudentCourseId || selectedStudentForView.courseId,
      courseTitle,
      status: editStudentStatus,
      completedModules: completed,
      totalModules: totalMods,
      progressPercentage: progress,
      attendancePercentage: Math.max(0, Math.min(100, Number(editStudentAttendance))),
      totalFees: Number(editStudentTotalFees) || 0,
      paidFees: Math.max(0, Math.min(Number(editStudentTotalFees) || 0, Number(editStudentPaidFees) || 0)),
      expectedGraduation: editStudentGraduation || selectedStudentForView.expectedGraduation,
      pin: editStudentPin || selectedStudentForView.pin,
    };

    if (onUpdateStudent) onUpdateStudent(updated);
    setSelectedStudentForView(updated);
    setUpdateToast('Student records updated and synced successfully!');
    setTimeout(() => setUpdateToast(null), 3000);
  };

  const handleQuickAddStudentPayment = (amount: number) => {
    if (!selectedStudentForView) return;
    const newPaid = Math.min(selectedStudentForView.totalFees, selectedStudentForView.paidFees + amount);
    const updated: Student = {
      ...selectedStudentForView,
      paidFees: newPaid,
    };
    if (onUpdateStudent) onUpdateStudent(updated);
    setSelectedStudentForView(updated);
    setEditStudentPaidFees(newPaid);
    setUpdateToast(`Payment of GH₵ ${amount.toLocaleString()} logged!`);
    setTimeout(() => setUpdateToast(null), 3000);
  };

  // ==========================================
  // WORKER HANDLERS
  // ==========================================
  const handleOpenWorker = (worker: Worker) => {
    setSelectedWorkerForView(worker);
    setSelectedStudentForView(null);
    setSelectedOrderForView(null);
    setSelectedCourseForView(null);
    setEditWorkerName(worker.name);
    setEditWorkerEmail(worker.email);
    setEditWorkerPhone(worker.phone);
    setEditWorkerRoleTitle(worker.roleTitle);
    setEditWorkerSpecialization(worker.specialization);
    setEditWorkerBaseSalary(worker.baseSalary);
    setEditWorkerCommission(worker.commissionPerPiece);
    setEditWorkerIsClockedIn(worker.isClockedIn);
    setEditWorkerRating(worker.rating);
    setEditWorkerCompletedOrders(worker.completedOrdersCount);
    setEditWorkerJoinDate(worker.joinDate);
    setUpdateToast(null);
  };

  const handleSaveWorker = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedWorkerForView) return;

    const updated: Worker = {
      ...selectedWorkerForView,
      name: editWorkerName,
      email: editWorkerEmail,
      phone: editWorkerPhone,
      roleTitle: editWorkerRoleTitle,
      specialization: editWorkerSpecialization,
      baseSalary: Number(editWorkerBaseSalary) || 0,
      commissionPerPiece: Number(editWorkerCommission) || 0,
      isClockedIn: editWorkerIsClockedIn,
      rating: Number(editWorkerRating) || 5.0,
      completedOrdersCount: Number(editWorkerCompletedOrders) || 0,
      joinDate: editWorkerJoinDate || selectedWorkerForView.joinDate,
    };

    if (onUpdateWorker) onUpdateWorker(updated);
    setSelectedWorkerForView(updated);
    setUpdateToast('Artisan tailor profile updated successfully!');
    setTimeout(() => setUpdateToast(null), 3000);
  };

  const handleToggleWorkerClock = () => {
    if (!selectedWorkerForView) return;
    const newClock = !selectedWorkerForView.isClockedIn;
    const updated: Worker = {
      ...selectedWorkerForView,
      isClockedIn: newClock,
    };
    if (onUpdateWorker) onUpdateWorker(updated);
    setSelectedWorkerForView(updated);
    setEditWorkerIsClockedIn(newClock);
    setUpdateToast(`Shift status changed: ${newClock ? 'Clocked In (Active)' : 'Off-Duty'}`);
    setTimeout(() => setUpdateToast(null), 3000);
  };

  // ==========================================
  // ORDER HANDLERS
  // ==========================================
  const handleOpenOrder = (order: Order) => {
    setSelectedOrderForView(order);
    setSelectedStudentForView(null);
    setSelectedWorkerForView(null);
    setSelectedCourseForView(null);
    setEditOrderCustomerName(order.customerName);
    setEditOrderCustomerPhone(order.customerPhone);
    setEditOrderCustomerEmail(order.customerEmail || '');
    setEditOrderGarmentName(order.items[0]?.garmentName || 'Bespoke Garment');
    setEditOrderCategory(order.items[0]?.category || 'Bridal / Evening');
    setEditOrderFabric(order.items[0]?.fabricType || 'Bespoke Material');
    setEditOrderWorkerId(order.assignedWorkerId || '');
    setEditOrderTotalAmount(order.totalAmount);
    setEditOrderPaidAmount(order.paidAmount);
    setEditOrderTargetDate(order.targetDeliveryDate);
    setEditOrderNotes(order.notes || order.items[0]?.notes || '');
    setEditOrderBust(order.measurements?.bust || 36);
    setEditOrderWaist(order.measurements?.waist || 28);
    setEditOrderHips(order.measurements?.hips || 40);
    setEditOrderShoulder(order.measurements?.shoulder || 15);
    setEditOrderLength(order.measurements?.fullLength || 58);
    setUpdateToast(null);
  };

  const handleSaveOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedOrderForView) return;

    const assignedWorker = workers.find((w) => w.id === editOrderWorkerId);
    const total = Number(editOrderTotalAmount) || selectedOrderForView.totalAmount;
    const paid = Number(editOrderPaidAmount) || 0;
    const paymentStatus = paid >= total ? 'paid' : paid > 0 ? 'partially_paid' : 'pending';

    const updated: Order = {
      ...selectedOrderForView,
      customerName: editOrderCustomerName,
      customerPhone: editOrderCustomerPhone,
      customerEmail: editOrderCustomerEmail,
      targetDeliveryDate: editOrderTargetDate,
      assignedWorkerId: editOrderWorkerId || undefined,
      assignedWorkerName: assignedWorker ? assignedWorker.name : selectedOrderForView.assignedWorkerName,
      totalAmount: total,
      paidAmount: paid,
      paymentStatus: paymentStatus as any,
      notes: editOrderNotes,
      items: [
        {
          id: selectedOrderForView.items[0]?.id || `item-${Date.now()}`,
          garmentName: editOrderGarmentName,
          category: editOrderCategory as any,
          fabricType: editOrderFabric,
          fabricProvidedBy: selectedOrderForView.items[0]?.fabricProvidedBy || 'customer',
          notes: editOrderNotes,
          unitPrice: total,
        }
      ],
      measurements: {
        unit: 'inches',
        bust: Number(editOrderBust) || 36,
        waist: Number(editOrderWaist) || 28,
        hips: Number(editOrderHips) || 40,
        shoulder: Number(editOrderShoulder) || 15,
        fullLength: Number(editOrderLength) || 58,
        notes: editOrderNotes,
      }
    };

    if (onUpdateOrder) onUpdateOrder(updated);
    setSelectedOrderForView(updated);
    setUpdateToast('Order details and measurements updated successfully!');
    setTimeout(() => setUpdateToast(null), 3000);
  };

  const handleAdvanceStage = () => {
    if (!selectedOrderForView) return;
    const stages: Record<string, string> = {
      received: 'designing',
      designing: 'sewing',
      sewing: 'finishing',
      finishing: 'ready',
      ready: 'delivered',
    };
    const next = stages[selectedOrderForView.status];
    if (next) {
      onUpdateOrderStatus(selectedOrderForView.id, next, `Stage advanced to ${next} by Admin`);
      const updated: Order = {
        ...selectedOrderForView,
        status: next as any,
      };
      setSelectedOrderForView(updated);
      setUpdateToast(`Order stage advanced to "${next.toUpperCase()}"!`);
      setTimeout(() => setUpdateToast(null), 3000);
    }
  };

  // ==========================================
  // COURSE / CURRICULA HANDLERS
  // ==========================================
  const handleOpenCourse = (course: Course) => {
    setSelectedCourseForView(course);
    setSelectedStudentForView(null);
    setSelectedWorkerForView(null);
    setSelectedOrderForView(null);
    setEditCourseTitle(course.title);
    setEditCourseCode(course.code);
    setEditCourseDescription(course.description);
    setEditCourseLevel(course.level);
    setEditCourseDurationWeeks(course.durationWeeks);
    setEditCourseFee(course.fee);
    setEditCourseInstructor(course.instructor);
    setEditCourseSchedule(course.schedule);
    setEditCourseModules([...course.modules]);
    setNewModuleInput('');
    setUpdateToast(null);
  };

  const handleSaveCourse = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedCourseForView) return;

    const updated: Course = {
      ...selectedCourseForView,
      title: editCourseTitle,
      code: editCourseCode,
      description: editCourseDescription,
      level: editCourseLevel,
      durationWeeks: Number(editCourseDurationWeeks) || 12,
      totalModules: editCourseModules.length,
      fee: Number(editCourseFee) || 0,
      instructor: editCourseInstructor,
      schedule: editCourseSchedule,
      modules: editCourseModules,
    };

    if (onUpdateCourse) onUpdateCourse(updated);
    setSelectedCourseForView(updated);
    setUpdateToast('Academy Diploma curricula & syllabus updated successfully!');
    setTimeout(() => setUpdateToast(null), 3000);
  };

  const handleAddModuleUnit = () => {
    if (!newModuleInput.trim()) return;
    const updatedModules = [...editCourseModules, newModuleInput.trim()];
    setEditCourseModules(updatedModules);
    setNewModuleInput('');
    if (selectedCourseForView) {
      const updated: Course = {
        ...selectedCourseForView,
        totalModules: updatedModules.length,
        modules: updatedModules,
      };
      if (onUpdateCourse) onUpdateCourse(updated);
      setSelectedCourseForView(updated);
      setUpdateToast(`Unit added: "${newModuleInput.trim()}"!`);
      setTimeout(() => setUpdateToast(null), 3000);
    }
  };

  const handleRemoveModuleUnit = (index: number) => {
    const updatedModules = editCourseModules.filter((_, idx) => idx !== index);
    setEditCourseModules(updatedModules);
    if (selectedCourseForView) {
      const updated: Course = {
        ...selectedCourseForView,
        totalModules: updatedModules.length,
        modules: updatedModules,
      };
      if (onUpdateCourse) onUpdateCourse(updated);
      setSelectedCourseForView(updated);
      setUpdateToast('Curriculum unit removed.');
      setTimeout(() => setUpdateToast(null), 3000);
    }
  };

  const handleCopyCredentials = (u: User) => {
    const text = `StitchFlow Login Details\nName: ${u.name}\nRole: ${u.role.toUpperCase()}\nLogin Email: ${u.email}\nURL: ${window.location.origin}/login\n(Use "Reset" to issue a new password for this account.)`;
    navigator.clipboard.writeText(text);
    setCopiedId(u.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetModalUser && onResetPassword) {
      onResetPassword(resetModalUser.id, newPasswordInput);
    }
    alert(`✓ Password for ${resetModalUser?.name} has been updated to "${newPasswordInput}"!`);
    setResetModalUser(null);
    setNewPasswordInput('');
  };

  // =========================================================================
  // VIEW 1: DEDICATED FULL-PAGE STUDENT PROFILE & UPDATE VIEW
  // =========================================================================
  if (selectedStudentForView) {
    const activeStudentCourse = courses.find((c) => c.id === (editStudentCourseId || selectedStudentForView.courseId)) || courses[0];
    const totalFeeNum = Number(editStudentTotalFees) || selectedStudentForView.totalFees || 3000;
    const paidFeeNum = Number(editStudentPaidFees) || 0;
    const balance = Math.max(0, totalFeeNum - paidFeeNum);
    const isSettled = balance === 0;
    const totalMods = Number(editStudentTotalModules) || activeStudentCourse?.totalModules || 5;
    const completedMods = Math.max(0, Math.min(Number(editStudentCompletedModules), totalMods));
    const progressPerc = Math.min(100, Math.round((completedMods / Math.max(1, totalMods)) * 100));

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-purple-100 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedStudentForView(null);
                setUpdateToast(null);
              }}
              className="px-3.5 py-2 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-900 rounded-2xl transition-colors flex items-center gap-2 font-bold text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Student Directory</span>
            </button>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <div className="text-xs text-gray-500 hidden sm:block">
              Student Dossier • <span className="font-mono font-bold text-purple-900">{selectedStudentForView.studentId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onMarkAttendance({
                  userId: selectedStudentForView.userId,
                  userName: selectedStudentForView.name,
                  userRole: 'student',
                  status: 'present',
                  method: 'QR_SCAN',
                });
                setUpdateToast('Attendance logged as Present ✓');
                setTimeout(() => setUpdateToast(null), 3000);
              }}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-200 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mark Attendance</span>
            </button>
            <button
              onClick={() => handleSaveStudent()}
              className="px-5 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Apply Changes</span>
            </button>
          </div>
        </div>

        {updateToast && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs font-bold shadow-xs animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{updateToast}</span>
          </div>
        )}

        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-purple-800">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedStudentForView.avatar}
                  alt={selectedStudentForView.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-white/20 shadow-xl"
                />
                <span className={`absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${
                  editStudentStatus === 'graduated' 
                    ? 'bg-blue-400 text-blue-950' 
                    : editStudentStatus === 'suspended'
                    ? 'bg-rose-400 text-rose-950'
                    : 'bg-emerald-400 text-emerald-950'
                }`}>
                  {editStudentStatus}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{editStudentName}</h1>
                  <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white font-mono text-xs font-bold">
                    {selectedStudentForView.studentId}
                  </span>
                </div>
                <p className="text-purple-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-300" />
                  <span>{activeStudentCourse?.title || selectedStudentForView.courseTitle}</span>
                  <span className="text-purple-300">• {activeStudentCourse?.level || 'Diploma Track'}</span>
                </p>
                <div className="flex items-center gap-4 text-[11px] text-purple-200 pt-1 flex-wrap font-medium">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {editStudentEmail}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {editStudentPhone || 'No phone'}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Enrolled: {selectedStudentForView.enrollmentDate}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto shrink-0">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] text-purple-200 font-bold uppercase">Syllabus Progress</div>
                <div className="text-xl font-black text-white mt-0.5">{progressPerc}%</div>
                <div className="text-[10px] text-purple-200">{completedMods}/{totalMods} Modules</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] text-purple-200 font-bold uppercase">Tuition Paid</div>
                <div className="text-xl font-black text-white mt-0.5">GH₵ {paidFeeNum.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-300 font-semibold">{isSettled ? '100% Settled' : `GH₵ ${balance.toLocaleString()} Due`}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] text-purple-200 font-bold uppercase">Attendance</div>
                <div className="text-xl font-black text-white mt-0.5">{editStudentAttendance}%</div>
                <div className="text-[10px] text-purple-200 font-mono">PIN: {editStudentPin}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Curriculum Modules</h3>
                  <p className="text-xs text-gray-500">Interactive module progression</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newCompleted = Math.min(totalMods, completedMods + 1);
                    setEditStudentCompletedModules(newCompleted);
                  }}
                  disabled={completedMods >= totalMods}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+1 Module</span>
                </button>
              </div>

              <div className="space-y-1.5 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-purple-900">Overall Progress</span>
                  <span className="text-purple-700">{progressPerc}% ({completedMods} of {totalMods} mods)</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPerc}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {(activeStudentCourse?.modules || ['1. Introduction & Sketching', '2. Pattern Drafting', '3. Garment Sewing', '4. Quality Finishing', '5. Final Project']).map((moduleName, index) => {
                  const isModCompleted = index < completedMods;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        const newCompleted = isModCompleted ? index : index + 1;
                        setEditStudentCompletedModules(newCompleted);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isModCompleted
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : 'bg-gray-50/60 border-gray-200 text-gray-700 hover:bg-purple-50/50 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isModCompleted ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isModCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
                        </div>
                        <span className={`text-xs truncate ${isModCompleted ? 'font-bold' : 'font-medium'}`}>
                          {moduleName}
                        </span>
                      </div>

                      <span className={`text-[10px] font-bold uppercase shrink-0 px-2 py-0.5 rounded-md ${
                        isModCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200/70 text-gray-500'
                      }`}>
                        {isModCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Tuition Fee Ledger</h3>
                  <p className="text-xs text-gray-500">Record payments and issue receipts</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Total Tuition Fee:</span>
                  <span className="font-bold text-gray-900">GH₵ {totalFeeNum.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Amount Settled:</span>
                  <span className="font-bold text-emerald-700">GH₵ {paidFeeNum.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-xs font-bold">
                  <span className="text-gray-700">Outstanding Balance:</span>
                  <span className={isSettled ? 'text-emerald-600 font-black' : 'text-amber-600 font-black'}>
                    {isSettled ? 'GH₵ 0.00 (Fully Paid)' : `GH₵ ${balance.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {!isSettled && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-600 uppercase">Quick Log Payment</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickAddStudentPayment(500)}
                      className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all border border-emerald-200"
                    >
                      + GH₵ 500
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAddStudentPayment(1000)}
                      className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all border border-emerald-200"
                    >
                      + GH₵ 1,000
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAddStudentPayment(balance)}
                      className="px-2.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      Pay Full
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Update Student Profile &amp; Records</h3>
                  <p className="text-xs text-gray-500">Edit contact details, course enrollment, attendance &amp; credentials</p>
                </div>
                <div className="p-2.5 bg-purple-50 text-purple-800 rounded-2xl">
                  <Edit3 className="w-5 h-5" />
                </div>
              </div>

              <form onSubmit={handleSaveStudent} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Student Full Name</label>
                    <input
                      type="text"
                      required
                      value={editStudentName}
                      onChange={(e) => setEditStudentName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editStudentEmail}
                      onChange={(e) => setEditStudentEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={editStudentPhone}
                      onChange={(e) => setEditStudentPhone(e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Enrolled Diploma Program</label>
                    <select
                      value={editStudentCourseId}
                      onChange={(e) => {
                        const selectedC = courses.find((c) => c.id === e.target.value);
                        setEditStudentCourseId(e.target.value);
                        if (selectedC) {
                          setEditStudentTotalModules(selectedC.totalModules);
                          setEditStudentTotalFees(selectedC.fee);
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold text-purple-950"
                    >
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title} ({course.level} - {course.durationWeeks} wks)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Enrollment Status</label>
                    <select
                      value={editStudentStatus}
                      onChange={(e) => setEditStudentStatus(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold text-gray-900"
                    >
                      <option value="enrolled">Enrolled (Active)</option>
                      <option value="graduated">Graduated (Certified)</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Attendance Compliance Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editStudentAttendance}
                      onChange={(e) => setEditStudentAttendance(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold text-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">
                      Completed Modules Count (out of {totalMods})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={totalMods}
                      value={editStudentCompletedModules}
                      onChange={(e) => setEditStudentCompletedModules(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold text-purple-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Clock-In 4-Digit PIN</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={editStudentPin}
                      onChange={(e) => setEditStudentPin(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono font-bold tracking-widest text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Total Tuition Fee (GH₵)</label>
                    <input
                      type="number"
                      min="0"
                      value={editStudentTotalFees}
                      onChange={(e) => setEditStudentTotalFees(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Paid Tuition Amount (GH₵)</label>
                    <input
                      type="number"
                      min="0"
                      max={totalFeeNum}
                      value={editStudentPaidFees}
                      onChange={(e) => setEditStudentPaidFees(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold text-emerald-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1.5">Expected Graduation Date</label>
                    <input
                      type="date"
                      value={editStudentGraduation}
                      onChange={(e) => setEditStudentGraduation(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudentForView(null);
                      setUpdateToast(null);
                    }}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel &amp; Return
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save &amp; Apply Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DEDICATED FULL-PAGE WORKER / ARTISAN PROFILE & MANAGEMENT VIEW
  // =========================================================================
  if (selectedWorkerForView) {
    const totalCommissionsEarned = selectedWorkerForView.completedOrdersCount * selectedWorkerForView.commissionPerPiece;

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-amber-100 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedWorkerForView(null);
                setUpdateToast(null);
              }}
              className="px-3.5 py-2 bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-900 rounded-2xl transition-colors flex items-center gap-2 font-bold text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Staff Directory</span>
            </button>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <div className="text-xs text-gray-500 hidden sm:block">
              Artisan Profile • <span className="font-mono font-bold text-amber-900">{selectedWorkerForView.workerId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleToggleWorkerClock}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shrink-0 ${
                editWorkerIsClockedIn
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{editWorkerIsClockedIn ? 'Clock Out Artisan' : 'Clock In to Shift'}</span>
            </button>

            <button
              onClick={() => handleSaveWorker()}
              className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Update Profile</span>
            </button>
          </div>
        </div>

        {updateToast && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs font-bold shadow-xs animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{updateToast}</span>
          </div>
        )}

        <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-amber-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-amber-800">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedWorkerForView.avatar}
                  alt={selectedWorkerForView.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-white/20 shadow-xl"
                />
                <span className={`absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${
                  editWorkerIsClockedIn ? 'bg-emerald-400 text-emerald-950' : 'bg-gray-400 text-gray-950'
                }`}>
                  {editWorkerIsClockedIn ? '● On Shift' : '○ Off Duty'}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{editWorkerName}</h1>
                  <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white font-mono text-xs font-bold">
                    {selectedWorkerForView.workerId}
                  </span>
                </div>
                <p className="text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-amber-300" />
                  <span>{editWorkerRoleTitle}</span>
                  <span className="text-amber-300">• {editWorkerSpecialization}</span>
                </p>
                <div className="flex items-center gap-4 text-[11px] text-amber-200 pt-1 flex-wrap font-medium">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {editWorkerEmail}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {editWorkerPhone || 'No phone'}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined: {selectedWorkerForView.joinDate}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto shrink-0">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] text-amber-200 font-bold uppercase">Base Monthly Salary</div>
                <div className="text-xl font-black text-white mt-0.5">GH₵ {Number(editWorkerBaseSalary).toLocaleString()}</div>
                <div className="text-[10px] text-amber-200">Fixed Monthly</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] text-amber-200 font-bold uppercase">Piece Commission</div>
                <div className="text-xl font-black text-white mt-0.5">GH₵ {Number(editWorkerCommission)}</div>
                <div className="text-[10px] text-emerald-300 font-semibold">Per Finished Piece</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] text-amber-200 font-bold uppercase">Completed Pieces</div>
                <div className="text-xl font-black text-white mt-0.5">{editWorkerCompletedOrders}</div>
                <div className="text-[10px] text-amber-200">★ {Number(editWorkerRating).toFixed(1)} Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Artisan Earnings &amp; Output</h3>
                  <p className="text-xs text-gray-500">Live piece-rate commission ledger</p>
                </div>
                <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-100 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Total Completed Garments:</span>
                  <span className="font-bold text-gray-900">{editWorkerCompletedOrders} Pieces</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Commission Rate Per Garment:</span>
                  <span className="font-bold text-amber-900">GH₵ {editWorkerCommission}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Total Commissions Generated:</span>
                  <span className="font-bold text-emerald-700">GH₵ {totalCommissionsEarned.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-amber-200 flex justify-between text-xs font-bold">
                  <span className="text-gray-800">Total Estimated Monthly Take-Home:</span>
                  <span className="text-purple-950 font-black text-sm">
                    GH₵ {(Number(editWorkerBaseSalary) + totalCommissionsEarned).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Update Artisan Information</h3>
                  <p className="text-xs text-gray-500">Edit tailoring specialization, base salary, and piece-rate commission</p>
                </div>
                <div className="p-2.5 bg-amber-50 text-amber-800 rounded-2xl">
                  <Edit3 className="w-5 h-5" />
                </div>
              </div>

              <form onSubmit={handleSaveWorker} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Artisan Full Name</label>
                    <input
                      type="text"
                      required
                      value={editWorkerName}
                      onChange={(e) => setEditWorkerName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editWorkerEmail}
                      onChange={(e) => setEditWorkerEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={editWorkerPhone}
                      onChange={(e) => setEditWorkerPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Role Title</label>
                    <input
                      type="text"
                      required
                      value={editWorkerRoleTitle}
                      onChange={(e) => setEditWorkerRoleTitle(e.target.value)}
                      placeholder="e.g. Master Tailor / Pattern Cutter"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Tailoring Specialization</label>
                    <input
                      type="text"
                      required
                      value={editWorkerSpecialization}
                      onChange={(e) => setEditWorkerSpecialization(e.target.value)}
                      placeholder="e.g. Suits & Agbada / Kente Weaving"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Shift Clock State</label>
                    <select
                      value={editWorkerIsClockedIn ? 'true' : 'false'}
                      onChange={(e) => setEditWorkerIsClockedIn(e.target.value === 'true')}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-gray-900"
                    >
                      <option value="true">● Clocked In (Active on Shift)</option>
                      <option value="false">○ Off-Duty</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Base Monthly Salary (GH₵)</label>
                    <input
                      type="number"
                      min="0"
                      value={editWorkerBaseSalary}
                      onChange={(e) => setEditWorkerBaseSalary(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Piece Commission (GH₵/piece)</label>
                    <input
                      type="number"
                      min="0"
                      value={editWorkerCommission}
                      onChange={(e) => setEditWorkerCommission(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-purple-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Completed Pieces Count</label>
                    <input
                      type="number"
                      min="0"
                      value={editWorkerCompletedOrders}
                      onChange={(e) => setEditWorkerCompletedOrders(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Artisan Rating (0.0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={editWorkerRating}
                      onChange={(e) => setEditWorkerRating(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-amber-700"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWorkerForView(null);
                      setUpdateToast(null);
                    }}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel &amp; Return
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save &amp; Update Profile</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: DEDICATED FULL-PAGE BESPOKE ORDER WORKFLOW & DETAIL VIEW
  // =========================================================================
  if (selectedOrderForView) {
    const balance = Math.max(0, Number(editOrderTotalAmount) - Number(editOrderPaidAmount));
    const isPaid = balance === 0;

    const stages = [
      { key: 'received', label: '1. Received' },
      { key: 'designing', label: '2. Designing' },
      { key: 'sewing', label: '3. Sewing' },
      { key: 'finishing', label: '4. Finishing' },
      { key: 'ready', label: '5. Ready' },
      { key: 'delivered', label: '6. Delivered' },
    ];

    const currentStageIndex = stages.findIndex((s) => s.key === selectedOrderForView.status);

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-rose-100 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedOrderForView(null);
                setUpdateToast(null);
              }}
              className="px-3.5 py-2 bg-gray-100 hover:bg-rose-100 text-gray-700 hover:text-rose-900 rounded-2xl transition-colors flex items-center gap-2 font-bold text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Workshop Orders</span>
            </button>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <div className="text-xs text-gray-500 hidden sm:block">
              Order Docket • <span className="font-mono font-bold text-rose-950">{selectedOrderForView.orderNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {selectedOrderForView.status !== 'delivered' && (
              <button
                onClick={handleAdvanceStage}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <span>Advance Stage →</span>
              </button>
            )}
            <button
              onClick={() => handleSaveOrder()}
              className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Update Order</span>
            </button>
          </div>
        </div>

        {updateToast && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs font-bold shadow-xs animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{updateToast}</span>
          </div>
        )}

        {/* Order Hero */}
        <div className="bg-gradient-to-r from-rose-950 via-purple-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-rose-900">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 bg-white/20 rounded-xl font-mono font-bold text-xs">
                  {selectedOrderForView.orderNumber}
                </span>
                <span className="px-3 py-1 bg-rose-500/80 rounded-xl font-bold uppercase text-[10px] tracking-wider">
                  {selectedOrderForView.status}
                </span>
                <span className="px-3 py-1 bg-emerald-500/80 rounded-xl font-bold uppercase text-[10px] tracking-wider">
                  {isPaid ? 'Fully Paid' : 'Balance Pending'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{editOrderGarmentName}</h1>
              <p className="text-rose-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <span>Client: {editOrderCustomerName}</span>
                <span>• Phone: {editOrderCustomerPhone}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] text-rose-200 font-bold uppercase">Total Bill</div>
                <div className="text-xl font-black text-white mt-0.5">GH₵ {Number(editOrderTotalAmount).toLocaleString()}</div>
                <div className="text-[10px] text-rose-200">{editOrderCategory}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] text-rose-200 font-bold uppercase">Paid Deposit</div>
                <div className="text-xl font-black text-white mt-0.5">GH₵ {Number(editOrderPaidAmount).toLocaleString()}</div>
                <div className="text-[10px] text-emerald-300 font-semibold">{isPaid ? '100% Settled' : `GH₵ ${balance.toLocaleString()} Due`}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Stage Pipeline Stepper */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Production Lifecycle Stage</h3>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {stages.map((stage, idx) => {
              const isPast = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={stage.key}
                  onClick={() => {
                    onUpdateOrderStatus(selectedOrderForView.id, stage.key, `Stage set to ${stage.key} by Admin`);
                    setSelectedOrderForView({ ...selectedOrderForView, status: stage.key as any });
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-center ${
                    isCurrent
                      ? 'bg-purple-900 text-white border-purple-900 shadow-md ring-2 ring-purple-300'
                      : isPast
                      ? 'bg-purple-50 border-purple-200 text-purple-900 font-bold'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <div className="text-xs font-bold">{stage.label}</div>
                  <div className="text-[10px] mt-0.5 opacity-80">{isCurrent ? 'Current Stage' : isPast ? 'Completed' : 'Pending'}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            {/* Measurements Card */}
            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Client Body Measurements</h3>
                  <p className="text-xs text-gray-500">Inches recorded at customer fitting intake</p>
                </div>
                <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                  <Ruler className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Bust / Chest</span>
                  <div className="text-lg font-black text-rose-950 mt-0.5">{editOrderBust}&quot;</div>
                </div>
                <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Waist</span>
                  <div className="text-lg font-black text-rose-950 mt-0.5">{editOrderWaist}&quot;</div>
                </div>
                <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Hips</span>
                  <div className="text-lg font-black text-rose-950 mt-0.5">{editOrderHips}&quot;</div>
                </div>
                <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Shoulder</span>
                  <div className="text-lg font-black text-rose-950 mt-0.5">{editOrderShoulder}&quot;</div>
                </div>
                <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 col-span-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Full Length</span>
                  <div className="text-lg font-black text-rose-950 mt-0.5">{editOrderLength}&quot;</div>
                </div>
              </div>
            </div>

            {/* Financial Ledger Card */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Payment &amp; Billing Ledger</h3>
                  <p className="text-xs text-gray-500">Deposit status and balance settlement</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Agreed Bill:</span>
                  <span className="font-bold text-gray-900">GH₵ {Number(editOrderTotalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Deposit Paid:</span>
                  <span className="font-bold text-emerald-700">GH₵ {Number(editOrderPaidAmount).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
                  <span className="text-gray-700">Balance Due:</span>
                  <span className={isPaid ? 'text-emerald-600 font-black' : 'text-amber-600 font-black'}>
                    {isPaid ? 'GH₵ 0.00 (Fully Settled)' : `GH₵ ${balance.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {!isPaid && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-600 uppercase">Quick Record Payment</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newPaid = Math.min(Number(editOrderTotalAmount), Number(editOrderPaidAmount) + 500);
                        setEditOrderPaidAmount(newPaid);
                      }}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all border border-emerald-200"
                    >
                      + GH₵ 500
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditOrderPaidAmount(Number(editOrderTotalAmount))}
                      className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      Pay Full (GH₵ {balance.toLocaleString()})
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Update Bespoke Order Information</h3>
                  <p className="text-xs text-gray-500">Edit tailoring details, assigned artisan, delivery date &amp; notes</p>
                </div>
                <div className="p-2.5 bg-rose-50 text-rose-800 rounded-2xl">
                  <Edit3 className="w-5 h-5" />
                </div>
              </div>

              <form onSubmit={handleSaveOrder} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Customer Name</label>
                    <input
                      type="text"
                      required
                      value={editOrderCustomerName}
                      onChange={(e) => setEditOrderCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Customer Phone (WhatsApp)</label>
                    <input
                      type="text"
                      required
                      value={editOrderCustomerPhone}
                      onChange={(e) => setEditOrderCustomerPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Garment Title / Description</label>
                    <input
                      type="text"
                      required
                      value={editOrderGarmentName}
                      onChange={(e) => setEditOrderGarmentName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Garment Category</label>
                    <select
                      value={editOrderCategory}
                      onChange={(e) => setEditOrderCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                    >
                      <option value="Bridal / Evening">Bridal / Evening Wear</option>
                      <option value="Traditional Kente / Agbada">Traditional Kente / Agbada</option>
                      <option value="Casual / Ready-to-Wear">Casual / Ready-to-Wear</option>
                      <option value="Corporate Suit">Corporate Suit / Blazer</option>
                      <option value="Alteration">Garment Alteration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Fabric Specifications</label>
                    <input
                      type="text"
                      value={editOrderFabric}
                      onChange={(e) => setEditOrderFabric(e.target.value)}
                      placeholder="e.g. Brocade Silk + 100% Velvet"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Assigned Head Tailor</label>
                    <select
                      value={editOrderWorkerId}
                      onChange={(e) => setEditOrderWorkerId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold text-amber-950"
                    >
                      <option value="">Unassigned</option>
                      {workers.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.roleTitle} - {w.specialization})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Total Bill (GH₵)</label>
                    <input
                      type="number"
                      min="0"
                      value={editOrderTotalAmount}
                      onChange={(e) => setEditOrderTotalAmount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Paid Deposit (GH₵)</label>
                    <input
                      type="number"
                      min="0"
                      max={editOrderTotalAmount}
                      value={editOrderPaidAmount}
                      onChange={(e) => setEditOrderPaidAmount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold text-emerald-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1.5">Target Delivery Date</label>
                    <input
                      type="date"
                      value={editOrderTargetDate}
                      onChange={(e) => setEditOrderTargetDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1.5">Workshop Instructions &amp; Fitting Notes</label>
                    <textarea
                      rows={3}
                      value={editOrderNotes}
                      onChange={(e) => setEditOrderNotes(e.target.value)}
                      placeholder="Special lining notes, hem length adjustments, embroidery pattern requirements..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrderForView(null);
                      setUpdateToast(null);
                    }}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel &amp; Return
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save &amp; Apply Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 4: DEDICATED FULL-PAGE ACADEMY DIPLOMA CURRICULA & SYLLABI VIEW
  // =========================================================================
  if (selectedCourseForView) {
    const enrolledStudents = students.filter(s => s.courseId === selectedCourseForView.id || s.courseTitle === selectedCourseForView.title);
    const avgAttendance = enrolledStudents.length > 0
      ? Math.round(enrolledStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / enrolledStudents.length)
      : 100;

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Back Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-indigo-100 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedCourseForView(null);
                setUpdateToast(null);
              }}
              className="px-3.5 py-2 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-900 rounded-2xl transition-colors flex items-center gap-2 font-bold text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course Curricula &amp; Syllabi</span>
            </button>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <div className="text-xs text-gray-500 hidden sm:block">
              Curriculum Dossier • <span className="font-mono font-bold text-indigo-950">{selectedCourseForView.code}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => handleSaveCourse()}
              className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Update Curricula</span>
            </button>
          </div>
        </div>

        {/* Update Toast */}
        {updateToast && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs font-bold shadow-xs animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{updateToast}</span>
          </div>
        )}

        {/* Course Hero Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-indigo-900">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 bg-white/20 rounded-xl font-mono font-bold text-xs">
                  {selectedCourseForView.code}
                </span>
                <span className="px-3 py-1 bg-indigo-500/80 rounded-xl font-bold uppercase text-[10px] tracking-wider">
                  {editCourseLevel} Level
                </span>
                <span className="px-3 py-1 bg-emerald-500/80 rounded-xl font-bold uppercase text-[10px] tracking-wider">
                  Accredited Program
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{editCourseTitle}</h1>
              <div className="flex items-center gap-4 text-indigo-200 text-xs sm:text-sm font-semibold flex-wrap pt-1">
                <span className="flex items-center gap-1.5"><UserIcon className="w-4 h-4 text-indigo-300" /> Instructor: {editCourseInstructor}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-300" /> {editCourseSchedule}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto shrink-0">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] text-indigo-200 font-bold uppercase">Tuition Fee</div>
                <div className="text-xl font-black text-white mt-0.5">GH₵ {Number(editCourseFee).toLocaleString()}</div>
                <div className="text-[10px] text-emerald-300 font-semibold">Per Term</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] text-indigo-200 font-bold uppercase">Program Duration</div>
                <div className="text-xl font-black text-white mt-0.5">{editCourseDurationWeeks} Wks</div>
                <div className="text-[10px] text-indigo-200">{editCourseModules.length} Modules</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] text-indigo-200 font-bold uppercase">Enrolled Cohort</div>
                <div className="text-xl font-black text-white mt-0.5">{enrolledStudents.length} Students</div>
                <div className="text-[10px] text-indigo-200">{avgAttendance}% Attendance</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Syllabus Units Breakdown & Enrolled Cohort */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interactive Module Units Checklist */}
            <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Curriculum Modules &amp; Units</h3>
                  <p className="text-xs text-gray-500">Structured practical &amp; theoretical units ({editCourseModules.length})</p>
                </div>
                <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              {/* Module Units List */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {editCourseModules.map((mod, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 border border-gray-100 group hover:bg-indigo-50/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center justify-center shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-semibold text-gray-800">{mod}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveModuleUnit(idx)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove unit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Unit Form */}
              <div className="pt-2 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Advanced Corsetry &amp; Boning"
                  value={newModuleInput}
                  onChange={(e) => setNewModuleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddModuleUnit();
                    }
                  }}
                  className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddModuleUnit}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Enrolled Students Roster for this Course */}
            <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Enrolled Students ({enrolledStudents.length})</h3>
                  <p className="text-xs text-gray-500">Learners registered in this diploma program</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              {enrolledStudents.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400">No students currently enrolled in this specific diploma program.</div>
              ) : (
                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {enrolledStudents.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleOpenStudent(s)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 hover:bg-purple-50/50 border border-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-gray-200" />
                        <div>
                          <div className="text-xs font-bold text-gray-900">{s.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono">{s.studentId} • {s.completedModules}/{editCourseModules.length} units</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'graduated' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {s.status}
                        </span>
                        <div className="text-[10px] text-gray-500 font-medium mt-0.5">{s.progressPercentage}% complete</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Update Course Information Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Update Diploma Program &amp; Syllabi</h3>
                  <p className="text-xs text-gray-500">Edit course certification, instructor, schedule, fees &amp; syllabus description</p>
                </div>
                <div className="p-2.5 bg-indigo-50 text-indigo-800 rounded-2xl">
                  <Edit3 className="w-5 h-5" />
                </div>
              </div>

              <form onSubmit={handleSaveCourse} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Course / Diploma Title</label>
                    <input
                      type="text"
                      required
                      value={editCourseTitle}
                      onChange={(e) => setEditCourseTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Course Code</label>
                    <input
                      type="text"
                      required
                      value={editCourseCode}
                      onChange={(e) => setEditCourseCode(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono font-bold text-indigo-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Academic Level</label>
                    <select
                      value={editCourseLevel}
                      onChange={(e) => setEditCourseLevel(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-gray-900"
                    >
                      <option value="Beginner">Beginner (Foundational)</option>
                      <option value="Intermediate">Intermediate (Advanced Techniques)</option>
                      <option value="Masterclass">Masterclass (Executive Haute Couture)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Duration (Weeks)</label>
                    <input
                      type="number"
                      min="1"
                      value={editCourseDurationWeeks}
                      onChange={(e) => setEditCourseDurationWeeks(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Tuition Fee (GH₵)</label>
                    <input
                      type="number"
                      min="0"
                      value={editCourseFee}
                      onChange={(e) => setEditCourseFee(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-purple-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Lead Instructor</label>
                    <input
                      type="text"
                      required
                      value={editCourseInstructor}
                      onChange={(e) => setEditCourseInstructor(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1.5">Class Schedule &amp; Timetable</label>
                    <input
                      type="text"
                      required
                      value={editCourseSchedule}
                      onChange={(e) => setEditCourseSchedule(e.target.value)}
                      placeholder="e.g. Mon &amp; Wed: 9:00 AM - 1:00 PM"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1.5">Curriculum Description &amp; Learning Outcomes</label>
                    <textarea
                      rows={4}
                      value={editCourseDescription}
                      onChange={(e) => setEditCourseDescription(e.target.value)}
                      placeholder="Comprehensive overview of modules, hands-on lab work, pattern cutting and final graduation collection..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCourseForView(null);
                      setUpdateToast(null);
                    }}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel &amp; Return
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save &amp; Apply Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN ADMIN PORTAL ROSTER & AUDIT TABS
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, email or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenNewStudent}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Enroll Student</span>
          </button>

          <button
            onClick={onOpenNewWorker}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-bold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Tailor</span>
          </button>

          {onOpenNewOrder && (
            <button
              onClick={onOpenNewOrder}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>+ New Order</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB: ACCOUNTS & PASSWORDS VAULT */}
      {activeTab === 'accounts' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900 text-base">User Accounts &amp; Password Provisioning</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Admin &amp; Owner managed credentials. Issue or reset passwords for students, workers, and clients.
              </p>
            </div>
            <span className="text-xs bg-purple-100 text-purple-900 px-3 py-1 rounded-full font-bold">
              {users.length} Provisioned Accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <th className="p-4">User &amp; Profile</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Login Email</th>
                  <th className="p-4">Password</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => {
                  const roleBadgeColors: Record<string, string> = {
                    owner: 'bg-purple-100 text-purple-900 border-purple-200',
                    admin: 'bg-blue-100 text-blue-900 border-blue-200',
                    student: 'bg-emerald-100 text-emerald-900 border-emerald-200',
                    worker: 'bg-amber-100 text-amber-900 border-amber-200',
                    customer: 'bg-rose-100 text-rose-900 border-rose-200',
                  };

                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-gray-200 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{u.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{u.phone || 'No phone'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] border ${roleBadgeColors[u.role] || 'bg-gray-100 text-gray-800'}`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-gray-800">{u.email}</td>

                      <td className="p-4">
                        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/80 w-fit">
                          <Lock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="font-mono text-xs font-bold text-gray-800">
                            Encrypted
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active ✓
                        </span>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleCopyCredentials(u)}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold rounded-lg text-[11px] transition-all inline-flex items-center gap-1"
                        >
                          {copiedId === u.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-purple-600" />}
                          <span>{copiedId === u.id ? 'Copied' : 'Handover Info'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setResetModalUser(u);
                            setNewPasswordInput(`STF-${Math.floor(1000 + Math.random() * 9000)}`);
                          }}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg text-[11px] transition-all inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 1: STUDENTS */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Student Academy Directory</h3>
              <p className="text-xs text-gray-500">Live roster with curriculum completion, fee status, and attendance rates</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-bold">
                  <th className="p-4">Student ID &amp; Name</th>
                  <th className="p-4">Enrolled Course</th>
                  <th className="p-4">Attendance</th>
                  <th className="p-4">Curriculum Progress</th>
                  <th className="p-4">Fee Balance</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => {
                  const feeBalance = student.totalFees - student.paidFees;
                  const isFullyPaid = feeBalance <= 0;

                  return (
                    <tr 
                      key={student.id} 
                      onClick={() => handleOpenStudent(student)}
                      className="hover:bg-purple-50/40 cursor-pointer transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-gray-200 group-hover:ring-purple-400 transition-all shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-purple-900 transition-colors">{student.name}</div>
                            <div className="text-[11px] text-gray-500 font-mono flex items-center gap-1">
                              <span>{student.studentId}</span>
                              <span className="text-purple-600 bg-purple-50 px-1 rounded text-[9px] font-bold">PIN: {student.pin}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-800">{student.courseTitle}</div>
                        <div className="text-[10px] text-gray-400">Class of {student.expectedGraduation}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {student.attendancePercentage}%
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="w-32">
                          <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                            <span>Module {student.completedModules}/{student.totalModules}</span>
                            <span>{student.progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${student.progressPercentage}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">
                          GH₵ {student.paidFees.toLocaleString()} / GH₵ {student.totalFees.toLocaleString()}
                        </div>
                        <span className={`text-[10px] font-semibold ${isFullyPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {isFullyPaid ? 'Fully Paid ✓' : `GH₵ ${feeBalance.toLocaleString()} Due`}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenStudent(student)}
                          className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View / Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: WORKERS */}
      {activeTab === 'workers' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Tailoring Staff &amp; Artisan Roster</h3>
              <p className="text-xs text-gray-500">Live clock-in statuses, specialization skills, and payroll commission rates</p>
            </div>
            <button
              onClick={onOpenNewWorker}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Tailor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6">
            {filteredWorkers.map((worker) => (
              <div 
                key={worker.id} 
                onClick={() => handleOpenWorker(worker)}
                className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/70 space-y-4 cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-amber-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover" />
                    {worker.isClockedIn && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-amber-900 transition-colors">{worker.name}</h4>
                    <p className="text-xs text-amber-700 font-medium">{worker.roleTitle}</p>
                    <span className="text-[10px] text-gray-400 font-mono">{worker.workerId} • ★ {worker.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Specialization:</span>
                    <span className="font-semibold text-gray-800">{worker.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base Salary:</span>
                    <span className="font-bold text-gray-900">GH₵ {worker.baseSalary}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Commission Rate:</span>
                    <span className="font-bold text-purple-700">GH₵ {worker.commissionPerPiece}/piece</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`font-bold ${worker.isClockedIn ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {worker.isClockedIn ? '● Clocked In (Active)' : '○ Off-duty'}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-amber-900 group-hover:text-amber-700">
                  <span>View Full Profile &amp; Shift</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ATTENDANCE LOG */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Daily Attendance Master Log</h3>
              <p className="text-xs text-gray-500">Real-time check-in stream via QR Scanner, PIN and Reception override</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-900 font-bold text-xs rounded-full flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                Live Attendance Scanner
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <th className="p-4">Date &amp; Time</th>
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Check-In Method</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-mono font-medium text-gray-700">
                      {record.date} at {record.checkInTime}
                    </td>
                    <td className="p-4 font-bold text-gray-900">{record.userName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                        record.userRole === 'student' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {record.userRole}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-gray-600">
                      {record.method === 'QR_SCAN' ? '📱 QR Code' : '🔢 PIN Entry'}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Customer Orders &amp; Workshop Dispatch</h3>
              <p className="text-xs text-gray-500">Assign orders to head tailors and progress status stages</p>
            </div>
            {onOpenNewOrder && (
              <button
                onClick={onOpenNewOrder}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create Bespoke Order</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Garment Description</th>
                  <th className="p-4">Target Date</th>
                  <th className="p-4">Assigned Tailor</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => handleOpenOrder(order)}
                    className="hover:bg-purple-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="p-4 font-bold text-purple-900 font-mono">{order.orderNumber}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900 group-hover:text-purple-900 transition-colors">{order.customerName}</div>
                      <div className="text-[10px] text-gray-500">{order.customerPhone}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-700 max-w-[200px] truncate">
                      {order.items[0]?.garmentName}
                    </td>
                    <td className="p-4 font-medium text-gray-600">{order.targetDeliveryDate}</td>
                    <td className="p-4 font-bold text-amber-900">{order.assignedWorkerName || 'Unassigned'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenOrder(order)}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Fashion Academy Course Curricula</h3>
              <p className="text-xs text-gray-500">Accredited diploma syllabi, classroom schedules, tuition fees &amp; instructors</p>
            </div>
            {onOpenNewCourse && (
              <button
                onClick={onOpenNewCourse}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add Course Curricula</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id} 
                onClick={() => handleOpenCourse(course)}
                className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">
                      {course.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {course.level}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-base group-hover:text-indigo-950 transition-colors">{course.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{course.description}</p>
                  <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold text-gray-800">{course.durationWeeks} Weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tuition Fee:</span>
                      <span className="font-bold text-purple-900">GH₵ {course.fee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Instructor:</span>
                      <span className="font-medium text-gray-700">{course.instructor}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <div>
                    <h5 className="text-[11px] font-bold text-gray-700 mb-1.5">Curriculum Modules:</h5>
                    <ul className="space-y-1 text-[11px] text-gray-600">
                      {course.modules.slice(0, 4).map((mod, idx) => (
                        <li key={idx} className="truncate">• {mod}</li>
                      ))}
                      {course.modules.length > 4 && (
                        <li className="text-purple-600 font-bold">+ {course.modules.length - 4} more advanced modules</li>
                      )}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[11px] font-bold text-indigo-900 group-hover:text-indigo-700">
                    <span>Manage Syllabus &amp; Students</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Reset Account Password</h3>
              <button 
                onClick={() => setResetModalUser(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordResetSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl">
                <div className="font-bold text-purple-900">{resetModalUser.name} ({resetModalUser.role})</div>
                <div className="text-gray-500 font-mono text-[11px]">{resetModalUser.email}</div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">New Assigned Password</label>
                <input
                  type="text"
                  value={newPasswordInput}
                  minLength={8}
                  autoComplete="new-password"
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-mono font-bold text-sm focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold"
                >
                  Confirm &amp; Issue Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
