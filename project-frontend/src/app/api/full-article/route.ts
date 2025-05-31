// app/api/full-article/route.ts

import { NextResponse } from 'next/server';
import { extract } from '@extractus/article-extractor';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const article = await extract(url);

    return NextResponse.json({
      text: article?.content || '',
      title: article?.title || '',
    });
  } catch (error) {
    console.error('Failed to extract article:', error);
    return NextResponse.json({ text: '', error: 'Failed to extract article' }, { status: 500 });
  }
}
