import {
  User, Student, Worker, Course, Order, AttendanceRecord,
  PayrollRecord, LeaveRequest, Certificate, OrderStatus, MeasurementData, OrderItem
} from './types';
import {
  INITIAL_USERS, INITIAL_STUDENTS, INITIAL_WORKERS, INITIAL_COURSES,
  INITIAL_ORDERS, INITIAL_ATTENDANCE, INITIAL_PAYROLL, INITIAL_LEAVE_REQUESTS, INITIAL_CERTIFICATES
} from './seed-data';
import { connectToDatabase } from './mongodb';
import * as Models from '../models';

/** Collections exposed to the UI. Backed by MongoDB. */
const COLLECTIONS = {
  users: Models.User,
  students: Models.Student,
  workers: Models.Worker,
  courses: Models.Course,
  orders: Models.Order,
  attendance: Models.Attendance,
  payroll: Models.Payroll,
  leaveRequests: Models.LeaveRequest,
  certificates: Models.Certificate,
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
export const COLLECTION_NAMES = Object.keys(COLLECTIONS) as CollectionName[];

/** Starter data inserted once into a collection that is completely empty. */
const SEED_DATA: Record<CollectionName, { id: string }[]> = {
  users: INITIAL_USERS,
  students: INITIAL_STUDENTS,
  workers: INITIAL_WORKERS,
  courses: INITIAL_COURSES,
  orders: INITIAL_ORDERS,
  attendance: INITIAL_ATTENDANCE,
  payroll: INITIAL_PAYROLL,
  leaveRequests: INITIAL_LEAVE_REQUESTS,
  certificates: INITIAL_CERTIFICATES,
};

declare global {
  // eslint-disable-next-line no-var
  var __stitchflow_seed: Promise<void> | undefined;
}

async function seedIfEmpty(): Promise<void> {
  for (const name of COLLECTION_NAMES) {
    const model = COLLECTIONS[name];
    if ((await model.estimatedDocumentCount()) === 0) {
      // Inserted oldest-last so that "newest first" (_id desc) matches the seed order.
      await model.insertMany([...SEED_DATA[name]].reverse(), { ordered: false }).catch(() => undefined);
    }
  }
}

/** Ensures a live MongoDB connection and that starter data exists. */
async function ready(): Promise<void> {
  await connectToDatabase();
  if (!global.__stitchflow_seed) {
    global.__stitchflow_seed = seedIfEmpty().catch((e) => {
      global.__stitchflow_seed = undefined;
      throw e;
    });
  }
  await global.__stitchflow_seed;
}

function clean<T>(doc: unknown): T {
  const { _id, ...rest } = doc as Record<string, unknown>;
  void _id;
  return rest as T;
}

async function all<T>(name: CollectionName): Promise<T[]> {
  await ready();
  const docs = await COLLECTIONS[name].find().sort({ _id: -1 }).lean();
  return docs.map((d) => clean<T>(d));
}

async function findOne<T>(name: CollectionName, filter: Record<string, unknown>): Promise<T | null> {
  await ready();
  const doc = await COLLECTIONS[name].findOne(filter).lean();
  return doc ? clean<T>(doc) : null;
}

async function count(name: CollectionName): Promise<number> {
  await ready();
  return COLLECTIONS[name].countDocuments();
}

/** Insert or replace a document by its app-level `id`. */
async function save<T extends { id: string }>(name: CollectionName, doc: T): Promise<T> {
  await ready();
  await COLLECTIONS[name].updateOne({ id: doc.id }, { $set: { ...doc } }, { upsert: true });
  return doc;
}

const byAnyId = (id: string, alt: string) => ({ $or: [{ id }, { [alt]: id }] });

export const DbService = {
  // --- GENERIC (used by the UI to persist its records) ---
  async bootstrap() {
    await ready();
    const entries = await Promise.all(
      COLLECTION_NAMES.map(async (name) => [name, await all<unknown>(name)] as const)
    );
    return Object.fromEntries(entries) as Record<CollectionName, unknown[]>;
  },

  async saveRecord(collection: CollectionName, doc: { id: string }) {
    return save(collection, doc);
  },

  // --- USERS / AUTH ---
  async getUserByEmail(email: string): Promise<User | null> {
    return findOne<User>('users', { email: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
  },

  async getUserByRole(role: string): Promise<User | null> {
    return findOne<User>('users', { role });
  },

  async createUser(user: User): Promise<User> {
    return save('users', user);
  },

  // --- STUDENTS ---
  async getStudents(): Promise<Student[]> {
    return all<Student>('students');
  },

  async getStudentById(id: string): Promise<Student | null> {
    return findOne<Student>('students', byAnyId(id, 'studentId'));
  },

  async createStudent(data: Omit<Student, 'id' | 'studentId' | 'attendancePercentage' | 'progressPercentage' | 'completedModules'>): Promise<Student> {
    const studentCount = (await count('students')) + 1;
    const year = new Date().getFullYear();
    const studentId = `STF-${year}-${String(studentCount).padStart(4, '0')}`;
    const newStudent: Student = {
      ...data,
      id: `student-${Date.now()}`,
      studentId,
      attendancePercentage: 100,
      progressPercentage: 0,
      completedModules: 0,
      totalModules: data.totalModules || 8,
    };
    return save('students', newStudent);
  },

  async updateStudentFeePayment(studentId: string, amount: number): Promise<Student | null> {
    const student = await this.getStudentById(studentId);
    if (!student) return null;
    student.paidFees = Math.min(student.totalFees, student.paidFees + amount);
    return save('students', student);
  },

  async updateStudentProgress(studentId: string, completedModules: number): Promise<Student | null> {
    const student = await this.getStudentById(studentId);
    if (!student) return null;
    student.completedModules = completedModules;
    student.progressPercentage = Math.round((completedModules / student.totalModules) * 100);
    if (student.progressPercentage >= 100 && student.status !== 'graduated') {
      student.status = 'graduated';
    }
    return save('students', student);
  },

  // --- WORKERS ---
  async getWorkers(): Promise<Worker[]> {
    return all<Worker>('workers');
  },

  async getWorkerById(id: string): Promise<Worker | null> {
    return findOne<Worker>('workers', byAnyId(id, 'workerId'));
  },

  async createWorker(data: Omit<Worker, 'id' | 'workerId' | 'isClockedIn' | 'completedOrdersCount' | 'rating'>): Promise<Worker> {
    const workerCount = (await count('workers')) + 1;
    const workerId = `STF-WRK-${String(workerCount).padStart(3, '0')}`;
    const newWorker: Worker = {
      ...data,
      id: `worker-${Date.now()}`,
      workerId,
      isClockedIn: false,
      completedOrdersCount: 0,
      rating: 5.0,
    };
    return save('workers', newWorker);
  },

  async toggleWorkerClock(workerId: string, deviceId?: string): Promise<{ worker: Worker; isClockedIn: boolean; timestamp: string }> {
    const worker = await this.getWorkerById(workerId);
    if (!worker) throw new Error('Worker not found');

    // Enforce one clock-in per day: a worker who already started a shift today cannot start another.
    if (!worker.isClockedIn && worker.lastClockIn) {
      const sameDay = new Date(worker.lastClockIn).toDateString() === new Date().toDateString();
      if (sameDay) throw new Error('ALREADY_CLOCKED_IN_TODAY');
    }

    // Enforce one worker per device per day (prevents clocking in for colleagues from the same device).
    if (!worker.isClockedIn && deviceId) {
      const key = `${new Date().toDateString()}::${deviceId}`;
      const existing = await Models.ClockDevice.findOne({ key }).lean();
      if (existing && existing.workerId !== worker.id) throw new Error('DEVICE_ALREADY_USED_TODAY');
      if (!existing) await Models.ClockDevice.create({ key, workerId: worker.id });
    }

    const now = new Date().toISOString();
    worker.isClockedIn = !worker.isClockedIn;
    if (worker.isClockedIn) {
      worker.lastClockIn = now;
      await save('attendance', {
        id: `att-${Date.now()}`,
        userId: worker.userId,
        userName: worker.name,
        userRole: 'worker',
        date: new Date().toISOString().split('T')[0],
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        method: 'PIN',
        status: 'present',
      } satisfies AttendanceRecord);
    } else {
      worker.lastClockOut = now;
    }
    await save('workers', worker);
    return { worker: { ...worker }, isClockedIn: worker.isClockedIn, timestamp: now };
  },

  // --- COURSES ---
  async getCourses(): Promise<Course[]> {
    return all<Course>('courses');
  },

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    return all<Order>('orders');
  },

  async getOrderById(id: string): Promise<Order | null> {
    return findOne<Order>('orders', byAnyId(id, 'orderNumber'));
  },

  async createOrder(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: OrderItem[];
    measurements: MeasurementData;
    targetDeliveryDate: string;
    notes?: string;
    assignedWorkerId?: string;
    depositAmount?: number;
  }): Promise<Order> {
    const orderCount = (await count('orders')) + 8820;
    const orderNumber = `ORD-2026-${orderCount}`;
    const totalAmount = data.items.reduce((sum, item) => sum + item.unitPrice, 0);
    const paidAmount = data.depositAmount || 0;
    const paymentStatus = paidAmount >= totalAmount ? 'paid' : paidAmount > 0 ? 'partially_paid' : 'pending';

    let assignedWorkerName: string | undefined;
    if (data.assignedWorkerId) {
      const w = await this.getWorkerById(data.assignedWorkerId);
      if (w) assignedWorkerName = w.name;
    }

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
          note: 'Order intake submitted online with initial specifications.',
          updatedBy: 'Client Portal',
        },
      ],
      totalAmount,
      paidAmount,
      paymentStatus,
      assignedWorkerId: data.assignedWorkerId,
      assignedWorkerName,
      orderDate: new Date().toISOString().split('T')[0],
      targetDeliveryDate: data.targetDeliveryDate,
      notes: data.notes,
    };

    return save('orders', newOrder);
  },

  async updateOrderStatus(orderId: string, nextStatus: OrderStatus, note: string, updatedBy: string): Promise<Order | null> {
    const order = await this.getOrderById(orderId);
    if (!order) return null;

    order.status = nextStatus;
    order.statusHistory.push({
      status: nextStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${nextStatus}`,
      updatedBy,
    });

    if (nextStatus === 'ready' && order.assignedWorkerId) {
      const worker = await this.getWorkerById(order.assignedWorkerId);
      if (worker) {
        worker.completedOrdersCount += 1;
        await save('workers', worker);
      }
    }

    return save('orders', order);
  },

  async updateOrderPayment(orderId: string, amount: number): Promise<Order | null> {
    const order = await this.getOrderById(orderId);
    if (!order) return null;

    order.paidAmount = Math.min(order.totalAmount, order.paidAmount + amount);
    if (order.paidAmount >= order.totalAmount) {
      order.paymentStatus = 'paid';
    } else if (order.paidAmount > 0) {
      order.paymentStatus = 'partially_paid';
    }
    return save('orders', order);
  },

  // --- ATTENDANCE ---
  async getAttendance(): Promise<AttendanceRecord[]> {
    return all<AttendanceRecord>('attendance');
  },

  async markAttendance(data: Omit<AttendanceRecord, 'id' | 'checkInTime'> & { checkInTime?: string }): Promise<AttendanceRecord> {
    const record: AttendanceRecord = {
      ...data,
      id: `att-${Date.now()}`,
      checkInTime: data.checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    return save('attendance', record);
  },

  // --- PAYROLL ---
  async getPayroll(): Promise<PayrollRecord[]> {
    return all<PayrollRecord>('payroll');
  },

  async generatePayrollForWorker(workerId: string, monthYear: string, bonus: number = 0, deductions: number = 0): Promise<PayrollRecord> {
    const worker = await this.getWorkerById(workerId);
    if (!worker) throw new Error('Worker not found');

    const completedPieces = worker.completedOrdersCount || 8;
    const commissionAmount = completedPieces * worker.commissionPerPiece;
    const netPay = worker.baseSalary + commissionAmount + bonus - deductions;

    const record: PayrollRecord = {
      id: `pay-${Date.now()}`,
      workerId: worker.id,
      workerName: worker.name,
      workerRole: worker.roleTitle,
      monthYear,
      baseSalary: worker.baseSalary,
      completedPieces,
      commissionAmount,
      bonus,
      deductions,
      netPay,
      paymentStatus: 'paid',
      paidDate: new Date().toISOString().split('T')[0],
    };

    return save('payroll', record);
  },

  // --- LEAVE REQUESTS ---
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return all<LeaveRequest>('leaveRequests');
  },

  async createLeaveRequest(data: Omit<LeaveRequest, 'id' | 'status' | 'submittedDate'>): Promise<LeaveRequest> {
    const newLeave: LeaveRequest = {
      ...data,
      id: `leave-${Date.now()}`,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
    };
    return save('leaveRequests', newLeave);
  },

  async updateLeaveStatus(leaveId: string, status: 'approved' | 'rejected'): Promise<LeaveRequest | null> {
    const req = await findOne<LeaveRequest>('leaveRequests', { id: leaveId });
    if (!req) return null;
    req.status = status;
    return save('leaveRequests', req);
  },

  // --- CERTIFICATES ---
  async getCertificates(): Promise<Certificate[]> {
    return all<Certificate>('certificates');
  },

  async issueCertificate(studentId: string, grade: 'Distinction' | 'Honors' | 'Merit' | 'Pass'): Promise<Certificate> {
    const student = await this.getStudentById(studentId);
    if (!student) throw new Error('Student not found');

    const certNum = `STF-CERT-${new Date().getFullYear()}-${student.studentId.replace('STF-', '')}`;
    const cert: Certificate = {
      id: certNum,
      certificateNumber: certNum,
      studentId: student.studentId,
      studentName: student.name,
      courseTitle: student.courseTitle,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      grade,
      issuerName: 'Madame Evelyn Osei',
      issuerTitle: 'Founder & Head of Academy, StitchFlow Fashion Institute',
      qrVerificationUrl: `https://stitchflow.io/verify/${certNum}`,
    };

    student.certificateId = certNum;
    student.status = 'graduated';
    student.progressPercentage = 100;
    student.completedModules = student.totalModules;

    await save('students', student);
    return save('certificates', cert);
  },

  // --- SYSTEM STATS ---
  async getSystemStats() {
    const [students, workers, orders] = await Promise.all([
      this.getStudents(),
      this.getWorkers(),
      this.getOrders(),
    ]);
    const activeWorkers = workers.filter((w) => w.isClockedIn).length;
    const inProgressOrders = orders.filter((o) => o.status !== 'delivered').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.paidAmount, 0) + students.reduce((sum, s) => sum + s.paidFees, 0);

    return {
      totalStudents: students.length,
      activeWorkers,
      totalWorkers: workers.length,
      inProgressOrders,
      totalRevenue,
      currency: 'GH₵',
    };
  },
};
