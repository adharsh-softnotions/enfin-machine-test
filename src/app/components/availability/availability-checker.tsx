"use client"

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { MultiSelect } from '../ui/multi-select';
import { DatePicker } from '../ui/date-picker';
import dayjs from 'dayjs';
import { TimeSlotTable } from './timeslot-grid';

interface Participant {
    id: string;
    name: string;
}

interface DateRange {
    start: string;
    end: string;
}

interface Input {
    participant_ids: number[];
    date_range: DateRange;
}

export const AvailabilityChecker = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<Record<string, string[]>>({});

    const handleStartDateChange = (date: dayjs.Dayjs | null) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date: dayjs.Dayjs | null) => {
        setEndDate(date);
    };

    const handleButtonClick = async () => {
        if (!startDate || !endDate || selectedParticipants.length === 0) {
            setError('Please select participants and date range');
            return;
        }

        setIsLoading(true);
        setError(null);

        const input: Input = {
            participant_ids: selectedParticipants.map(id => parseInt(id)),
            date_range: {
                start: startDate.format('YYYY-MM-DD'),
                end: endDate.format('YYYY-MM-DD'),
            },
        };

        try {
            const response = await fetch('/api/check-availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch availability');
            }

            const data = await response.json();
            setAvailableSlots(data.availableSlots);
        } catch (err) {
            console.error('Error fetching availability:', err);
            setError('An error occurred while checking availability');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        async function fetchParticipants() {
            try {
                const response = await fetch('/api/participants');
                const data = await response.json();

                if (data?.participants) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const participantsArray = Object.entries(data?.participants).map(([key, participant]: [string, any]) => ({
                        id: key,
                        name: participant?.name,
                    }));

                    setParticipants(participantsArray);
                } else {
                    console.error('Data.participants is not available', data);
                }
            } catch (error) {
                console.error('Error fetching participants:', error);
            }
        }

        fetchParticipants();
    }, []);

    return (
        <>
            <div className="max-w-md mx-auto p-6">
                <h1 className="text-2xl font-semibold text-center mb-6">
                    Check Availability
                </h1>

                <MultiSelect
                    options={participants}
                    selectedParticipants={selectedParticipants}
                    setSelectedParticipants={setSelectedParticipants}
                />

                <div className="space-y-4 mb-4">
                    <DatePicker
                        value={startDate}
                        onChange={handleStartDateChange}
                        placeholder="Select Start Date"
                    />
                    <DatePicker
                        value={endDate}
                        onChange={handleEndDateChange}
                        placeholder="Select End Date"
                    />
                </div>

                <Button
                    onClickFunction={handleButtonClick}
                    label="Check Slot"
                    loading={isLoading}
                    disabled={isLoading}
                />

                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            <TimeSlotTable availableSlots={availableSlots} />
        </>

    );
};