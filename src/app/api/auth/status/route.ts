import { NextResponse } from 'next/server';
import { getAuthStatus } from '@/app/actions';

export async function GET() {
  try {
    const authStatus = await getAuthStatus();
    
    return NextResponse.json(authStatus);
  } catch (error) {
    console.error('Error getting auth status:', error);
    return NextResponse.json(
      { isAuthenticated: false, error: 'Failed to get auth status' },
      { status: 500 }
    );
  }
} 