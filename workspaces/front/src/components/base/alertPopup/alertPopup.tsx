import React, { useCallback } from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import styles from './alertPopup.module.css';
import { IoWarningOutline } from 'react-icons/io5';

export enum PopupType {
    ERROR,
    SUCCESS,
    WARNING,
}

interface AlertPopupProps {
    type: PopupType;
    title?: string;
    message: string;
    onClose?: () => void;
    isVisible?: boolean;
    clickOverlayToClose?: boolean;
}

const AlertPopup: React.FC<AlertPopupProps> = ({
    type,
    message,
    title,
    onClose,
    isVisible = true,
    clickOverlayToClose = true,
}) => {    
    const handleClose = () => {
      if (onClose) onClose();
    };

    const getClassName = useCallback( (type: PopupType) => {
      switch (type) {
        case PopupType.ERROR:
            return 'error'
        case PopupType.SUCCESS:
            return 'success';
        case PopupType.WARNING:
            return 'warning';
      }
    }, []);

    const getIcon = useCallback( (type: PopupType) => {
      const className = `${getClassName(type)} ${styles.alertIcon}`;
      switch (type) {
        case PopupType.ERROR:
            return <FiAlertCircle className={className} />
        case PopupType.SUCCESS:
            return <FiCheckCircle className={className} />
        case PopupType.WARNING:
            return <IoWarningOutline className={className} />
      }
    }, []);
    
    if (!isVisible) return null;
    
    return (
      <>
        <div className={styles.overlay} onClick={clickOverlayToClose ? handleClose : undefined}></div>

        <div className={`${styles.modalContainer} ${styles[getClassName(type)]}`}>
            <div className={styles.modalContent}>

                <div className={styles.titleContainer}>
                    {getIcon(type)}
                    <h3 className={styles.title}>{title ?? getClassName(type)}</h3>
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

export default AlertPopup;