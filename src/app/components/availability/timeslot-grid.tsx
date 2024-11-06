"use client"; 

import { FC } from "react";
import { Alarm } from "@phosphor-icons/react";

interface TimeSlotTableProps {
    availableSlots: Record<string, string[]>; 
}

export const TimeSlotTable: FC<TimeSlotTableProps> = ({ availableSlots }) => {
    return (
        <div className="flex justify-center items-center">
            <div className="bg-[#FDF8F3] rounded-lg p-6 w-[60%]">
                <h2 className="text-lg font-semibold mb-6 text-center underline">
                    Available Slots
                </h2>
                <div className="space-y-6">
                    {Object.entries(availableSlots).length === 0 ? (
                        <p className="text-center">No available slots found</p>
                    ) : (
                        Object.entries(availableSlots).map(([date, slots], index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-24 font-medium">{date}</div>
                                <div className="mx-2">:</div>
                                <div className="flex-1 flex flex-wrap gap-3">
                                    {slots.map((slot, slotIndex) => (
                                        <div
                                            key={slotIndex}
                                            className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm"
                                        >
                                            <Alarm size={15} className="flex-shrink-0" />{" "}
                                            <span>{slot}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

