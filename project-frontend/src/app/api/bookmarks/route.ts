import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    const response = await axios.get(
      `${API_URL}/bookmarks`,
      token ? {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      } : undefined
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookmarks' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const response = await axios.post(
      `${API_URL}/bookmarks`,
      {
        blogId: body.blogId,
        userEmail: body.userEmail,
        articleUrl: body.articleUrl,
        article: body.article
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create bookmark' },
      { status: error.response?.status || 500 }
    );
  }
} 