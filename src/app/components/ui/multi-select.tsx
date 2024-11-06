import React, { useState, useEffect, useRef } from 'react';

interface Participant {
    id: string;
    name: string;
}

interface MultiSelectProps {
    options: Participant[];
    selectedParticipants: string[];
    setSelectedParticipants: React.Dispatch<React.SetStateAction<string[]>>; 
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    selectedParticipants,
    setSelectedParticipants
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null); 
    const buttonRef = useRef<HTMLButtonElement | null>(null); 

    const toggleParticipant = (id: string): void => {
        setSelectedParticipants((prevSelected: string[]) => {
            return prevSelected.includes(id)
                ? prevSelected.filter(pId => pId !== id)
                : [...prevSelected, id];
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleButtonClick = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    return (
        <div className="relative mb-4">
            <button
                ref={buttonRef}
                className="w-full p-3 bg-gray-100 rounded-md text-left flex justify-between items-center"
                onClick={handleButtonClick}
            >
                <span className="text-gray-600">
                    {selectedParticipants.length > 0 ? `${selectedParticipants.length} selected` : 'Choose Participants'}
                </span>
                <svg
                    className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isDropdownOpen && (
                <div ref={dropdownRef} className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10">
                    {options.map((participant) => (
                        <div
                            key={participant.id}
                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleParticipant(participant.id)}
                        >
                            <input
                                type="checkbox"
                                checked={selectedParticipants.includes(participant.id)}
                                onChange={() => {}}
                                className="w-4 h-4 mr-3"
                            />
                            <span>{participant.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
