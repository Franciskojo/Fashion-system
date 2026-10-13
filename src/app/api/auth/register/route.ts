import { NextResponse } from 'next/server';
import { signAuthToken } from '@/lib/auth';
import { User, Role } from '@/lib/types';
import { DbService } from '@/lib/db-service';

export async function POST(req: Request) {
  try {
    const { name, email, password, role, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email and password are required.' },
        { status: 400 }
      );
    }

    const existingUser = await DbService.getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const userRole: Role = role || 'customer';
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: userRole,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      phone: phone || '+233 24 000 0000',
      status: 'active',
    };

    await DbService.createUser(newUser);

    const sessionData = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      avatar: newUser.avatar,
    };

    const token = await signAuthToken(sessionData);

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      token,
    });

    response.cookies.set('stitchflow_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
