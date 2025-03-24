import { FourSquare } from 'react-loading-indicators';
import styles from './loading.module.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingPageProps {
    loadingText?: string;
}

const LoadingPage : React.FC<LoadingPageProps> = ({
    loadingText,
}) => {
    const { i18n } = useTranslation("global");
    const [primaryColor, setPrimaryColor] = useState('');
    const getLoadingText = () => {
        if (!loadingText) {
            return i18n.t('loading') + '...';
        }
        return loadingText;
    }

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