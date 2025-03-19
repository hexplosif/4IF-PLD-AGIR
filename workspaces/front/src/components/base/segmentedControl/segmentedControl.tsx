import React from 'react';
import styles from './segmentedControl.module.css';

interface SegmentedControl {
    values: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

const SegmentedControl: React.FC<SegmentedControl> = ({ 
    values, 
    selectedValue, 
    onSelect 
}) => {
    return (
        <div className={styles.segmentedControl}>
            {values.map((value) => (
                <button
                    key={value}
                    type="button"
                    className={`${styles.segmentButton} ${selectedValue === value ? styles.segmentActive : ''}`}
                    onClick={() => onSelect(value)}
                >
                    {value}
                </button>
            ))}
        </div>
    );
}

export default SegmentedControl;