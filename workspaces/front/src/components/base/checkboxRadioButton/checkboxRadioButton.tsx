import React from 'react';
import styles from './checkboxRadioButton.module.css';

interface CheckboxRadioButtonProps {
    type: 'checkbox' | 'radio';
    id: string;
    name?: string;
    label: string;
    onChange: (value: boolean) => void;
    checked: boolean;
}

const CheckboxRadioButton: React.FC<CheckboxRadioButtonProps> = ({
    type,
    id,
    name,
    label,
    onChange,
    checked,
}) => {
    return (
        <label className={styles.checkboxLabel} htmlFor={id}>
            <input
                id={id}
                type={type}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className={styles.checkbox}
                name={name}
            />
            {label}
        </label>
    );
}

export default CheckboxRadioButton;