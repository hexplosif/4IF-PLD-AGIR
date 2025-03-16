import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';
import styles from './errorPopup.module.css';

interface ErrorPopupProps {
    title?: string;
    message: string;
    onClose?: () => void;
    isVisible?: boolean;
    clickOverlayToClose?: boolean;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({
    message,
    title = 'Error',
    onClose,
    isVisible = true,
    clickOverlayToClose = true,
}) => {    
    const handleClose = () => {
      if (onClose) onClose();
    };
    
    if (!isVisible) return null;
    
    return (
      <>
        <div className={styles.overlay} onClick={clickOverlayToClose ? handleClose : undefined}></div>

        <div className={styles.modalContainer}>
            <div className={styles.modalContent}>

                <div className={styles.titleContainer}>
                    <FiAlertCircle className={styles.alertIcon} />
                    <h3 className={styles.title}>{title}</h3>
                </div>

                <div className={styles.modalBody}>
                    <p className={styles.message}>{message}</p>
                </div>

                <div className={styles.modalFooter}>
                    <button
                        onClick={handleClose}
                        className={styles.confirmButton}
                    > Confirmer </button>
                </div>

          </div>
        </div>
      </>
    );
  };

export default ErrorPopup;