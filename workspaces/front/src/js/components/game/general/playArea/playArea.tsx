import React, { useState, useEffect, useRef } from 'react';
import { ItemTypes } from "@app/js/types/DnD";
import { useDrop } from "react-dnd";
import styles from './PlayArea.module.css';
import { Card } from '@shared/common/Cards';

interface PlayAreaProps {
    width?: number;
    height?: number;
    className?: string;
    onDropCard?: (card: any) => void;
}

const PlayArea: React.FC<PlayAreaProps> = ({
    width = 800,
    height = 600,
    className = "",
    onDropCard,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [dropAnimation, setDropAnimation] = useState(false);
    const [dropPosition, setDropPosition] = useState({ x: 0, y: 0 });
    const [text, setText] = useState<string | null>(null);
    
    const [{ isOver, canDrop }, dropRef] = useDrop({
        accept: ItemTypes.CARD,
        drop: (item: any, monitor) => {
            if (onDropCard) {
                onDropCard(item.card);
            }
            
            // Get drop position for animation
            const dropOffset = monitor.getSourceClientOffset();
            if (dropOffset) {
                // Get the center of the play area
                const element = ref.current;
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    // Calculate relative position from center
                    setDropPosition({
                        x: dropOffset.x - centerX,
                        y: dropOffset.y - centerY
                    });
                }
            }
            
            // Trigger drop animation
            setDropAnimation(true);
            setTimeout(() => setDropAnimation(false), 500);
            
            return undefined;
        },
        canDrop: (item: any) => {
            const card = item.card as Card;
            if (card.cardType !== "BadPractice")
                return item.canPlay;
            return false; // bad practice need to play on another player
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver(),
        }),
    });
    dropRef(ref);

    // Calculate dynamic classes based on drop state
    const areaClasses = [
        styles.playArea,
        className,
        isOver && canDrop ? styles.canDropOver : '',
        isOver && !canDrop ? styles.cannotDropOver : '',
        !isOver && canDrop ? styles.canDrop : '',
    ].filter(Boolean).join(' ');

    useEffect(() => {
        const newText = getText();
        if (newText === null) return;
        setText(newText);
    }, [canDrop, isOver]);

    const getText = () => {
        if (canDrop && !isOver) return "Play Card Here"
        if (isOver && !canDrop) return "Cannot Play Here"
        return null;
    }

    return (
        <div 
            ref={ref} 
            className={areaClasses}
            style={{ width, height }}
        >
            <div className={styles.tableTexture}></div>
            
            {/* Visual indicators for drop zone */}
            <div className={styles.dropZoneIndicator}>
                <div className={styles.innerCircle}></div>
                <div className={styles.outerCircle}></div>
            </div>
            
            {/* Drop animation */}
            {dropAnimation && (
                <div 
                    className={styles.dropRipple}
                    style={{
                        left: `calc(50% + ${dropPosition.x}px)`,
                        top: `calc(50% + ${dropPosition.y}px)`
                    }}
                />
            )}
            
            {/* Hover indicator */}
            <div className={`${styles.hoverIndicator} ${getText() !== null ? styles.visible : ''}`}>
                {text}
            </div>
        </div>
    );
};

export default PlayArea;