import mongoose, { Schema, Model } from 'mongoose';

/**
 * Every collection stores the application's own documents (see `src/lib/types.ts`)
 * and is keyed by the app-level string `id`. `strict: false` lets the documents keep
 * exactly the shape the UI already uses.
 */
type AnyDoc = Record<string, unknown>;

function defineModel(
  name: string,
  uniqueFields: Record<string, { type: StringConstructor; required: boolean; unique: boolean }> = {}
): Model<AnyDoc> {
  const schema = new Schema<AnyDoc>(
    {
      id: { type: String, required: true, unique: true, index: true },
      ...uniqueFields,
    },
    { strict: false, versionKey: false }
  );
  return (mongoose.models[name] as Model<AnyDoc> | undefined) || mongoose.model<AnyDoc>(name, schema);
}

const uniqueString = { type: String, required: true, unique: true };

export const User = defineModel('User', { email: uniqueString });
export const Student = defineModel('Student', { studentId: uniqueString });
export const Worker = defineModel('Worker', { workerId: uniqueString });
export const Course = defineModel('Course');
export const Order = defineModel('Order', { orderNumber: uniqueString });
export const Attendance = defineModel('Attendance');
export const Payroll = defineModel('Payroll');
export const LeaveRequest = defineModel('LeaveRequest');
export const Certificate = defineModel('Certificate');

/** One worker per device per day (clock-in guard). */
export const ClockDevice =
  (mongoose.models.ClockDevice as Model<AnyDoc> | undefined) ||
  mongoose.model<AnyDoc>(
    'ClockDevice',
    new Schema<AnyDoc>(
      { key: { type: String, required: true, unique: true }, workerId: { type: String, required: true } },
      { versionKey: false }
    )
  );
