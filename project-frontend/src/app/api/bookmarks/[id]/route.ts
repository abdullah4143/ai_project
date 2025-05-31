import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await axios.delete(
      `${API_URL}/bookmarks/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete bookmark' },
      { status: error.response?.status || 500 }
    );
  }
} 