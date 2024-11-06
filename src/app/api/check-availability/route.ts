import { NextRequest, NextResponse } from 'next/server';
import { checkParticipantAvailableSlots } from '@/app/lib/availability';

export async function POST(request: NextRequest) {

  try {
    const input = await request.json();
    const availableSlots = await checkParticipantAvailableSlots(input);
    return NextResponse.json({ availableSlots });

  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ error: 'An error occurred while checking availability' }, { status: 500 });
  }

}