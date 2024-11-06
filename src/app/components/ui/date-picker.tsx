import { FC } from 'react';
import dayjs, { Dayjs } from 'dayjs'; 

interface DatePickerProps {
    value: Dayjs | null; 
    onChange: (date: Dayjs | null) => void; 
    placeholder?: string;
}

export const DatePicker: FC<DatePickerProps> = ({ value, onChange, placeholder }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value ? dayjs(event.target.value) : null; 
        onChange(selectedDate);
    };

    return (
        <input
            type="date"
            value={value ? value.format('YYYY-MM-DD') : ''} 
            onChange={handleChange}
            className="w-full p-3 bg-gray-100 rounded-md"
            placeholder={placeholder}
        />
    );
};
