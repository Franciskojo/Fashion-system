import { AuthSession } from './auth';
import { CollectionName, DbService } from './db-service';
import { Role } from './types';

type Doc = Record<string, unknown>;
type Decision = { ok: true; doc: Doc } | { ok: false; status: number; error: string };

const STAFF: Role[] = ['owner', 'admin'];
const ALL_ROLES: Role[] = ['owner', 'admin', 'student', 'worker', 'customer'];
const PRIVILEGED: Role[] = ['owner', 'admin'];
export const MIN_PASSWORD_LENGTH = 8;

const deny = (error = 'You do not have permission to change this record.', status = 403): Decision => ({
  ok: false,
  status,
  error,
});
const allow = (doc: Doc): Decision => ({ ok: true, doc });

const num = (v: unknown, fallback = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);

/**
 * Decides whether `session` may write `doc` into `collection`, and returns the
 * (possibly narrowed) document that is safe to store. Staff can manage everything
 * except privileged accounts; everyone else is limited to their own data.
 */
export async function authorizeWrite(session: AuthSession, collection: CollectionName, doc: Doc & { id: string }): Promise<Decision> {
  const existing = await DbService.findRecord(collection, doc.id);

  // ---------- Staff (owner / admin) ----------
  if (STAFF.includes(session.role)) {
    if (collection !== 'users') return allow(doc);

    if (!ALL_ROLES.includes(doc.role as Role)) return deny('A valid role is required.', 400);
    if (session.role !== 'owner') {
      if (PRIVILEGED.includes(doc.role as Role) || (existing && PRIVILEGED.includes(existing.role as Role))) {
        return deny('Only the owner can manage owner and admin accounts.');
      }
    }
    if (typeof doc.password === 'string' && doc.password.length > 0 && doc.password.length < MIN_PASSWORD_LENGTH) {
      return deny(`Passwords must be at least ${MIN_PASSWORD_LENGTH} characters.`, 400);
    }
    if (!existing && (typeof doc.password !== 'string' || doc.password.length < MIN_PASSWORD_LENGTH)) {
      return deny(`A password of at least ${MIN_PASSWORD_LENGTH} characters is required.`, 400);
    }
    return allow(doc);
  }

  // ---------- Everyone else: own data only ----------
  switch (collection) {
    case 'orders': {
      if (session.role === 'worker') {
        if (!existing) return deny();
        if (typeof doc.status !== 'string' || !Array.isArray(doc.statusHistory)) return deny('Invalid order update.', 400);
        return allow({ ...existing, status: doc.status, statusHistory: doc.statusHistory });
      }
      if (session.role === 'customer') {
        const mine = (e: Doc) => String(e.customerEmail ?? '').toLowerCase() === session.email.toLowerCase();
        if (existing) {
          if (!mine(existing)) return deny();
          const total = num(existing.totalAmount);
          const paid = Math.min(total, Math.max(num(existing.paidAmount), num(doc.paidAmount, num(existing.paidAmount))));
          return allow({ ...existing, paidAmount: paid });
        }
        return allow({ ...doc, customerEmail: session.email, status: 'received' });
      }
      return deny();
    }

    case 'attendance': {
      if (session.role !== 'worker' && session.role !== 'student') return deny();
      if (doc.userId !== session.userId) return deny();
      if (existing && existing.userId !== session.userId) return deny();
      return allow({ ...doc, userRole: session.role });
    }

    case 'students': {
      if (session.role !== 'student' || !existing || existing.userId !== session.userId) return deny();
      const totalFees = num(existing.totalFees);
      const totalModules = num(existing.totalModules);
      const paidFees = Math.min(totalFees, Math.max(num(existing.paidFees), num(doc.paidFees, num(existing.paidFees))));
      const completed = Math.min(totalModules, Math.max(num(existing.completedModules), num(doc.completedModules, num(existing.completedModules))));
      const progress = totalModules > 0 ? Math.round((completed / totalModules) * 100) : num(existing.progressPercentage);
      const graduated = progress >= 100 ? 'graduated' : existing.status;
      return allow({ ...existing, paidFees, completedModules: completed, progressPercentage: progress, status: graduated });
    }

    case 'leaveRequests': {
      if (session.role !== 'worker' || existing) return deny();
      if (typeof doc.workerId !== 'string') return deny('Invalid leave request.', 400);
      const worker = await DbService.findRecord('workers', doc.workerId);
      if (!worker || worker.userId !== session.userId) return deny();
      return allow({ ...doc, status: 'pending' });
    }

    default:
      return deny();
  }
}
