import { NextResponse } from 'next/server';
import redis from '@/app/lib/redis';

export async function GET() {

  try {
    const participantsData = await redis.get('participants');
    const participants = participantsData ? JSON.parse(participantsData) : [];
    return NextResponse.json({ participants });

  }
   catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

