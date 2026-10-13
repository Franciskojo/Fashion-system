import { NextResponse } from 'next/server';
import { signAuthToken } from '@/lib/auth';
import { DbService } from '@/lib/db-service';

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    // Find user by email or role shortcut
    let user = email ? await DbService.getUserByEmail(email) : null;

    // If role is passed directly for demo login
    if (!user && role) {
      user = await DbService.getUserByRole(role);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found with provided credentials.' },
        { status: 401 }
      );
    }

    // In demo environment, verify password if provided or bypass if standard demo
    if (password && user.password && password !== user.password && password !== 'stitchflow123') {
      return NextResponse.json(
        { success: false, error: 'Invalid password. (Default demo: stitchflow123)' },
        { status: 401 }
      );
    }

    const sessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error detail:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
