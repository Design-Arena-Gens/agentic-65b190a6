import { NextResponse } from 'next/server';

// In-memory storage (in production, use a database like Vercel KV)
let scheduledPosts: Array<{subject: string, post: string, date: string}> = [];

export async function POST(request: Request) {
  try {
    const { subject, post } = await request.json();

    if (!subject || !post) {
      return NextResponse.json({ error: 'Subject and post are required' }, { status: 400 });
    }

    const scheduledPost = {
      subject,
      post,
      date: new Date().toISOString(),
    };

    scheduledPosts.push(scheduledPost);

    return NextResponse.json({ success: true, scheduledPost });
  } catch (error: any) {
    console.error('Error scheduling post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to schedule post' },
      { status: 500 }
    );
  }
}
