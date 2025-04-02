import React, { useEffect, useState } from 'react';
import styles from './BaseCard.module.css';

interface HeaderProps {
  color: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

interface BodyProps {
  title: string;
  content: string;
}

interface FooterItem {
  color: string;
  icon?: React.ReactNode;
  label: string;
}

interface FooterItemMultipleIcons extends FooterItem {
  icons: React.ReactNode[];
}

interface FooterProps {
  actor: FooterItem;
  // composant: FooterItem;
  gainsTypes: FooterItemMultipleIcons;
  difficulty: FooterItem;
}

interface CardProps {
  width?: number | '100%'; // if want to use another percentage (par ex: 90%), cover this component with a div (width = 90%)
  header: HeaderProps;
  body?: BodyProps;
  footer?: FooterProps;
  backgroundImage?: string;
  className?: string;
}

function parentWidth(elem: Element) {
  return elem.parentElement.clientWidth;
}

const BaseCard: React.FC<CardProps> = ({ 
  width = '100%',
  header, body, footer, backgroundImage,
  className,
}) => {
  const [widthPx, setWidthPx] = useState<number>(0);

  useEffect(() => {
    if (width !== '100%') {
      setWidthPx(width);
      return;
    }
    console.log('width', widthPx);
    setWidthPx(parentWidth(document.querySelector(`.${styles.cardContainer}`)));
  });
  
  return (
    <div
      className={`${styles.cardContainer} ${className}`}
      style={{ 
        width: `${widthPx}px`,
        height: `${widthPx / 1.5 * 2.5}px`,
      }}
    >

      <div 
        className={styles.card}
        style={{ 
          background: backgroundImage ? undefined : '#fefefe',
          transform: `scale(${widthPx / 300})`,
        }}
      >
        {backgroundImage && (
          <div 
            className={styles.cardBackground} 
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}

        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}
              style={{ backgroundColor: header.color }}
            >{header.icon}</div>
            <div className={styles.headerText}>
              <div className={styles.headerOverlay} />
              <div className={styles.headerTextContent}>
                <h2 className={styles.title}>{header.title}</h2>
                { header.subtitle && 
                  <p className={styles.subtitle}>{header.subtitle}</p>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Body Section */}
        {body && (
          <div className={styles.body}>
            <div className={styles.table}>
              <p className={styles.tableTitle}>{body.title}</p>
              <div className={styles.tableContent}><p>{body.content}</p></div>
            </div>
          </div>
        )}

        {/* Footer Section */}
        {footer && (
          <div className={styles.footer}>
            {/* Actor */}
            <div 
              className={styles.footerItem} 
              style={{ backgroundColor: footer.actor.color }}
            >
              <span className={styles.footerLabel}>{footer.actor.label}</span>
              <div className={styles.footerIcon}>
                {footer.actor.icon}
              </div>
            </div>

            {/* Composant */}
            {/* <div 
              className={styles.footerItem} 
              style={{ backgroundColor: footer.composant.color }}
            >
              <span className={styles.footerLabel}>{footer.composant.label}</span>
              <div className={styles.footerIcon}>
                {footer.composant.icon}
              </div>
            </div> */}

            {/* Gains Types */}
            <div 
              className={`${styles.footerItem} ${styles.gainsTypes} ${footer.gainsTypes.icons?.length < 2 ? styles.gainsTypesOneIcon : ''}`} 
              style={{ backgroundColor: footer.gainsTypes.color }}
            >
              <span className={styles.footerLabel}>{footer.gainsTypes.label}</span>
              <div className={styles.footerIcons}>
                {footer.gainsTypes.icons?.map((icon, index) => (
                  <div className={styles.footerIcon} key={index}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div 
              className={styles.footerItem} 
              style={{ backgroundColor: footer.difficulty.color }}
            >
              <span className={styles.footerLabel}>{footer.difficulty.label}</span>
              <div className={styles.footerIcon}>
                {footer.difficulty.icon}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseCard;