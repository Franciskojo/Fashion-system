'use client';

import React, { useState } from 'react';
import { Student, Worker, Order, PayrollRecord, Course } from '@/lib/types';
import { 
  Users, 
  GraduationCap, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  PlusCircle, 
  FileText, 
  CheckCircle, 
  ArrowUpRight,
  Sparkles, 
  Calendar, 
  AlertCircle,
  Award,
  BookOpen,
  Clock,
  Scissors,
  ShieldCheck,
  Search,
  CheckCircle2,
  Eye,
  Edit3,
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  Check,
  Save,
  KeyRound,
  ArrowLeft,
  Ruler,
  Plus,
  Trash2
} from 'lucide-react';

interface OwnerDashboardProps {
  students: Student[];
  workers: Worker[];
  orders: Order[];
  payroll: PayrollRecord[];
  courses: Course[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenNewStudent: () => void;
  onOpenNewWorker: () => void;
  onOpenNewOrder: () => void;
  onOpenNewCourse?: () => void;
  onGeneratePayroll: () => void;
  onViewOrder: (order: Order) => void;
  onUpdateStudent?: (student: Student) => void;
  onUpdateWorker?: (worker: Worker) => void;
  onUpdateOrder?: (order: Order) => void;
  onUpdateCourse?: (course: Course) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  students,
  workers,
  orders,
  payroll,
  courses,
  activeTab = 'overview',
  onTabChange,
  onOpenNewStudent,
  onOpenNewWorker,
  onOpenNewOrder,
  onOpenNewCourse,
  onGeneratePayroll,
  onViewOrder,
  onUpdateStudent,
  onUpdateWorker,
  onUpdateOrder,
  onUpdateCourse,
}) => {
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Student View & Update State
  const [selectedStudentForView, setSelectedStudentForView] = useState<Student | null>(null);
  const [studentModalMode, setStudentModalMode] = useState<'view' | 'edit'>('view');
  
  // Selected Worker, Order & Course View State
  const [selectedWorkerForView, setSelectedWorkerForView] = useState<Worker | null>(null);
  const [selectedOrderForView, setSelectedOrderForView] = useState<Order | null>(null);
  const [selectedCourseForView, setSelectedCourseForView] = useState<Course | null>(null);

  // Student Edit Form State
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
  const [updateToast, setUpdateToast] = useState<string | null>(null);

  // Worker Edit Form State
  const [editWorkerName, setEditWorkerName] = useState('');
  const [editWorkerEmail, setEditWorkerEmail] = useState('');
  const [editWorkerPhone, setEditWorkerPhone] = useState('');
  const [editWorkerRoleTitle, setEditWorkerRoleTitle] = useState('');
  const [editWorkerSpecialization, setEditWorkerSpecialization] = useState('');
  const [editWorkerBaseSalary, setEditWorkerBaseSalary] = useState(0);
  const [editWorkerCommission, setEditWorkerCommission] = useState(0);
  const [editWorkerIsClockedIn, setEditWorkerIsClockedIn] = useState(true);
  const [editWorkerRating, setEditWorkerRating] = useState(5.0);
  const [editWorkerCompletedOrders, setEditWorkerCompletedOrders] = useState(0);
  const [editWorkerJoinDate, setEditWorkerJoinDate] = useState('');

  // Order Edit Form State
  const [editOrderCustomerName, setEditOrderCustomerName] = useState('');
  const [editOrderCustomerPhone, setEditOrderCustomerPhone] = useState('');
  const [editOrderCustomerEmail, setEditOrderCustomerEmail] = useState('');
  const [editOrderGarmentName, setEditOrderGarmentName] = useState('');
  const [editOrderCategory, setEditOrderCategory] = useState('');
  const [editOrderFabric, setEditOrderFabric] = useState('');
  const [editOrderWorkerId, setEditOrderWorkerId] = useState('');
  const [editOrderTotalAmount, setEditOrderTotalAmount] = useState(0);
  const [editOrderPaidAmount, setEditOrderPaidAmount] = useState(0);
  const [editOrderTargetDate, setEditOrderTargetDate] = useState('');
  const [editOrderNotes, setEditOrderNotes] = useState('');
  const [editOrderBust, setEditOrderBust] = useState(36);
  const [editOrderWaist, setEditOrderWaist] = useState(28);
  const [editOrderHips, setEditOrderHips] = useState(40);
  const [editOrderShoulder, setEditOrderShoulder] = useState(15);
  const [editOrderLength, setEditOrderLength] = useState(58);

  // Course Edit Form State
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

  const handleOpenStudent = (student: Student, mode: 'view' | 'edit' = 'view') => {
    setSelectedStudentForView(student);
    setSelectedWorkerForView(null);
    setSelectedOrderForView(null);
    setSelectedCourseForView(null);
    setStudentModalMode(mode);
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
          category: (editOrderCategory as any) || 'Bridal / Evening',
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
      const updated: Order = {
        ...selectedOrderForView,
        status: next as any,
      };
      if (onUpdateOrder) onUpdateOrder(updated);
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

  const handleSaveStudent = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedStudentForView) return;

    const matchedCourse = courses.find(c => c.id === editStudentCourseId);
    const courseTitle = matchedCourse ? matchedCourse.title : selectedStudentForView.courseTitle;
    const totalMods = matchedCourse ? matchedCourse.totalModules : Number(editStudentTotalModules) || 5;

    const completed = Math.max(0, Math.min(Number(editStudentCompletedModules), totalMods));
    const progress = Math.min(100, Math.round((completed / Math.max(1, totalMods)) * 100));

    const updatedStudent: Student = {
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

    if (onUpdateStudent) {
      onUpdateStudent(updatedStudent);
    }
    setSelectedStudentForView(updatedStudent);
    setUpdateToast('Student records updated successfully!');
    setTimeout(() => setUpdateToast(null), 3000);
  };

  const handleQuickAddModule = () => {
    if (!selectedStudentForView) return;
    const totalM = selectedStudentForView.totalModules || 5;
    const newCompleted = Math.min(totalM, selectedStudentForView.completedModules + 1);
    const newProgress = Math.min(100, Math.round((newCompleted / Math.max(1, totalM)) * 100));
    const updated: Student = {
      ...selectedStudentForView,
      completedModules: newCompleted,
      progressPercentage: newProgress,
      status: newCompleted === totalM ? 'graduated' : selectedStudentForView.status,
    };
    if (onUpdateStudent) onUpdateStudent(updated);
    setSelectedStudentForView(updated);
    setEditStudentCompletedModules(newCompleted);
    setUpdateToast(`Module ${newCompleted}/${totalM} marked completed!`);
    setTimeout(() => setUpdateToast(null), 3000);
  };

  const handleQuickAddPayment = (amount: number) => {
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

  const handleQuickGraduate = () => {
    if (!selectedStudentForView) return;
    const totalM = selectedStudentForView.totalModules || 5;
    const updated: Student = {
      ...selectedStudentForView,
      status: 'graduated',
      completedModules: totalM,
      progressPercentage: 100,
      certificateId: selectedStudentForView.certificateId || `CERT-STF-2026-${String(Math.floor(100 + Math.random() * 900))}`
    };
    if (onUpdateStudent) onUpdateStudent(updated);
    setSelectedStudentForView(updated);
    setEditStudentStatus('graduated');
    setEditStudentCompletedModules(totalM);
    setUpdateToast('Student graduated & certified successfully!');
    setTimeout(() => setUpdateToast(null), 3000);
  };

  // Calculations
  const activeWorkersCount = workers.filter((w) => w.isClockedIn).length;
  const inProgressOrdersCount = orders.filter((o) => o.status !== 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.paidAmount, 0) + students.reduce((sum, s) => sum + s.paidFees, 0);
  const totalStudentFeesCollected = students.reduce((sum, s) => sum + s.paidFees, 0);
  const totalStudentFeesReceivable = students.reduce((sum, s) => sum + s.totalFees, 0);
  const avgStudentProgress = students.length > 0 
    ? Math.round(students.reduce((sum, s) => sum + s.progressPercentage, 0) / students.length)
    : 0;
  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendancePercentage, 0) / students.length)
    : 0;

  // Monthly trends mock dataset
  const monthlyData = [
    { month: 'Jan', revenue: 38, orders: 18, students: 22 },
    { month: 'Feb', revenue: 45, orders: 24, students: 28 },
    { month: 'Mar', revenue: 52, orders: 30, students: 35 },
    { month: 'Apr', revenue: 68, orders: 36, students: 44 },
    { month: 'May', revenue: 75, orders: 42, students: 58 },
    { month: 'Jun', revenue: 90, orders: 50, students: 70 },
    { month: 'Jul', revenue: 98, orders: 54, students: 82 },
    { month: 'Aug', revenue: 115, orders: 62, students: 95 },
    { month: 'Sep', revenue: 135, orders: 74, students: 120 },
  ];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // =========================================================================
  // DEDICATED FULL-PAGE VIEW: EXECUTIVE STUDENT PROFILE & MANAGEMENT
  // =========================================================================
  if (selectedStudentForView) {
    const activeStudentCourse = courses.find(c => c.id === (editStudentCourseId || selectedStudentForView.courseId)) || courses[0];
    const totalFeeNum = Number(editStudentTotalFees) || selectedStudentForView.totalFees || 3000;
    const paidFeeNum = Number(editStudentPaidFees) || 0;
    const balance = Math.max(0, totalFeeNum - paidFeeNum);
    const isSettled = balance === 0;
    const totalMods = Number(editStudentTotalModules) || activeStudentCourse?.totalModules || 5;
    const completedMods = Math.max(0, Math.min(Number(editStudentCompletedModules), totalMods));
    const progressPerc = Math.min(100, Math.round((completedMods / Math.max(1, totalMods)) * 100));

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Back Navigation & Action Bar */}
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
              <span>Back to Academy Oversight</span>
            </button>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <div className="text-xs text-gray-500 hidden sm:block">
              Student Academic Dossier • <span className="font-mono font-bold text-purple-900">{selectedStudentForView.studentId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {editStudentStatus !== 'graduated' && (
              <button
                onClick={handleQuickGraduate}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-blue-200 shrink-0"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Mark as Graduated</span>
              </button>
            )}
            <button
              onClick={() => handleSaveStudent()}
              className="px-5 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Apply Changes</span>
            </button>
          </div>
        </div>

        {/* Success Toast Banner */}
        {updateToast && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs font-bold shadow-xs animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{updateToast}</span>
          </div>
        )}

        {/* Student Profile Hero Banner */}
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

            {/* Quick KPI pills */}
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

        {/* 2-Column Page Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Academic Syllabus, Milestones & Tuition Settlements (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interactive Syllabus Modules Checklist */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Curriculum Modules</h3>
                  <p className="text-xs text-gray-500">Interactive module progression &amp; practical milestones</p>
                </div>
                <button
                  type="button"
                  onClick={handleQuickAddModule}
                  disabled={completedMods >= totalMods}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+1 Module</span>
                </button>
              </div>

              {/* Progress Bar */}
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

              {/* Modules List */}
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

            {/* Tuition Fee Compliance & Quick Payments Card */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Tuition Fee Ledger</h3>
                  <p className="text-xs text-gray-500">Track tuition installments &amp; issue balance receipts</p>
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

              {/* Quick Payment Buttons */}
              {!isSettled && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-600 uppercase">Quick Log Payment</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickAddPayment(500)}
                      className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all border border-emerald-200"
                    >
                      + GH₵ 500
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAddPayment(1000)}
                      className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all border border-emerald-200"
                    >
                      + GH₵ 1,000
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAddPayment(balance)}
                      className="px-2.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      Pay Full
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Full Editable Student Profile Form (7 cols) */}
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
                  {/* Full Name */}
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

                  {/* Email */}
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

                  {/* Phone */}
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

                  {/* Enrolled Course */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Enrolled Diploma Program</label>
                    <select
                      value={editStudentCourseId}
                      onChange={(e) => {
                        const selectedC = courses.find(c => c.id === e.target.value);
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

                  {/* Enrollment Status */}
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

                  {/* Attendance Rate */}
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

                  {/* Completed Modules */}
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

                  {/* Attendance PIN */}
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

                  {/* Total Tuition Fee */}
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

                  {/* Paid Tuition Fee */}
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

                  {/* Expected Graduation Date */}
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

                {/* Submit & Navigation Buttons */}
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
  // DEDICATED FULL-PAGE VIEW: EXECUTIVE WORKER / ARTISAN PROFILE & PERFORMANCE
  // =========================================================================
  if (selectedWorkerForView) {
    const totalCommissionsEarned = selectedWorkerForView.completedOrdersCount * selectedWorkerForView.commissionPerPiece;

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Back Navigation Bar */}
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
              <span>Back to Workforce Roster</span>
            </button>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <div className="text-xs text-gray-500 hidden sm:block">
              Executive Artisan Dossier • <span className="font-mono font-bold text-amber-900">{selectedWorkerForView.workerId}</span>
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
              <span>Save &amp; Apply Changes</span>
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

        {/* Worker Hero Profile Card */}
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
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {editWorkerPhone || 'No phone recorded'}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Employed Since: {selectedWorkerForView.joinDate}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto shrink-0">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] text-amber-200 font-bold uppercase">Base Monthly Salary</div>
                <div className="text-xl font-black text-white mt-0.5">GH₵ {Number(editWorkerBaseSalary).toLocaleString()}</div>
                <div className="text-[10px] text-amber-200">Fixed Baseline</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] text-amber-200 font-bold uppercase">Piece Commission</div>
                <div className="text-xl font-black text-white mt-0.5">GH₵ {Number(editWorkerCommission)}</div>
                <div className="text-[10px] text-emerald-300 font-semibold">Per Finished Garment</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] text-amber-200 font-bold uppercase">Completed Pieces</div>
                <div className="text-xl font-black text-white mt-0.5">{editWorkerCompletedOrders}</div>
                <div className="text-[10px] text-amber-200">★ {Number(editWorkerRating).toFixed(1)} Quality Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Dossier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Metrics & Payout Ledger */}
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

          {/* Right Column: Edit Profile Form */}
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
  // DEDICATED FULL-PAGE VIEW: EXECUTIVE BESPOKE ORDER WORKFLOW & DETAIL VIEW
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
        {/* Top Back Navigation Bar */}
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
              <span>Back to Garment Production</span>
            </button>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <div className="text-xs text-gray-500 hidden sm:block">
              Executive Order Dossier • <span className="font-mono font-bold text-rose-950">{selectedOrderForView.orderNumber}</span>
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

        {/* Update Toast */}
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
                <div className="text-[10px] text-rose-200 font-bold uppercase">Total Price</div>
                <div className="text-xl font-black text-white mt-0.5">GH₵ {Number(editOrderTotalAmount).toLocaleString()}</div>
                <div className="text-[10px] text-emerald-300 font-semibold">GH₵ {Number(editOrderPaidAmount).toLocaleString()} Paid</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] text-rose-200 font-bold uppercase">Balance Due</div>
                <div className="text-xl font-black text-white mt-0.5">GH₵ {balance.toLocaleString()}</div>
                <div className="text-[10px] text-rose-200">{isPaid ? 'Settled' : 'Pending Payment'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Stage Pipeline Stepper */}
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">6-Stage Atelier Workflow</h3>
            <span className="text-xs text-purple-700 font-bold capitalize">Current: {selectedOrderForView.status}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {stages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={stage.key}
                  className={`p-3 rounded-2xl text-center border transition-all ${
                    isCurrent
                      ? 'bg-purple-900 text-white border-purple-900 shadow-sm font-bold'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold'
                      : 'bg-gray-50 text-gray-400 border-gray-200'
                  }`}
                >
                  <div className="text-xs">{stage.label}</div>
                  <div className="text-[10px] mt-1 font-normal">
                    {isCurrent ? 'Active Now' : isPast ? 'Completed ✓' : 'Upcoming'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Detail & Update Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Measurements & Billing Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Client Body Measurements</h3>
                  <p className="text-xs text-gray-500">Precision tailoring dimensions (Inches)</p>
                </div>
                <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                  <Ruler className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Bust/Chest</div>
                  <div className="text-base font-black text-purple-950 mt-0.5">{editOrderBust}&quot;</div>
                </div>
                <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Waist</div>
                  <div className="text-base font-black text-purple-950 mt-0.5">{editOrderWaist}&quot;</div>
                </div>
                <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Hips</div>
                  <div className="text-base font-black text-purple-950 mt-0.5">{editOrderHips}&quot;</div>
                </div>
                <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Shoulder</div>
                  <div className="text-base font-black text-purple-950 mt-0.5">{editOrderShoulder}&quot;</div>
                </div>
                <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100 col-span-2">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Full Length</div>
                  <div className="text-base font-black text-purple-950 mt-0.5">{editOrderLength}&quot;</div>
                </div>
              </div>
            </div>

            {/* Billing Ledger Summary */}
            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4">
              <h3 className="font-bold text-gray-900 text-base">Financial Settlement</h3>
              <div className="space-y-3 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Invoice Value:</span>
                  <span className="font-bold text-gray-900">GH₵ {Number(editOrderTotalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Deposit / Paid to Date:</span>
                  <span className="font-bold text-emerald-700">GH₵ {Number(editOrderPaidAmount).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
                  <span className="text-gray-800">Outstanding Receivable:</span>
                  <span className={balance > 0 ? 'text-rose-600 font-black' : 'text-emerald-700'}>
                    GH₵ {balance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Edit & Tailor Reassignment Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Update Bespoke Order Docket</h3>
                  <p className="text-xs text-gray-500">Edit garment specs, assigned tailor, delivery date &amp; measurements</p>
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
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Customer Phone</label>
                    <input
                      type="text"
                      required
                      value={editOrderCustomerPhone}
                      onChange={(e) => setEditOrderCustomerPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Garment Style / Title</label>
                    <input
                      type="text"
                      required
                      value={editOrderGarmentName}
                      onChange={(e) => setEditOrderGarmentName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Category</label>
                    <input
                      type="text"
                      value={editOrderCategory}
                      onChange={(e) => setEditOrderCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Fabric &amp; Materials</label>
                    <input
                      type="text"
                      value={editOrderFabric}
                      onChange={(e) => setEditOrderFabric(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Assigned Master Tailor</label>
                    <select
                      value={editOrderWorkerId}
                      onChange={(e) => setEditOrderWorkerId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold text-purple-950"
                    >
                      <option value="">Unassigned</option>
                      {workers.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.roleTitle})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Total Amount (GH₵)</label>
                    <input
                      type="number"
                      min="0"
                      value={editOrderTotalAmount}
                      onChange={(e) => setEditOrderTotalAmount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Paid Amount (GH₵)</label>
                    <input
                      type="number"
                      min="0"
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
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold"
                    />
                  </div>

                  {/* Body Measurements Edit */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Bust/Chest (Inches)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editOrderBust}
                      onChange={(e) => setEditOrderBust(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Waist (Inches)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editOrderWaist}
                      onChange={(e) => setEditOrderWaist(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Hips (Inches)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editOrderHips}
                      onChange={(e) => setEditOrderHips(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Shoulder Width (Inches)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editOrderShoulder}
                      onChange={(e) => setEditOrderShoulder(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1.5">Full Length (Inches)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editOrderLength}
                      onChange={(e) => setEditOrderLength(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1.5">Tailoring Notes &amp; Special Design Instructions</label>
                    <textarea
                      rows={2}
                      value={editOrderNotes}
                      onChange={(e) => setEditOrderNotes(e.target.value)}
                      placeholder="e.g. Include gold embroidery on cuffs, satin lining"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
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
                    <span>Save &amp; Update Order</span>
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
  // DEDICATED FULL-PAGE VIEW: EXECUTIVE ACADEMY DIPLOMA CURRICULA & SYLLABI
  // =========================================================================
  if (selectedCourseForView) {
    const enrolledStudents = students.filter(s => s.courseId === selectedCourseForView.id || s.courseTitle === selectedCourseForView.title);
    const avgAttendance = enrolledStudents.length > 0
      ? Math.round(enrolledStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / enrolledStudents.length)
      : 100;
    const totalTuitionEarned = enrolledStudents.reduce((sum, s) => sum + s.paidFees, 0);

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
                <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-indigo-300" /> Lead Instructor: {editCourseInstructor}</span>
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

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-100 rounded-xl text-purple-800">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                {activeTab === 'academy' && 'Fashion Academy Oversight'}
                {activeTab === 'courses' && 'Academy Course Curricula & Syllabi'}
                {activeTab === 'artisans' && 'Tailor Productivity & Workforce'}
                {activeTab === 'pipeline' && 'Garment Production Pipeline'}
                {activeTab === 'financials' && 'Executive Financial & Payroll Audit'}
                {(!activeTab || activeTab === 'overview') && 'Executive Owner Dashboard'}
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                {activeTab === 'academy' && 'Student enrollment roster, learning milestones, and tuition fee compliance'}
                {activeTab === 'courses' && 'Accredited diploma syllabi, curriculum module checklists, durations & tuition fee schedules'}
                {activeTab === 'artisans' && 'Artisan shift clocks, piece-rate commissions, output ratings & capacity'}
                {activeTab === 'pipeline' && 'Live tracking of custom client orders across 6 bespoke tailoring stages'}
                {activeTab === 'financials' && 'Comprehensive revenue audit, tuition fee collection & monthly payroll slips'}
                {(!activeTab || activeTab === 'overview') && 'High-level operational metrics, revenue intelligence, and fashion academy oversight'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === 'month' ? 'bg-white text-purple-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('quarter')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === 'quarter' ? 'bg-white text-purple-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Quarter
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeframe === 'year' ? 'bg-white text-purple-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Fiscal Year
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACADEMY OVERSIGHT VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'academy' && (
        <div className="space-y-6">
          {/* Academy KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enrolled Students</span>
                <div className="text-2xl font-black text-gray-900 pt-1">{students.length} Active</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">100% Registered</div>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Syllabus Progress</span>
                <div className="text-2xl font-black text-gray-900 pt-1">{avgStudentProgress}%</div>
                <div className="text-[11px] text-blue-600 font-bold mt-1">On-track for Graduation</div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tuition Fees Collected</span>
                <div className="text-2xl font-black text-purple-900 pt-1">GH₵ {totalStudentFeesCollected.toLocaleString()}</div>
                <div className="text-[10px] text-gray-500 mt-1">of GH₵ {totalStudentFeesReceivable.toLocaleString()} total</div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Attendance</span>
                <div className="text-2xl font-black text-gray-900 pt-1">{avgAttendance}%</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">QR & PIN verified</div>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Student Directory Table for Academy Oversight */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Enrolled Academy Students</h3>
                <p className="text-xs text-gray-500 mt-0.5">Track learning progress, syllabus completion, and tuition fee compliance</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search student or course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={onOpenNewStudent}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Enroll Student</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                    <th className="p-4">Student Profile</th>
                    <th className="p-4">Course Enrolled</th>
                    <th className="p-4">Syllabus Progress</th>
                    <th className="p-4">Attendance</th>
                    <th className="p-4">Tuition Fees</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr 
                      key={student.id} 
                      onClick={() => handleOpenStudent(student, 'view')}
                      className="hover:bg-purple-50/40 cursor-pointer transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={student.avatar} alt={student.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-gray-200 group-hover:ring-purple-400 transition-all" />
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-purple-900 transition-colors flex items-center gap-1.5">
                              {student.name}
                            </div>
                            <div className="font-mono text-[10px] text-gray-500">{student.studentId} • {student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-purple-950">
                        {student.courseTitle}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1.5 w-36">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-gray-700">{student.progressPercentage}%</span>
                            <span className="text-gray-400">{student.completedModules}/{student.totalModules} mods</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-pink-500 h-1.5 rounded-full"
                              style={{ width: `${student.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {student.attendancePercentage}%
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-bold text-gray-900">GH₵ {student.paidFees.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-500">
                            {student.totalFees - student.paidFees === 0 ? (
                              <span className="text-emerald-600 font-bold">Fully Paid</span>
                            ) : (
                              <span className="text-amber-600 font-bold">GH₵ {(student.totalFees - student.paidFees).toLocaleString()} bal</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          student.status === 'graduated' 
                            ? 'bg-blue-100 text-blue-800' 
                            : student.status === 'suspended'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenStudent(student, 'view')}
                            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold text-[11px] transition-colors flex items-center gap-1"
                            title="View Student Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleOpenStudent(student, 'edit')}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[11px] transition-colors flex items-center gap-1 shadow-xs"
                            title="Update Student Records"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: SEPARATED COURSE CURRICULA & SYLLABI VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Course Curricula Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Programs</span>
                <div className="text-2xl font-black text-gray-900 pt-1">{courses.length} Accredited Tracks</div>
                <div className="text-[11px] text-indigo-600 font-bold mt-1">Full-time & Part-time</div>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Average Tuition Fee</span>
                <div className="text-2xl font-black text-purple-900 pt-1">
                  GH₵ {courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + c.fee, 0) / courses.length).toLocaleString() : 0}
                </div>
                <div className="text-[11px] text-purple-600 font-bold mt-1">Per Diploma Term</div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Curricula Units</span>
                <div className="text-2xl font-black text-gray-900 pt-1">
                  {courses.reduce((sum, c) => sum + c.modules.length, 0)} Modules
                </div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">Practical & Theory</div>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Syllabus Levels</span>
                <div className="text-2xl font-black text-gray-900 pt-1">3 Levels</div>
                <div className="text-[11px] text-amber-700 font-bold mt-1">Beginner to Masterclass</div>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Curricula Cards Header & Action */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Academy Diploma Curricula &amp; Syllabi</h3>
                <p className="text-xs text-gray-500">Official diploma course certifications, class schedules, instructors &amp; modules</p>
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
                  className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">
                        {course.code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {course.level}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[10px] group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center gap-1">
                          <Eye className="w-2.5 h-2.5" />
                          <span>View Full Dossier</span>
                        </span>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 text-base group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                      <span>{course.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{course.description}</p>
                    
                    <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1.5">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-semibold text-gray-800">{course.durationWeeks} Weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tuition Fee:</span>
                        <span className="font-bold text-purple-900">GH₵ {course.fee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lead Instructor:</span>
                        <span className="font-medium text-gray-700">{course.instructor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Class Schedule:</span>
                        <span className="font-medium text-gray-700 truncate max-w-[180px]">{course.schedule}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-[11px] font-bold text-gray-700">Curriculum Modules:</h5>
                      <span className="text-[10px] text-indigo-600 font-semibold">{course.modules.length} units</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-gray-600">
                      {course.modules.slice(0, 3).map((mod, idx) => (
                        <li key={idx} className="truncate text-gray-600">• {mod}</li>
                      ))}
                      {course.modules.length > 3 && (
                        <li className="text-indigo-600 font-bold">+ {course.modules.length - 3} more advanced units</li>
                      )}
                    </ul>

                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                      <span>Manage Syllabus &amp; Enrolled Cohort</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TAILOR PRODUCTIVITY VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'artisans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Artisans</span>
              <div className="text-2xl font-black text-gray-900 pt-1">{workers.length} Tailors</div>
              <div className="text-[11px] text-amber-600 font-bold mt-1">{activeWorkersCount} Currently Clocked In</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed Garments</span>
              <div className="text-2xl font-black text-gray-900 pt-1">
                {workers.reduce((sum, w) => sum + w.completedOrdersCount, 0)} Pieces
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">High Quality Standard</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Piece Rate Paid</span>
              <div className="text-2xl font-black text-purple-900 pt-1">
                GH₵ {workers.reduce((sum, w) => sum + (w.completedOrdersCount * w.commissionPerPiece), 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-purple-600 font-bold mt-1">Direct Artisan Commissions</div>
            </div>
          </div>

          {/* Artisans Roster Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Tailor &amp; Artisan Workforce Roster</h3>
                <p className="text-xs text-gray-500">Shift status, piece commissions, completed garment counts and ratings</p>
              </div>
              <button
                onClick={onOpenNewWorker}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Tailor</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                    <th className="p-4">Artisan Name</th>
                    <th className="p-4">Role Title &amp; Specialization</th>
                    <th className="p-4">Base Salary</th>
                    <th className="p-4">Commission/Piece</th>
                    <th className="p-4">Completed Garments</th>
                    <th className="p-4">Shift Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workers.map((worker) => (
                    <tr 
                      key={worker.id} 
                      onClick={() => handleOpenWorker(worker)}
                      className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={worker.avatar} alt={worker.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-gray-200" />
                          <div>
                            <div className="font-bold text-gray-900">{worker.name}</div>
                            <div className="font-mono text-[10px] text-gray-500">{worker.workerId} • ★ {worker.rating.toFixed(1)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{worker.roleTitle}</div>
                        <div className="text-[10px] text-amber-700 font-medium">{worker.specialization}</div>
                      </td>
                      <td className="p-4 font-bold text-gray-900">GH₵ {worker.baseSalary.toLocaleString()}</td>
                      <td className="p-4 font-bold text-purple-900">GH₵ {worker.commissionPerPiece}</td>
                      <td className="p-4 font-bold text-emerald-700">{worker.completedOrdersCount} garments</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          worker.isClockedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {worker.isClockedIn ? '● Clocked In' : 'Off Shift'}
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

      {/* ========================================================================= */}
      {/* TAB 3: PRODUCTION PIPELINE VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Full Garment Production Pipeline</h3>
                <p className="text-xs text-gray-500">Live workshop status across 6 production stages</p>
              </div>
              <button
                onClick={onOpenNewOrder}
                className="px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Order</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Garment</th>
                    <th className="p-4">Assigned Artisan</th>
                    <th className="p-4">Target Date</th>
                    <th className="p-4">Stage</th>
                    <th className="p-4 text-right">Order Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => handleOpenOrder(order)}
                      className="hover:bg-purple-50/40 cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-bold text-purple-900 font-mono">{order.orderNumber}</td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{order.customerName}</div>
                        <div className="text-[10px] text-gray-500">{order.customerPhone}</div>
                      </td>
                      <td className="p-4 font-medium text-gray-800">{order.items[0]?.garmentName}</td>
                      <td className="p-4 font-bold text-amber-900">{order.assignedWorkerName || 'Unassigned'}</td>
                      <td className="p-4 font-medium text-gray-600">{order.targetDeliveryDate}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-black text-gray-900">GH₵ {order.totalAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FINANCIALS & PAYROLL VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gross Business Revenue</span>
              <div className="text-2xl font-black text-gray-900 pt-1">GH₵ {(totalRevenue + 7100).toLocaleString()}</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">Orders & Academy Tuition</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Monthly Payroll Expense</span>
              <div className="text-2xl font-black text-purple-900 pt-1">
                GH₵ {payroll.reduce((sum, p) => sum + p.netPay, 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-purple-600 font-bold mt-1">{payroll.length} Disbursed Slips</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Net Operating Margin</span>
              <div className="text-2xl font-black text-blue-900 pt-1">68.4%</div>
              <div className="text-[11px] text-blue-600 font-bold mt-1">Healthy Enterprise Health</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Monthly Staff Payroll Slips</h3>
                <p className="text-xs text-gray-500">Base salaries, piece-rate bonuses and net payouts</p>
              </div>
              <button
                onClick={onGeneratePayroll}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" />
                <span>Generate Payroll</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                    <th className="p-4">Artisan Staff</th>
                    <th className="p-4">Month/Year</th>
                    <th className="p-4">Base Salary</th>
                    <th className="p-4">Completed Pieces</th>
                    <th className="p-4">Commission Bonus</th>
                    <th className="p-4">Net Disbursed</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payroll.map((pay) => (
                    <tr key={pay.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">{pay.workerName}</td>
                      <td className="p-4 font-medium text-gray-600">{pay.monthYear}</td>
                      <td className="p-4 font-medium text-gray-900">GH₵ {pay.baseSalary.toLocaleString()}</td>
                      <td className="p-4 font-bold text-amber-900">{pay.completedPieces} pieces</td>
                      <td className="p-4 font-bold text-purple-900">GH₵ {pay.commissionAmount.toLocaleString()}</td>
                      <td className="p-4 font-black text-emerald-800">GH₵ {pay.netPay.toLocaleString()}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          {pay.paymentStatus}
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

      {/* ========================================================================= */}
      {/* DEFAULT / MASTER OVERVIEW TAB */}
      {/* ========================================================================= */}
      {(!activeTab || activeTab === 'overview') && (
        <div className="space-y-6">
          {/* KPI Cards (Exact replica of infographic owner dashboard) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Students */}
            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Students</span>
                </div>
                <div className="text-2xl font-black text-gray-900 pt-1">
                  {students.length > 0 ? students.length + 117 : 120}
                </div>
                <div className="flex items-center text-[11px] text-emerald-600 font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  <span>+12% this month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-300">
                <GraduationCap className="w-8 h-8" />
              </div>
            </div>

            {/* Workers */}
            <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Workers</span>
                </div>
                <div className="text-2xl font-black text-gray-900 pt-1">
                  {workers.length + 12}
                </div>
                <div className="text-[11px] text-amber-700 font-bold">
                  <span>{activeWorkersCount + 13} Present today</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-300">
                <Users className="w-8 h-8" />
              </div>
            </div>

            {/* Orders in Progress */}
            <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Orders</span>
                </div>
                <div className="text-2xl font-black text-gray-900 pt-1">
                  {inProgressOrdersCount + 45}
                </div>
                <div className="text-[11px] text-pink-700 font-bold">
                  <span>In progress &amp; fitting</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue</span>
                </div>
                <div className="text-2xl font-black text-gray-900 pt-1">
                  GH₵ {(totalRevenue + 7100).toLocaleString()}
                </div>
                <div className="flex items-center text-[11px] text-blue-600 font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  <span>+18% this month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-300">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Main Grid: Visual Monthly Trend Chart & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Overview Chart Area (2 Cols) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Monthly Performance Overview</h3>
                  <p className="text-xs text-gray-500">Correlation between academy enrollments, bespoke orders, and revenue (GH₵ &apos;00s)</p>
                </div>
                <div className="flex items-center space-x-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Revenue
                  </span>
                  <span className="flex items-center gap-1.5 text-pink-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-600" /> Orders
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Students
                  </span>
                </div>
              </div>

              {/* SVG Chart visualization */}
              <div className="relative h-64 w-full pt-4">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="border-b border-gray-400 w-full" />
                  <div className="border-b border-gray-400 w-full" />
                  <div className="border-b border-gray-400 w-full" />
                  <div className="border-b border-gray-400 w-full" />
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 900 200">
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#db2777" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#db2777" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Revenue Line (Blue) */}
                  <path
                    d="M 50 160 Q 150 140, 250 125 T 450 90 T 650 60 T 850 20"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Orders Line (Pink) */}
                  <path
                    d="M 50 170 Q 150 155, 250 145 T 450 120 T 650 95 T 850 70"
                    fill="none"
                    stroke="#db2777"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Students Line (Emerald) */}
                  <path
                    d="M 50 180 Q 150 170, 250 160 T 450 140 T 650 110 T 850 85"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />

                  {/* Data points */}
                  {monthlyData.map((d, i) => {
                    const x = 50 + i * 100;
                    return (
                      <g key={d.month} className="group cursor-pointer">
                        <circle cx={x} cy={180 - d.revenue} r="4.5" fill="#2563eb" className="hover:r-6 transition-all" />
                        <circle cx={x} cy={195 - d.orders * 1.6} r="4" fill="#db2777" />
                        <circle cx={x} cy={200 - d.students * 0.9} r="3.5" fill="#059669" />
                      </g>
                    );
                  })}
                </svg>

                {/* Months Axis Labels */}
                <div className="flex justify-between text-[11px] font-bold text-gray-500 pt-2 px-3 border-t border-gray-100 mt-2">
                  {monthlyData.map((d) => (
                    <span key={d.month}>{d.month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Card (1 Col) */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Quick Executive Actions</h3>
                <p className="text-xs text-gray-500 mb-4">Direct shortcuts to frequent business workflows</p>

                <div className="space-y-2.5">
                  <button
                    onClick={onOpenNewStudent}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/70 transition-all font-semibold text-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <span>Register New Student</span>
                    </div>
                    <PlusCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    onClick={onOpenNewWorker}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/70 transition-all font-semibold text-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <span>Add New Worker / Tailor</span>
                    </div>
                    <PlusCircle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    onClick={onOpenNewOrder}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-pink-50 hover:bg-pink-100/80 text-pink-900 border border-pink-200/70 transition-all font-semibold text-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <span>Create New Order Intake</span>
                    </div>
                    <PlusCircle className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    onClick={onGeneratePayroll}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-purple-50 hover:bg-purple-100/80 text-purple-900 border border-purple-200/70 transition-all font-semibold text-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <span>Generate Monthly Payroll</span>
                    </div>
                    <CheckCircle className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  Academic Term: Fall 2026
                </span>
                <span className="text-purple-700 font-bold">Audit Clean</span>
              </div>
            </div>
          </div>

          {/* Real-time Order Pipeline Stream & Tailor Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Orders Pipeline */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Active Garment Production Pipeline</h3>
                  <p className="text-xs text-gray-500">Real-time status of orders on the shop floor</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-900 font-bold px-2.5 py-1 rounded-full">
                  {orders.length} Active Jobs
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-bold">
                      <th className="pb-3">Order #</th>
                      <th className="pb-3">Customer &amp; Garment</th>
                      <th className="pb-3">Assigned Artisan</th>
                      <th className="pb-3">Target Date</th>
                      <th className="pb-3">Stage</th>
                      <th className="pb-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => {
                      const statusColors: Record<string, string> = {
                        received: 'bg-gray-100 text-gray-800',
                        designing: 'bg-purple-100 text-purple-800',
                        sewing: 'bg-amber-100 text-amber-800',
                        finishing: 'bg-blue-100 text-blue-800',
                        ready: 'bg-emerald-100 text-emerald-800',
                        delivered: 'bg-teal-100 text-teal-800',
                      };

                      return (
                        <tr 
                          key={order.id} 
                          onClick={() => handleOpenOrder(order)}
                          className="hover:bg-purple-50/40 cursor-pointer transition-colors"
                        >
                          <td className="py-3 font-bold text-purple-900">{order.orderNumber}</td>
                          <td className="py-3">
                            <div className="font-semibold text-gray-900">{order.customerName}</div>
                            <div className="text-gray-500 text-[11px] truncate max-w-[180px]">
                              {order.items[0]?.garmentName || 'Bespoke Garment'}
                            </div>
                          </td>
                          <td className="py-3 font-medium text-gray-700">
                            {order.assignedWorkerName || 'Unassigned'}
                          </td>
                          <td className="py-3 font-medium text-gray-600">
                            {order.targetDeliveryDate}
                          </td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[order.status] || 'bg-gray-100'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-black text-gray-900">
                            GH₵ {order.totalAmount.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tailor Productivity Leaderboard */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-base">Top Tailoring Artisans</h3>
                <span className="text-xs text-amber-600 font-bold">This Month</span>
              </div>

              <div className="space-y-3.5">
                {workers.map((worker, index) => (
                  <div 
                    key={worker.id} 
                    onClick={() => handleOpenWorker(worker)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 hover:bg-amber-50/50 border border-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-1 ring-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover" />
                        {worker.isClockedIn && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-1 ring-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                          {worker.name}
                          {index === 0 && <span className="text-amber-500 text-[10px]">👑</span>}
                        </h4>
                        <p className="text-[10px] text-gray-500">{worker.roleTitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-purple-900">{worker.completedOrdersCount} Pieces</span>
                      <div className="text-[10px] text-emerald-600 font-bold">★ {worker.rating.toFixed(1)} Rating</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
