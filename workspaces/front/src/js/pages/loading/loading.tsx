import { FourSquare } from 'react-loading-indicators';
import styles from './loading.module.css';
import { useEffect, useState } from 'react';

interface LoadingPageProps {
    loadingText?: string;
}

const LoadingPage : React.FC<LoadingPageProps> = ({
    loadingText = 'Chargement...',
}) => {
    const [primaryColor, setPrimaryColor] = useState('');

    useEffect(() => {
      const root = document.documentElement;
      const primaryColorValue = getComputedStyle(root).getPropertyValue('--primary').trim();
      setPrimaryColor(primaryColorValue);
    }, []);

    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.loadingContainer}`}>
                <FourSquare 
                    color={primaryColor}
                    size="large" 
                    text={loadingText} 
                    textColor="" 
                />
            </div>
        </div>
  );
};

export default LoadingPage;