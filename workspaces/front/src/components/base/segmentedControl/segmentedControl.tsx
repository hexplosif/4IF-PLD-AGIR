import React from 'react';
import styles from './segmentedControl.module.css';

interface SegmentedControl {
    values: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    disabled?: boolean;
}

const SegmentedControl: React.FC<SegmentedControl> = ({ 
    values, 
    selectedValue, 
    onSelect,
    disabled = false
}) => {
    return (
        <div className={`${styles.segmentedControl} ${disabled ? styles.disabled : ''}`}>
            {values.map((value) => (
                <button
                    key={value}
                    type="button"
                    className={`${styles.segmentButton} ${selectedValue === value ? styles.segmentActive : ''}`}
                    onClick={() => onSelect(value)}
                    disabled={disabled}
                >
                    {value}
                </button>
            ))}
        </div>
    );
}

export default SegmentedControl;