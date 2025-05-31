import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await axios.get(`${API_URL}/api/blogs/${params.id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching blog:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || 'Failed to fetch blog' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const response = await axios.put(
      `${API_URL}/api/blogs/${params.id}`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error updating blog:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || 'Failed to update blog' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await axios.delete(`${API_URL}/api/blogs/${params.id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error deleting blog:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || 'Failed to delete blog' },
      { status: error.response?.status || 500 }
    );
  }
} 