import { NextResponse } from 'next/server';

// In-memory storage (shared with schedule route)
let scheduledPosts: Array<{subject: string, post: string, date: string}> = [];

export async function GET() {
  try {
    return NextResponse.json({ posts: scheduledPosts });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
