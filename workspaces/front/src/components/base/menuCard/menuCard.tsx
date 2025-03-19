import React from "react";
import { ReactElement } from "react";
import styles from './menuCard.module.css';

interface MenuCardProps {
    label: string;
    icon: ReactElement;
    onClick?: () => void;
}

const MenuCard : React.FC<MenuCardProps> = ({ 
    label, 
    icon,
    onClick,
}) => {
    return (
        <button className={`${styles.cardContainer} button-reset`} onClick={onClick}>
            <p className={`${styles.cardLabel} text-reset`}>{label}</p>
            <div className={`${styles.iconContainer}`}>
                {icon}
            </div>
        </button>
    );
}

export default MenuCard;