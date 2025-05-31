import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await axios.get(
      `${API_URL}/bookmarks/user/${encodeURIComponent(params.email)}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching user bookmarks:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user bookmarks' },
      { status: error.response?.status || 500 }
    );
  }
} 