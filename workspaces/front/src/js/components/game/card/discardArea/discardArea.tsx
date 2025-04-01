import React, { useRef, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import styles from './DiscardArea.module.css';
import { Card } from '@shared/common/Cards'; // Adjust the import based on your project structure
import { useDrop } from 'react-dnd';
import { ItemTypes } from '@app/js/types/DnD';

interface DiscardAreaProps {
  width: number | '100%';
  onCardDiscarded?: (card: Card) => void;
  className?: string;
  title?: string;
}

const DiscardArea: React.FC<DiscardAreaProps> = ({
    width = 150,
    onCardDiscarded,
    className = '',
    title = 'Discard'
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [ {isDragOver}, dropRef] = useDrop({
        accept: ItemTypes.CARD,
        drop: (item: { card: Card }) => {
            if (onCardDiscarded) {
                onCardDiscarded(item.card);
            }
        },
        collect: (monitor) => ({
            isDragOver: !!monitor.isOver(),
        }),
    });
    dropRef(ref);
    
  // Convert width to a string with px if it's a number
  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  return (
        <div 
            ref={ref}
            className={`${styles.discardArea} ${isDragOver ? styles.dragOver : ''} ${className}`}
            style={{ width: widthStyle }}
        >
            <div className={styles.transparentOverlay} data-tooltip={'Drag and drop a card here to discard it!'}/>
            <div className={styles.discardContent}>
                <FaTrashAlt className={styles.discardIcon} />
                <div className={styles.discardTitle}>{title}</div>
            </div>
            <div className={styles.cardCorners}>
                <div className={styles.cornerTopLeft}></div>
                <div className={styles.cornerTopRight}></div>
                <div className={styles.cornerBottomLeft}></div>
                <div className={styles.cornerBottomRight}></div>
            </div>
        </div>
  );
};

export default DiscardArea;