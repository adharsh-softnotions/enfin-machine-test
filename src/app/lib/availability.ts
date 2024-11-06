import redis from './redis';

interface TimeSlot {
  start: string;
  end: string;
}

interface DateRange {
  start: string;
  end: string;
}

interface Input {
  participant_ids: number[];
  date_range: DateRange;
}

interface Participant {
  id: number;
  name: string;
  threshold: number;
}

interface ParticipantAvailability {
  [dayOfWeek: string]: TimeSlot[];
}

interface Schedules {
  [date: string]: TimeSlot[];
}

type ParticipantAvailabilityData = Record<number, ParticipantAvailability>;
type ScheduleData = Record<number, Schedules>;

export async function checkParticipantAvailableSlots(input: Input): Promise<Record<string, string[]>> {
  const participants: Record<number, Participant> = JSON.parse(await redis.get('participants') || '{}');
  const participantAvailability: ParticipantAvailabilityData = JSON.parse(await redis.get('participantAvailability') || '{}');
  const schedules: ScheduleData = JSON.parse(await redis.get('schedules') || '{}');

  const { participant_ids, date_range } = input;
  const result: Record<string, string[]> = {};

  const startDate = new Date(date_range.start);
  const endDate = new Date(date_range.end);

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const currentDate = formatDate(d);
    const dayOfWeek = d.toLocaleString('en-US', { weekday: 'long' });

    const availableSlots = await findAvailableSlots(
      participant_ids,
      dayOfWeek,
      currentDate,
      participants,
      participantAvailability,
      schedules
    );

    if (availableSlots.length > 0) {
      result[currentDate] = availableSlots;
    }
  }

  return result;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function findAvailableSlots(
  participantIds: number[],
  dayOfWeek: string,
  currentDate: string,
  participants: Record<number, Participant>,
  participantAvailability: ParticipantAvailabilityData,
  schedules: ScheduleData
): Promise<string[]> {
  const availableSlots: string[] = [];
  const dayStart = new Date(`${currentDate} 00:00`);
  const dayEnd = new Date(`${currentDate} 23:59`);

  // Generate 30-minute time slots
  for (let time = dayStart; time < dayEnd; time.setMinutes(time.getMinutes() + 30)) {
    const slotStart = time.toTimeString().slice(0, 5);
    const slotEnd = new Date(time.getTime() + 30 * 60000).toTimeString().slice(0, 5);

    // Check availability for the selected participant(s)
    if (await isSlotAvailable(participantIds, dayOfWeek, currentDate, slotStart, slotEnd, participants, participantAvailability, schedules)) {
      availableSlots.push(`${slotStart}-${slotEnd}`);
    }
  }

  return availableSlots;
}

async function isSlotAvailable(
  participantIds: number[],
  dayOfWeek: string,
  currentDate: string,
  slotStart: string,
  slotEnd: string,
  participants: Record<number, Participant>,
  participantAvailability: ParticipantAvailabilityData,
  schedules: ScheduleData
): Promise<boolean> {
  const promises = participantIds.map(async (id) => {
    const availability = participantAvailability[id]?.[dayOfWeek];
    const schedule = schedules[id]?.[currentDate] || [];
    const participant = participants[id];

    // If participant's availability for the day is not available, return false
    if (!availability) return false;

    // Check if the slot is within participant's availability range
    const isWithinAvailability = availability.some((slot: TimeSlot) =>
      slotStart >= slot.start && slotEnd <= slot.end
    );

    // Ensure there are no conflicts with existing meetings
    const hasNoConflict = schedule.every((meeting: TimeSlot) =>
      slotEnd <= meeting.start || slotStart >= meeting.end
    );

    // Ensure the participant hasn't reached their meeting threshold
    const meetingsCount = schedule.filter((meeting: TimeSlot) =>
      slotStart < meeting.end && slotEnd > meeting.start
    ).length;

    return isWithinAvailability && hasNoConflict && meetingsCount < (participant?.threshold || 0);
  });

  // Wait for all participant availability checks to complete
  const results = await Promise.all(promises);

  // Return true if the selected participant is available for the slot
  return results.every(Boolean);
}
