import { User, Worker, AttendanceRecord, Role } from './types';
import {
  INITIAL_USERS, INITIAL_STUDENTS, INITIAL_WORKERS, INITIAL_COURSES,
  INITIAL_ORDERS, INITIAL_ATTENDANCE, INITIAL_PAYROLL, INITIAL_LEAVE_REQUESTS, INITIAL_CERTIFICATES
} from './seed-data';
import { connectToDatabase } from './mongodb';
import { hashPassword, isPasswordHash } from './auth';
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

type Doc = Record<string, unknown>;

async function seedIfEmpty(): Promise<void> {
  for (const name of COLLECTION_NAMES) {
    const model = COLLECTIONS[name];
    if ((await model.estimatedDocumentCount()) === 0) {
      let docs: Doc[] = [...SEED_DATA[name]];
      if (name === 'users') {
        docs = await Promise.all(
          docs.map(async (u) => ({
            ...u,
            password: await hashPassword(process.env.SEED_USER_PASSWORD || String(u.password ?? '')),
          }))
        );
      }
      // Inserted oldest-last so that "newest first" (_id desc) matches the seed order.
      await model.insertMany(docs.reverse(), { ordered: false }).catch(() => undefined);
    }
  }
}

/** Replaces any legacy plaintext passwords with bcrypt hashes. */
async function hashLegacyPasswords(): Promise<void> {
  const legacy = await Models.User.find({
    password: { $type: 'string', $not: /^\$2[aby]\$\d{2}\$/ },
  }).lean();
  for (const u of legacy) {
    const plain = String((u as Doc).password ?? '');
    await Models.User.updateOne({ id: (u as Doc).id }, { $set: { password: await hashPassword(plain) } });
  }
}

/** Ensures a live MongoDB connection, starter data, and hashed credentials. */
async function ready(): Promise<void> {
  await connectToDatabase();
  if (!global.__stitchflow_seed) {
    global.__stitchflow_seed = seedIfEmpty()
      .then(hashLegacyPasswords)
      .catch((e) => {
        global.__stitchflow_seed = undefined;
        throw e;
      });
  }
  await global.__stitchflow_seed;
}

function clean<T>(doc: unknown): T {
  const { _id, ...rest } = doc as Doc;
  void _id;
  return rest as T;
}

function publicUser<T>(doc: unknown): T {
  const { password, ...rest } = clean<Doc>(doc);
  void password;
  return rest as T;
}

async function all<T>(name: CollectionName): Promise<T[]> {
  await ready();
  const docs = await COLLECTIONS[name].find().sort({ _id: -1 }).lean();
  return docs.map((d) => clean<T>(d));
}

async function findOne<T>(name: CollectionName, filter: Doc): Promise<T | null> {
  await ready();
  const doc = await COLLECTIONS[name].findOne(filter).lean();
  return doc ? clean<T>(doc) : null;
}

/** Insert or update a document by its app-level `id`. */
async function save<T extends { id: string }>(name: CollectionName, doc: T): Promise<T> {
  await ready();
  await COLLECTIONS[name].updateOne({ id: doc.id }, { $set: { ...doc } }, { upsert: true });
  return doc;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export interface Viewer {
  userId: string;
  email: string;
  role: Role;
}

export const DbService = {
  // --- RECORDS ---

  /** Returns only the data the signed-in user is allowed to see. Passwords are never included. */
  async bootstrapFor(viewer: Viewer) {
    await ready();
    const [users, students, workers, courses, orders, attendance, payroll, leaveRequests, certificates] =
      await Promise.all([
        all<Doc>('users'), all<Doc>('students'), all<Doc>('workers'), all<Doc>('courses'),
        all<Doc>('orders'), all<Doc>('attendance'), all<Doc>('payroll'),
        all<Doc>('leaveRequests'), all<Doc>('certificates'),
      ]);

    const safeUsers = users.map((u) => publicUser<Doc>(u));

    if (viewer.role === 'owner' || viewer.role === 'admin') {
      return { users: safeUsers, students, workers, courses, orders, attendance, payroll, leaveRequests, certificates };
    }

    const email = viewer.email.toLowerCase();

    if (viewer.role === 'worker') {
      const me = workers.filter((w) => w.userId === viewer.userId);
      const myIds = new Set(me.map((w) => w.id));
      return {
        users: [], students: [], workers: me, courses, orders,
        attendance: attendance.filter((a) => a.userId === viewer.userId),
        payroll: payroll.filter((p) => myIds.has(p.workerId)),
        leaveRequests: leaveRequests.filter((l) => myIds.has(l.workerId)),
        certificates: [],
      };
    }

    if (viewer.role === 'student') {
      const me = students.filter((s) => s.userId === viewer.userId);
      const studentNumbers = new Set(me.map((s) => s.studentId));
      return {
        users: [], students: me, workers: [], courses, orders: [],
        attendance: attendance.filter((a) => a.userId === viewer.userId),
        payroll: [], leaveRequests: [],
        certificates: certificates.filter((c) => studentNumbers.has(c.studentId)),
      };
    }

    // customer
    return {
      users: [], students: [], workers: [], courses,
      orders: orders.filter((o) => String(o.customerEmail ?? '').toLowerCase() === email),
      attendance: [], payroll: [], leaveRequests: [], certificates: [],
    };
  },

  async findRecord(collection: CollectionName, id: string): Promise<Doc | null> {
    return findOne<Doc>(collection, { id });
  },

  /** Saves a record. Passwords are always stored as bcrypt hashes; a blank password keeps the existing one. */
  async saveRecord(collection: CollectionName, doc: { id: string } & Doc) {
    if (collection === 'users') {
      const next: Doc = { ...doc };
      if (typeof next.password === 'string' && next.password.length > 0) {
        if (!isPasswordHash(next.password)) next.password = await hashPassword(next.password);
      } else {
        delete next.password;
      }
      await save('users', next as { id: string });
      return publicUser<Doc>(next);
    }
    return save(collection, doc);
  },

  // --- USERS / AUTH ---
  async getUserByEmail(email: string): Promise<User | null> {
    return findOne<User>('users', { email: { $regex: `^${escapeRegex(email.trim())}$`, $options: 'i' } });
  },

  async getUserById(id: string): Promise<User | null> {
    return findOne<User>('users', { id });
  },

  async createUser(user: User): Promise<void> {
    await this.saveRecord('users', user as unknown as { id: string } & Doc);
  },

  // --- WORKERS / ATTENDANCE ---
  async getWorkerById(id: string): Promise<Worker | null> {
    return findOne<Worker>('workers', { $or: [{ id }, { workerId: id }] });
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

  /** Attendance visible to the viewer: everything for staff, only their own otherwise. */
  async attendanceFor(viewer: Viewer): Promise<AttendanceRecord[]> {
    const records = await all<AttendanceRecord>('attendance');
    if (viewer.role === 'owner' || viewer.role === 'admin') return records;
    return records.filter((a) => a.userId === viewer.userId);
  },
};
