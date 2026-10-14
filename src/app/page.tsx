'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { OwnerDashboard } from '@/components/owner/OwnerDashboard';
import { AdminPortal } from '@/components/admin/AdminPortal';
import { StudentPortal } from '@/components/student/StudentPortal';
import { WorkerPortal } from '@/components/worker/WorkerPortal';
import { CustomerPortal } from '@/components/customer/CustomerPortal';
import { 
  Role, Student, Worker, Order, Course, AttendanceRecord, PayrollRecord, LeaveRequest, Certificate, User 
} from '@/lib/types';

type Collection =
  | 'users' | 'students' | 'workers' | 'courses' | 'orders'
  | 'attendance' | 'payroll' | 'leaveRequests' | 'certificates';

/** Persists (insert or replace) a record in the MongoDB database. */
function saveRecord<T extends { id: string }>(collection: Collection, doc: T) {
  fetch('/api/records', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ collection, doc }),
  })
    .then((r) => {
      if (!r.ok) console.error(`Failed to save to ${collection}`);
    })
    .catch((e) => console.error(`Failed to save to ${collection}`, e));
}

import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { 
  KeyRound, 
  Copy, 
  Check, 
  Sparkles, 
  UserCheck, 
  GraduationCap, 
  Scissors, 
  ShieldCheck, 
  Send,
  BookOpen,
  ShoppingBag,
  Ruler
} from 'lucide-react';

/** Returns a persistent anonymous ID for this browser/device (stored in localStorage). */
function getDeviceId(): string {
  try {
    let id = localStorage.getItem('stitchflow_device_id');
    if (!id) {
      id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('stitchflow_device_id', id);
    }
    return id;
  } catch {
    return '';
  }
}

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Login is the first page: send visitors without a session to /login
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);
  const [activeRole, setActiveRole] = useState<Role>('owner');
  const [activeSubTab, setActiveSubTab] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync activeRole with logged-in user role
  useEffect(() => {
    if (user?.role) {
      setActiveRole(user.role);
    }
  }, [user]);

  // Reset activeSubTab when role changes
  useEffect(() => {
    setActiveSubTab('');
  }, [activeRole]);

  // Application Dynamic State
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Load all data from the MongoDB database
  useEffect(() => {
    fetch('/api/records')
      .then((r) => r.json())
      .then((json) => {
        if (!json?.success) throw new Error(json?.error || 'Could not load data from the database.');
        const d = json.data;
        setUsers(d.users);
        setStudents(d.students);
        setWorkers(d.workers);
        setOrders(d.orders);
        setCourses(d.courses);
        setAttendance(d.attendance);
        setPayroll(d.payroll);
        setLeaveRequests(d.leaveRequests);
        setCertificates(d.certificates);
        setDataReady(true);
      })
      .catch((e: unknown) => setDataError(e instanceof Error ? e.message : 'Could not load data from the database.'));
  }, []);

  // Modals
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedOrderForView, setSelectedOrderForView] = useState<Order | null>(null);

  // Handover Slip Modal
  const [credentialSlip, setCredentialSlip] = useState<{
    name: string;
    email: string;
    password: string;
    role: string;
    pin?: string;
  } | null>(null);
  const [copiedSlip, setCopiedSlip] = useState(false);

  // New Student Form
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('STF-Pass-2026');
  const [newStudentCourseId, setNewStudentCourseId] = useState('course-1');

  // New Worker Form
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerEmail, setNewWorkerEmail] = useState('');
  const [newWorkerPhone, setNewWorkerPhone] = useState('');
  const [newWorkerPassword, setNewWorkerPassword] = useState('STF-Tailor-2026');
  const [newWorkerRoleTitle, setNewWorkerRoleTitle] = useState('Senior Tailor');
  const [newWorkerSpecialization, setNewWorkerSpecialization] = useState('Suits & Agbada');
  const [newWorkerBaseSalary, setNewWorkerBaseSalary] = useState(3000);
  const [newWorkerCommission, setNewWorkerCommission] = useState(120);

  // New Course Form State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseLevel, setNewCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Masterclass'>('Beginner');
  const [newCourseDuration, setNewCourseDuration] = useState(12);
  const [newCourseFee, setNewCourseFee] = useState(3200);
  const [newCourseInstructor, setNewCourseInstructor] = useState('Madame Evelyn Osei');
  const [newCourseSchedule, setNewCourseSchedule] = useState('Mon, Wed & Fri (9:00 AM - 1:00 PM)');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseModules, setNewCourseModules] = useState('1. Introduction & Fashion Sketching\n2. Body Measurements & Sizing\n3. Flat Pattern Drafting\n4. Industrial Sewing Machine Operations\n5. Final Assessment & Runway Project');

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const modulesList = newCourseModules
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean);

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: newCourseTitle,
      code: newCourseCode || `STF-CRS-${Math.floor(100 + Math.random() * 900)}`,
      level: newCourseLevel,
      durationWeeks: Number(newCourseDuration) || 12,
      totalModules: modulesList.length || 5,
      fee: Number(newCourseFee) || 3000,
      instructor: newCourseInstructor || 'Madame Evelyn Osei',
      schedule: newCourseSchedule,
      description: newCourseDesc || 'Accredited professional fashion design and technical garment construction syllabus.',
      modules: modulesList.length > 0 ? modulesList : ['1. Course Introduction', '2. Practical Construction Workshop', '3. Final Runway Assessment'],
    };

    setCourses([newCourse, ...courses]);
    saveRecord('courses', newCourse);

    setShowCourseModal(false);
    setNewCourseTitle('');
    setNewCourseCode('');
    setNewCourseDesc('');
  };

  // New Bespoke Order Form State
  const [newOrderCustomerName, setNewOrderCustomerName] = useState('');
  const [newOrderCustomerPhone, setNewOrderCustomerPhone] = useState('');
  const [newOrderCustomerEmail, setNewOrderCustomerEmail] = useState('');
  const [newOrderGarmentName, setNewOrderGarmentName] = useState('');
  const [newOrderCategory, setNewOrderCategory] = useState<'Bridal / Evening' | 'Traditional Kente / Agbada' | 'Casual / Ready-to-Wear' | 'Corporate Suit' | 'Alteration'>('Bridal / Evening');
  const [newOrderFabric, setNewOrderFabric] = useState('');
  const [newOrderTotalAmount, setNewOrderTotalAmount] = useState<number>(1800);
  const [newOrderPaidAmount, setNewOrderPaidAmount] = useState<number>(900);
  const [newOrderTargetDate, setNewOrderTargetDate] = useState('2026-10-25');
  const [newOrderWorkerId, setNewOrderWorkerId] = useState('');
  const [newOrderBust, setNewOrderBust] = useState<number>(36);
  const [newOrderWaist, setNewOrderWaist] = useState<number>(28);
  const [newOrderHips, setNewOrderHips] = useState<number>(40);
  const [newOrderShoulder, setNewOrderShoulder] = useState<number>(15);
  const [newOrderLength, setNewOrderLength] = useState<number>(58);
  const [newOrderNotes, setNewOrderNotes] = useState('');

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedWorker = workers.find(w => w.id === newOrderWorkerId) || workers[0];
    const orderNum = `ORD-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: orderNum,
      customerId: `cust-${Date.now()}`,
      customerName: newOrderCustomerName,
      customerEmail: newOrderCustomerEmail || `${newOrderCustomerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      customerPhone: newOrderCustomerPhone,
      items: [
        {
          id: `item-${Date.now()}`,
          garmentName: newOrderGarmentName,
          category: newOrderCategory,
          fabricType: newOrderFabric,
          fabricProvidedBy: 'customer',
          notes: newOrderNotes,
          unitPrice: Number(newOrderTotalAmount) || 1500,
        }
      ],
      measurements: {
        unit: 'inches',
        bust: Number(newOrderBust) || 36,
        waist: Number(newOrderWaist) || 28,
        hips: Number(newOrderHips) || 40,
        shoulder: Number(newOrderShoulder) || 15,
        fullLength: Number(newOrderLength) || 58,
        notes: newOrderNotes,
      },
      status: 'received',
      statusHistory: [
        {
          status: 'received',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          note: `Order intake registered by ${activeRole.toUpperCase()}. Assigned to ${assignedWorker?.name || 'Unassigned'}.`,
          updatedBy: activeRole.toUpperCase(),
        }
      ],
      totalAmount: Number(newOrderTotalAmount) || 1500,
      paidAmount: Number(newOrderPaidAmount) || 0,
      paymentStatus: Number(newOrderPaidAmount) >= Number(newOrderTotalAmount) ? 'paid' : Number(newOrderPaidAmount) > 0 ? 'partially_paid' : 'pending',
      assignedWorkerId: assignedWorker?.id,
      assignedWorkerName: assignedWorker?.name,
      orderDate: new Date().toISOString().split('T')[0],
      targetDeliveryDate: newOrderTargetDate || '2026-10-30',
      notes: newOrderNotes,
    };

    setOrders([newOrder, ...orders]);
    saveRecord('orders', newOrder);

    setShowOrderModal(false);
    setNewOrderCustomerName('');
    setNewOrderCustomerPhone('');
    setNewOrderCustomerEmail('');
    setNewOrderGarmentName('');
    setNewOrderFabric('');
    setNewOrderNotes('');
  };

  // Active user entity targets
  const currentStudent = students[0] as Student;
  const currentWorker = workers[0] as Worker;
  const currentCourse = courses.find((c) => c.id === currentStudent?.courseId) || courses[0];

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.paidAmount, 0) + students.reduce((sum, s) => sum + s.paidFees, 0);
  const activeWorkersCount = workers.filter((w) => w.isClockedIn).length;
  const inProgressOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  const stats = {
    totalRevenue: totalRevenue + 7100,
    activeWorkers: activeWorkersCount + 13,
    totalStudents: students.length + 117,
    inProgressOrders: inProgressOrdersCount + 45,
  };

  // HANDLERS: Provisioning New Student
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find((c) => c.id === newStudentCourseId) || courses[0];
    const pin = String(Math.floor(1000 + Math.random() * 9000));
    const assignedPassword = newStudentPassword || `STF-${pin}`;
    const studentId = `STF-2026-${String(students.length + 1).padStart(4, '0')}`;
    const userId = `user-student-${Date.now()}`;

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      userId,
      studentId,
      name: newStudentName,
      email: newStudentEmail,
      phone: newStudentPhone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      courseId: course.id,
      courseTitle: course.title,
      enrollmentDate: new Date().toISOString().split('T')[0],
      expectedGraduation: '2026-11-30',
      status: 'enrolled',
      totalFees: course.fee,
      paidFees: 1200,
      attendancePercentage: 100,
      progressPercentage: 0,
      completedModules: 0,
      totalModules: course.totalModules,
      pin,
    };

    const newUser: User = {
      id: userId,
      name: newStudentName,
      email: newStudentEmail,
      password: assignedPassword,
      role: 'student',
      avatar: newStudent.avatar,
      phone: newStudentPhone,
      status: 'active',
    };

    setStudents([newStudent, ...students]);
    setUsers([newUser, ...users]);
    saveRecord('users', newUser);
    saveRecord('students', newStudent);

    setShowStudentModal(false);
    setCredentialSlip({
      name: newStudentName,
      email: newStudentEmail,
      password: assignedPassword,
      role: 'Fashion Academy Student',
      pin,
    });

    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('');
  };

  // HANDLERS: Update Student Information (Owner & Admin)
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    
    // Synchronize corresponding User record if present
    setUsers(prev => prev.map(u => {
      if (u.id === updatedStudent.userId || u.email === updatedStudent.email) {
        return {
          ...u,
          name: updatedStudent.name,
          email: updatedStudent.email,
          phone: updatedStudent.phone,
          status: updatedStudent.status === 'suspended' ? 'inactive' : 'active',
        };
      }
      return u;
    }));

    saveRecord('students', updatedStudent);
    const linkedUser = users.find(u => u.id === updatedStudent.userId || u.email === updatedStudent.email);
    if (linkedUser) {
      saveRecord('users', {
        ...linkedUser,
        name: updatedStudent.name,
        email: updatedStudent.email,
        phone: updatedStudent.phone,
        status: updatedStudent.status === 'suspended' ? 'inactive' : 'active',
      });
    }
  };

  // HANDLERS: Update Worker Information (Owner & Admin)
  const handleUpdateWorker = (updatedWorker: Worker) => {
    setWorkers(prev => prev.map(w => w.id === updatedWorker.id ? updatedWorker : w));
    setUsers(prev => prev.map(u => {
      if (u.id === updatedWorker.userId || u.email === updatedWorker.email) {
        return {
          ...u,
          name: updatedWorker.name,
          email: updatedWorker.email,
          phone: updatedWorker.phone,
        };
      }
      return u;
    }));
    saveRecord('workers', updatedWorker);
    const linkedWorkerUser = users.find(u => u.id === updatedWorker.userId || u.email === updatedWorker.email);
    if (linkedWorkerUser) {
      saveRecord('users', {
        ...linkedWorkerUser,
        name: updatedWorker.name,
        email: updatedWorker.email,
        phone: updatedWorker.phone,
      });
    }
  };

  // HANDLERS: Update Order Information (Owner & Admin)
  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    saveRecord('orders', updatedOrder);
  };

  // HANDLERS: Update Course & Curriculum Information (Owner & Admin)
  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    saveRecord('courses', updatedCourse);
  };

  // HANDLERS: Provisioning New Worker
  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    const workerId = `STF-WRK-${String(workers.length + 1).padStart(3, '0')}`;
    const userId = `user-worker-${Date.now()}`;
    const assignedPassword = newWorkerPassword || `STF-WRK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newWorker: Worker = {
      id: `worker-${Date.now()}`,
      userId,
      workerId,
      name: newWorkerName,
      email: newWorkerEmail,
      phone: newWorkerPhone,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      roleTitle: newWorkerRoleTitle,
      specialization: newWorkerSpecialization,
      baseSalary: newWorkerBaseSalary,
      commissionPerPiece: newWorkerCommission,
      isClockedIn: false,
      completedOrdersCount: 0,
      rating: 5.0,
      joinDate: new Date().toISOString().split('T')[0],
    };

    const newUser: User = {
      id: userId,
      name: newWorkerName,
      email: newWorkerEmail,
      password: assignedPassword,
      role: 'worker',
      avatar: newWorker.avatar,
      phone: newWorkerPhone,
      status: 'active',
    };

    setWorkers([newWorker, ...workers]);
    setUsers([newUser, ...users]);
    saveRecord('users', newUser);
    saveRecord('workers', newWorker);

    setShowWorkerModal(false);
    setCredentialSlip({
      name: newWorkerName,
      email: newWorkerEmail,
      password: assignedPassword,
      role: `Tailoring Staff (${newWorkerRoleTitle})`,
    });

    setNewWorkerName('');
    setNewWorkerEmail('');
    setNewWorkerPhone('');
  };

  const handleResetUserPassword = (userId: string, newPass: string) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, password: newPass } : u))
    );
    const target = users.find((u) => u.id === userId);
    if (target) saveRecord('users', { ...target, password: newPass });
  };

  const applyClockToggleLocally = (workerId: string, serverWorker?: Worker) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id !== workerId) return w;
        if (serverWorker) return { ...w, ...serverWorker };
        const nextClock = !w.isClockedIn;
        const now = new Date().toISOString();
        return {
          ...w,
          isClockedIn: nextClock,
          lastClockIn: nextClock ? now : w.lastClockIn,
          lastClockOut: !nextClock ? now : w.lastClockOut,
        };
      })
    );
  };

  const handleToggleClock = async (workerId: string) => {
    const target = workers.find((w) => w.id === workerId);
    if (!target) return;

    // Enforce a single clock-in per day (client-side fast check).
    if (!target.isClockedIn && target.lastClockIn) {
      if (new Date(target.lastClockIn).toDateString() === new Date().toDateString()) {
        alert('You have already clocked in today. Only one shift per day is allowed.');
        return;
      }
    }

    let serverWorker: Worker | undefined;

    try {
      const res = await fetch('/api/workers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_clock', workerId, deviceId: getDeviceId() }),
      });
      if (res.status === 409) {
        const json = await res.json().catch(() => null);
        alert(json?.error || 'You have already clocked in today. Only one shift per day is allowed.');
        return;
      }
      if (!res.ok) {
        alert('Could not update the clock status. Please try again.');
        return;
      }
      const json = await res.json();
      serverWorker = json?.data?.worker;
    } catch {
      alert('Unable to reach the server. Please check your connection and try again.');
      return;
    }

    applyClockToggleLocally(workerId, serverWorker);
    // The server records attendance on clock-in; reload it so the list stays in sync.
    fetch('/api/attendance')
      .then((r) => r.json())
      .then((json) => {
        if (json?.success) setAttendance(json.data);
      })
      .catch(() => {});
  };

  const handleMarkAttendance = (data: {
    userId: string;
    userName: string;
    userRole: 'student' | 'worker';
    status: 'present' | 'late';
    method: 'QR_SCAN' | 'PIN';
  }) => {
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      userId: data.userId,
      userName: data.userName,
      userRole: data.userRole,
      date: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method: data.method,
      status: data.status,
    };
    setAttendance([newRecord, ...attendance]);
    saveRecord('attendance', newRecord);
  };

  const handlePayFee = (amount: number) => {
    const s = students[0];
    if (!s) return;
    const updated: Student = { ...s, paidFees: Math.min(s.totalFees, s.paidFees + amount) };
    setStudents(students.map((x, idx) => (idx === 0 ? updated : x)));
    saveRecord('students', updated);
  };

  const handleCompleteStudentModule = () => {
    const s = students[0];
    if (!s) return;
    const nextMod = Math.min(s.totalModules, s.completedModules + 1);
    const nextProg = Math.round((nextMod / s.totalModules) * 100);
    const updated: Student = {
      ...s,
      completedModules: nextMod,
      progressPercentage: nextProg,
      status: nextProg >= 100 ? 'graduated' : s.status,
    };
    setStudents(students.map((x, idx) => (idx === 0 ? updated : x)));
    saveRecord('students', updated);
  };

  const handleCreateCustomerOrder = (data: any) => {
    const orderNumber = `ORD-2026-${8820 + orders.length}`;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      customerId: `cust-${Date.now()}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      items: data.items,
      measurements: data.measurements,
      status: 'received',
      statusHistory: [
        {
          status: 'received',
          timestamp: new Date().toISOString(),
          note: 'Order intake submitted online with body measurements.',
          updatedBy: 'Client Portal',
        },
      ],
      totalAmount: data.items[0]?.unitPrice || 1650,
      paidAmount: data.depositAmount || 0,
      paymentStatus: data.depositAmount >= (data.items[0]?.unitPrice || 1650) ? 'paid' : data.depositAmount > 0 ? 'partially_paid' : 'pending',
      assignedWorkerId: workers[0]?.id,
      assignedWorkerName: workers[0]?.name,
      orderDate: new Date().toISOString().split('T')[0],
      targetDeliveryDate: data.targetDeliveryDate,
      notes: data.notes,
    };

    setOrders([newOrder, ...orders]);
    saveRecord('orders', newOrder);
  };

  const handleAdvanceOrderStatus = (orderId: string, nextStatus: any, note: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    const updated: Order = {
      ...target,
      status: nextStatus,
      statusHistory: [
        ...target.statusHistory,
        {
          status: nextStatus,
          timestamp: new Date().toISOString(),
          note: note || `Status updated to ${nextStatus}`,
          updatedBy: 'Production Staff',
        },
      ],
    };
    setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
    saveRecord('orders', updated);
  };

  const handleGenerateMonthlyPayroll = () => {
    const newRecords: PayrollRecord[] = workers.map((w) => {
      const comm = (w.completedOrdersCount || 10) * w.commissionPerPiece;
      return {
        id: `pay-${Date.now()}-${w.id}`,
        workerId: w.id,
        workerName: w.name,
        workerRole: w.roleTitle,
        monthYear: 'October 2026',
        baseSalary: w.baseSalary,
        completedPieces: w.completedOrdersCount || 10,
        commissionAmount: comm,
        bonus: 250,
        deductions: 100,
        netPay: w.baseSalary + comm + 250 - 100,
        paymentStatus: 'paid',
        paidDate: new Date().toISOString().split('T')[0],
      };
    });

    setPayroll([...newRecords, ...payroll]);
    newRecords.forEach((rec) => saveRecord('payroll', rec));
    alert('✓ Monthly Payroll generated and calculated for all active staff!');
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  if (dataError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-2">
          <h1 className="text-xl font-bold text-red-600">Cannot connect to the database</h1>
          <p className="text-sm text-slate-600">{dataError}</p>
        </div>
      </div>
    );
  }

  if (!dataReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Loading data from the database…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex font-sans selection:bg-purple-200">
      {/* Left Fixed Sidebar */}
      <Sidebar
        activeRole={activeRole}
        activeSubTab={activeSubTab}
        onSelectSubTab={(tab) => setActiveSubTab(tab)}
        onSelectRole={(role) => setActiveRole(role)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenNewStudent={() => setShowStudentModal(true)}
        onOpenNewWorker={() => setShowWorkerModal(true)}
        onOpenNewOrder={() => setShowOrderModal(true)}
        onToggleClock={() => handleToggleClock(currentWorker.id)}
        isClockedIn={currentWorker.isClockedIn}
        stats={stats}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (Offset on Desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        {/* Top Navbar */}
        <Navbar
          activeRole={activeRole}
          onSelectRole={(role) => setActiveRole(role)}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          stats={stats}
        />

        {/* Main Portal Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* VIEW 1: OWNER DASHBOARD */}
          {activeRole === 'owner' && (
          <OwnerDashboard
            students={students}
            workers={workers}
            orders={orders}
            payroll={payroll}
            courses={courses}
            activeTab={activeSubTab}
            onTabChange={(tab) => setActiveSubTab(tab)}
            onOpenNewStudent={() => setShowStudentModal(true)}
            onOpenNewWorker={() => setShowWorkerModal(true)}
            onOpenNewOrder={() => setShowOrderModal(true)}
            onOpenNewCourse={() => setShowCourseModal(true)}
            onGeneratePayroll={handleGenerateMonthlyPayroll}
            onViewOrder={(order) => setSelectedOrderForView(order)}
            onUpdateStudent={handleUpdateStudent}
            onUpdateWorker={handleUpdateWorker}
            onUpdateOrder={handleUpdateOrder}
            onUpdateCourse={handleUpdateCourse}
          />
        )}

        {/* VIEW 3: ADMIN / RECEPTION */}
        {activeRole === 'admin' && (
          <AdminPortal
            students={students}
            workers={workers}
            orders={orders}
            courses={courses}
            attendance={attendance}
            users={users}
            activeTab={activeSubTab}
            onTabChange={(tab) => setActiveSubTab(tab)}
            onOpenNewStudent={() => setShowStudentModal(true)}
            onOpenNewWorker={() => setShowWorkerModal(true)}
            onOpenNewCourse={() => setShowCourseModal(true)}
            onOpenNewOrder={() => setShowOrderModal(true)}
            onMarkAttendance={(d) => handleMarkAttendance(d)}
            onUpdateOrderStatus={(id, st, note) => handleAdvanceOrderStatus(id, st, note)}
            onUpdateStudentFees={(id, amount) => {
              const target = students.find((s) => s.id === id);
              if (!target) return;
              const updated: Student = { ...target, paidFees: Math.min(target.totalFees, target.paidFees + amount) };
              setStudents(students.map((s) => (s.id === id ? updated : s)));
              saveRecord('students', updated);
            }}
            onResetPassword={handleResetUserPassword}
            onUpdateStudent={handleUpdateStudent}
            onUpdateWorker={handleUpdateWorker}
            onUpdateOrder={handleUpdateOrder}
            onUpdateCourse={handleUpdateCourse}
          />
        )}

        {/* VIEW 4: STUDENT PORTAL (Ama) */}
        {activeRole === 'student' && (
          <StudentPortal
            student={currentStudent}
            course={currentCourse}
            attendance={attendance}
            certificates={certificates}
            activeTab={activeSubTab}
            onTabChange={(tab) => setActiveSubTab(tab)}
            onMarkAttendance={(m) =>
              handleMarkAttendance({
                userId: currentStudent.userId,
                userName: currentStudent.name,
                userRole: 'student',
                status: 'present',
                method: m,
              })
            }
            onPayFee={(amount) => handlePayFee(amount)}
            onCompleteModule={handleCompleteStudentModule}
          />
        )}

        {/* VIEW 5: WORKER PORTAL (Akosua) */}
        {activeRole === 'worker' && (
          <WorkerPortal
            worker={currentWorker}
            assignedOrders={orders.filter((o) => o.assignedWorkerId === currentWorker.id || !o.assignedWorkerId)}
            attendance={attendance.filter((a) => a.userId === currentWorker.userId || a.userName === currentWorker.name)}
            payroll={payroll}
            leaveRequests={leaveRequests}
            activeTab={activeSubTab}
            onTabChange={(tab) => setActiveSubTab(tab)}
            onToggleClock={(id) => handleToggleClock(id)}
            onAdvanceOrderStage={(id, st, note) => handleAdvanceOrderStatus(id, st, note)}
            onSubmitLeave={(data) => {
              const leave: LeaveRequest = {
                id: `leave-${Date.now()}`,
                workerId: currentWorker.id,
                workerName: currentWorker.name,
                startDate: data.startDate,
                endDate: data.endDate,
                daysCount: data.daysCount,
                leaveType: data.leaveType,
                reason: data.reason,
                status: 'pending',
                submittedDate: new Date().toISOString().split('T')[0],
              };
              setLeaveRequests([leave, ...leaveRequests]);
              saveRecord('leaveRequests', leave);
            }}
          />
        )}

        {/* VIEW 6: CUSTOMER PORTAL */}
        {activeRole === 'customer' && (
          <CustomerPortal
            orders={orders}
            activeTab={activeSubTab}
            onTabChange={(tab) => setActiveSubTab(tab)}
            onCreateOrder={(d) => handleCreateCustomerOrder(d)}
            onMakePayment={(id, amt) => {
              const target = orders.find((o) => o.id === id);
              if (!target) return;
              const updated: Order = { ...target, paidAmount: Math.min(target.totalAmount, target.paidAmount + amt) };
              setOrders(orders.map((o) => (o.id === id ? updated : o)));
              saveRecord('orders', updated);
            }}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="bg-white border-t border-purple-100 py-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center text-center">
          <div className="text-gray-400">
            &copy; 2026 StitchFlow Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>

      {/* MODAL: REGISTER STUDENT WITH ASSIGNED PASSWORD */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in duration-200 border border-purple-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900 text-base">Provision New Student Account</h3>
              </div>
              <button onClick={() => setShowStudentModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Cynthia Kusi"
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address (Login Username)</label>
                <input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="cynthia.student@stitchflow.io"
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number (WhatsApp)</label>
                <input
                  type="text"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  placeholder="+233 24 555 0199"
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Program / Course</label>
                <select
                  value={newStudentCourseId}
                  onChange={(e) => setNewStudentCourseId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} (GH₵ {c.fee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-purple-900 block">Assigned Initial Login Password</label>
                  <button
                    type="button"
                    onClick={() => setNewStudentPassword(`STF-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-[10px] text-purple-700 font-bold underline"
                  >
                    Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  className="w-full p-2 bg-white border border-purple-200 rounded-lg font-mono font-bold text-purple-900"
                  required
                />
                <p className="text-[10px] text-gray-500">This password will be given to the student for logging into the Student Hub.</p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Provision &amp; Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD WORKER WITH ASSIGNED PASSWORD */}
      {showWorkerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in duration-200 border border-amber-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-gray-900 text-base">Provision New Tailor / Staff Account</h3>
              </div>
              <button onClick={() => setShowWorkerModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorker} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Staff Full Name</label>
                <input
                  type="text"
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  placeholder="e.g. Samuel Okyere"
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email (Login Username)</label>
                <input
                  type="email"
                  value={newWorkerEmail}
                  onChange={(e) => setNewWorkerEmail(e.target.value)}
                  placeholder="samuel.tailor@stitchflow.io"
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Role Title &amp; Specialization</label>
                <input
                  type="text"
                  value={newWorkerRoleTitle}
                  onChange={(e) => setNewWorkerRoleTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Base Salary (GH₵)</label>
                  <input
                    type="number"
                    value={newWorkerBaseSalary}
                    onChange={(e) => setNewWorkerBaseSalary(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Commission/Piece (GH₵)</label>
                  <input
                    type="number"
                    value={newWorkerCommission}
                    onChange={(e) => setNewWorkerCommission(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-amber-900 block">Assigned Initial Login Password</label>
                  <button
                    type="button"
                    onClick={() => setNewWorkerPassword(`STF-WRK-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-[10px] text-amber-700 font-bold underline"
                  >
                    Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  value={newWorkerPassword}
                  onChange={(e) => setNewWorkerPassword(e.target.value)}
                  className="w-full p-2 bg-white border border-amber-200 rounded-lg font-mono font-bold text-amber-900"
                  required
                />
                <p className="text-[10px] text-gray-500">Provide this password to the tailor for logging in to the Shift Terminal.</p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWorkerModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold"
                >
                  Provision Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREDENTIALS HANDOVER SLIP MODAL */}
      {credentialSlip && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in duration-200 border-2 border-purple-300 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Account Successfully Provisioned
              </span>
              <h3 className="text-xl font-black text-gray-900 mt-2">Login Credentials Handover</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Hand these login details to {credentialSlip.name} to sign in at <strong className="text-purple-900">localhost:3000/login</strong>
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-purple-100">
                <span className="text-gray-500">Account Name:</span>
                <span className="font-bold text-gray-900">{credentialSlip.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-100">
                <span className="text-gray-500">Role Profile:</span>
                <span className="font-bold text-purple-900">{credentialSlip.role}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-100">
                <span className="text-gray-500">Login Username / Email:</span>
                <span className="font-mono font-bold text-gray-900">{credentialSlip.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-100">
                <span className="text-gray-500">Assigned Password:</span>
                <span className="font-mono font-black text-purple-900 text-sm bg-purple-100 px-2 py-0.5 rounded">
                  {credentialSlip.password}
                </span>
              </div>
              {credentialSlip.pin && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Attendance PIN Code:</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {credentialSlip.pin}
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  const text = `StitchFlow Credentials for ${credentialSlip.name}\nRole: ${credentialSlip.role}\nEmail: ${credentialSlip.email}\nPassword: ${credentialSlip.password}\nLogin at: http://localhost:3000/login`;
                  navigator.clipboard.writeText(text);
                  setCopiedSlip(true);
                  setTimeout(() => setCopiedSlip(false), 3000);
                }}
                className="flex-1 py-3 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedSlip ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-purple-600" />}
                <span>{copiedSlip ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
              </button>

              <button
                onClick={() => setCredentialSlip(null)}
                className="flex-1 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Done / Handed Over
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD COURSE CURRICULA */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in zoom-in duration-200 border border-indigo-100 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Add New Academy Course Curricula</h3>
                  <p className="text-xs text-gray-500">Define syllabus, duration, modules and tuition fee</p>
                </div>
              </div>
              <button onClick={() => setShowCourseModal(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Masterclass in Bridal & Haute Couture"
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="e.g. STF-BRD-301"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Syllabus Level</label>
                  <select
                    value={newCourseLevel}
                    onChange={(e) => setNewCourseLevel(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Masterclass">Masterclass</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    value={newCourseDuration}
                    onChange={(e) => setNewCourseDuration(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tuition Fee (GH₵)</label>
                  <input
                    type="number"
                    value={newCourseFee}
                    onChange={(e) => setNewCourseFee(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-indigo-950"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Lead Instructor</label>
                  <input
                    type="text"
                    value={newCourseInstructor}
                    onChange={(e) => setNewCourseInstructor(e.target.value)}
                    placeholder="e.g. Madame Evelyn Osei"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Class Schedule</label>
                  <input
                    type="text"
                    value={newCourseSchedule}
                    onChange={(e) => setNewCourseSchedule(e.target.value)}
                    placeholder="e.g. Tue & Thu (10am - 2pm)"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Course Description</label>
                <textarea
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Overview of syllabus, learning outcomes and techniques covered..."
                  rows={2}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Curriculum Modules (One per line)</label>
                <textarea
                  value={newCourseModules}
                  onChange={(e) => setNewCourseModules(e.target.value)}
                  placeholder="1. Introduction&#10;2. Body Measurements&#10;3. Pattern Drafting"
                  rows={3}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 transition-all"
                >
                  Create Course Curricula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD BESPOKE ORDER INTAKE */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in zoom-in duration-200 border border-rose-100 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Create Bespoke Order &amp; Workshop Dispatch</h3>
                  <p className="text-xs text-gray-500">Customer measurements, garment style, fabrics and artisan assignment</p>
                </div>
              </div>
              <button onClick={() => setShowOrderModal(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    value={newOrderCustomerName}
                    onChange={(e) => setNewOrderCustomerName(e.target.value)}
                    placeholder="e.g. Nana Yaa Osei"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number (WhatsApp)</label>
                  <input
                    type="text"
                    value={newOrderCustomerPhone}
                    onChange={(e) => setNewOrderCustomerPhone(e.target.value)}
                    placeholder="+233 24 555 0199"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Garment Style / Title</label>
                  <input
                    type="text"
                    value={newOrderGarmentName}
                    onChange={(e) => setNewOrderGarmentName(e.target.value)}
                    placeholder="e.g. 6-Piece Royal Kente Agbada / Evening Gown"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newOrderCategory}
                    onChange={(e: any) => setNewOrderCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
                  >
                    <option value="Bridal / Evening">Bridal / Evening Wear</option>
                    <option value="Traditional Kente / Agbada">Traditional Kente / Agbada</option>
                    <option value="Casual / Ready-to-Wear">Casual / Ready-to-Wear</option>
                    <option value="Corporate Suit">Corporate Suit / Blazer</option>
                    <option value="Alteration">Garment Alteration</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Fabric Specifications</label>
                  <input
                    type="text"
                    value={newOrderFabric}
                    onChange={(e) => setNewOrderFabric(e.target.value)}
                    placeholder="e.g. 100% Cotton Velvet + Gold Thread Silk"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Assign Head Tailor / Artisan</label>
                  <select
                    value={newOrderWorkerId}
                    onChange={(e) => setNewOrderWorkerId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold text-amber-950"
                  >
                    <option value="">Auto-Assign / Unassigned</option>
                    {workers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.roleTitle} - {w.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client Measurements Grid */}
              <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-rose-950 text-xs">
                  <Ruler className="w-3.5 h-3.5 text-rose-600" />
                  <span>Client Body Measurements (Inches)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold">Bust/Chest</label>
                    <input
                      type="number"
                      value={newOrderBust}
                      onChange={(e) => setNewOrderBust(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold">Waist</label>
                    <input
                      type="number"
                      value={newOrderWaist}
                      onChange={(e) => setNewOrderWaist(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold">Hips</label>
                    <input
                      type="number"
                      value={newOrderHips}
                      onChange={(e) => setNewOrderHips(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold">Shoulder</label>
                    <input
                      type="number"
                      value={newOrderShoulder}
                      onChange={(e) => setNewOrderShoulder(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold">Full Length</label>
                    <input
                      type="number"
                      value={newOrderLength}
                      onChange={(e) => setNewOrderLength(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Total Bill (GH₵)</label>
                  <input
                    type="number"
                    value={newOrderTotalAmount}
                    onChange={(e) => setNewOrderTotalAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Deposit Paid (GH₵)</label>
                  <input
                    type="number"
                    value={newOrderPaidAmount}
                    onChange={(e) => setNewOrderPaidAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    value={newOrderTargetDate}
                    onChange={(e) => setNewOrderTargetDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Fit &amp; Finishing Instructions</label>
                <textarea
                  rows={2}
                  value={newOrderNotes}
                  onChange={(e) => setNewOrderNotes(e.target.value)}
                  placeholder="Special instructions, lining preferences, embroidery style..."
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-600/20 transition-all"
                >
                  Create &amp; Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccessRole={(role) => setActiveRole(role)}
      />
    </div>
  );
}
