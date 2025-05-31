import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET() {
  try {
    const response = await axios.get(`${API_URL}/api/blogs`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching blogs:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || 'Failed to fetch blogs' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    console.log('Creating blog with data:', body);

    const response = await axios.post(
      `${API_URL}/api/blogs`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Blog created successfully:', response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating blog:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create blog';
    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
} 