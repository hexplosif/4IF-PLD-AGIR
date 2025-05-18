import React, { useEffect, useState } from 'react';
import styles from './BaseCard.module.css';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  color: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

interface BodyProps {
  title: string;
  content: string;
  resume?: string;
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
  composant: FooterItemMultipleIcons;
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
  cardType?: string;
}

function parentWidth(elem: Element) {
  return elem.parentElement.clientWidth;
}

const BaseCard: React.FC<CardProps> = ({
  width = '100%',
  header, body, footer, backgroundImage,
  className,
  cardType,
}) => {
  const [widthPx, setWidthPx] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const { t } = useTranslation('cards');

  const formatText = (text: string) => {
    return text.split('\r\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\r\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  useEffect(() => {
    if (width !== '100%') {
      setWidthPx(width);
      return;
    }
    setWidthPx(parentWidth(document.querySelector(`.${styles.cardContainer}`)));
  });

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      onMouseDown={(e) => { setIsMouseDown(true) }}
      onMouseUp={(e) => { setIsMouseDown(false); }}
      className={`${styles.cardContainer} ${className}`}
      style={{
        width: `${widthPx}px`,
        height: `${widthPx / 1.5 * 2.5}px`,
      }}
    >
      <div
        className={`${styles.card} ${isExpanded ? styles.expandedCard : ''}`}
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

        {/* Vue normale */}
        {!isExpanded && (
          <>
            {/* Header Section */}
            <div className={styles.header}>
              <div className={styles.headerIcon}
                style={{ backgroundColor: header.color }}
              >{header.icon}</div>
              <div className={styles.headerText}>
                <h2 className={styles.title}>{header.title}</h2>
                {header.subtitle &&
                  <p className={styles.subtitle}>{header.subtitle}</p>
                }
              </div>
            </div>

            {/* Body Section */}
            {body && (
              <div className={styles.body}>
                {/* Titre avec style conditionnel */}
                <div
                  className={`${styles.title} ${cardType === "Expert" ? styles.expertTitle : ''}`}
                >
                  {body.title}
                </div>

                {/* Contenu seulement si ce n'est pas une carte Expert */}
                {cardType !== "Expert" && (
                  <div className={styles.content}>
                    {isExpanded ? formatText(body.content) : formatText(body.resume || body.content)}
                  </div>
                )}

                {/* Bouton seulement si ce n'est pas une carte Expert */}
                {cardType !== "Expert" && (
                  <button
                    className={styles.seeMore}
                    onClick={toggleExpanded}
                  >
                    {isExpanded ? t('buttons.seeLess') : t('buttons.seeMore')}
                  </button>
                )}
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
                <div
                  className={styles.footerItem}
                  style={{ backgroundColor: footer.composant.color }}
                >
                  <span className={styles.footerLabel}>{footer.composant.label}</span>
                  <div className={styles.footerIcons}>
                    {footer.composant.icons?.map((icon, index) => (
                      <div className={styles.footerIcon} key={index}>
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>

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
          </>
        )}

        {/* Vue détaillée */}
        {isExpanded && (
          <div className={styles.expandedContent}>
            {/* Titre */}
            {body && (
              <div className={styles.content}>{formatText(body.content)}</div>
            )}

            {/* Bouton retour en bas de la carte */}
            <button
              className={styles.seeLess}
              onClick={toggleExpanded}
            >
              {t('buttons.seeLess')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseCard;