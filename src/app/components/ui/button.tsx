import { FC } from 'react';

interface ButtonProps {
    onClickFunction: () => void;
    label: string;
    loading: boolean;
    disabled?: boolean; 
}

export const Button: FC<ButtonProps> = ({ onClickFunction, label, loading, disabled }) => {
    return (
        <button
            onClick={onClickFunction}
            className={`w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors mb-6 ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading || disabled} 
        >
            {label} 
        </button>
    );
};
