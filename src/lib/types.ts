export type Role = 'owner' | 'admin' | 'student' | 'worker' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  phone?: string;
  status: 'active' | 'inactive';
  password?: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  durationWeeks: number;
  totalModules: number;
  fee: number;
  instructor: string;
  schedule: string;
  level: 'Beginner' | 'Intermediate' | 'Masterclass';
  modules: string[];
}

export interface Student {
  id: string;
  userId: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  courseId: string;
  courseTitle: string;
  enrollmentDate: string;
  expectedGraduation: string;
  status: 'enrolled' | 'graduated' | 'suspended';
  totalFees: number;
  paidFees: number;
  attendancePercentage: number;
  progressPercentage: number;
  completedModules: number;
  totalModules: number;
  pin: string;
  certificateId?: string;
}

export interface Worker {
  id: string;
  userId: string;
  workerId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  roleTitle: string; // e.g., "Master Tailor", "Pattern Cutter", "Embroidery Specialist"
  specialization: string;
  baseSalary: number;
  commissionPerPiece: number;
  isClockedIn: boolean;
  lastClockIn?: string;
  lastClockOut?: string;
  completedOrdersCount: number;
  rating: number;
  joinDate: string;
}

export interface MeasurementData {
  unit: 'inches' | 'cm';
  bust?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  chest?: number;
  armLength?: number;
  inseam?: number;
  neck?: number;
  thigh?: number;
  fullLength?: number;
  notes?: string;
}

export type OrderStatus = 'received' | 'designing' | 'sewing' | 'finishing' | 'ready' | 'delivered';

export interface OrderItem {
  id: string;
  garmentName: string;
  category: 'Bridal / Evening' | 'Traditional Kente / Agbada' | 'Casual / Ready-to-Wear' | 'Corporate Suit' | 'Alteration';
  fabricType: string;
  fabricProvidedBy: 'customer' | 'shop';
  designReferenceUrl?: string;
  notes?: string;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  measurements: MeasurementData;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
    updatedBy: string;
  }[];
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'pending' | 'partially_paid' | 'paid';
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  orderDate: string;
  targetDeliveryDate: string;
  completedDate?: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'worker';
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  method: 'QR_SCAN' | 'PIN' | 'MANUAL_OVERRIDE';
  status: 'present' | 'late' | 'half-day' | 'excused';
}

export interface PayrollRecord {
  id: string;
  workerId: string;
  workerName: string;
  workerRole: string;
  monthYear: string;
  baseSalary: number;
  completedPieces: number;
  commissionAmount: number;
  bonus: number;
  deductions: number;
  netPay: number;
  paymentStatus: 'draft' | 'approved' | 'paid';
  paidDate?: string;
}

export interface LeaveRequest {
  id: string;
  workerId: string;
  workerName: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  leaveType: 'Sick' | 'Annual' | 'Compassionate' | 'Maternity/Paternity';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  grade: 'Distinction' | 'Honors' | 'Merit' | 'Pass';
  issuerName: string;
  issuerTitle: string;
  qrVerificationUrl: string;
}
