import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// This endpoint can be triggered by Vercel Cron Jobs
// Configure in vercel.json to run daily
export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Here you would:
    // 1. Fetch the next scheduled post from your database
    // 2. Post it to LinkedIn using LinkedIn's API
    // 3. Mark it as posted

    // For now, just log that the cron ran
    console.log('Daily post cron job executed at:', new Date().toISOString());

    return NextResponse.json({
      success: true,
      message: 'Cron job executed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: error.message || 'Cron job failed' },
      { status: 500 }
    );
  }
}
