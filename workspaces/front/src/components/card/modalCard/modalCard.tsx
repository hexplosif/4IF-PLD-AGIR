import React from 'react';
import { Modal, Group, Text, Badge, Divider, Button, Stack, Grid } from '@mantine/core';
import { Card, Practice_Card, Formation_Card, Expert_Card, CardType, Best_Practice_Card } from '@shared/common/Cards';
import { useTranslation } from 'react-i18next';
import GameCard from '../gameCard/GameCard';
import styles from './ModalCard.module.css';

interface ModalCardProps {
  card: Card | null;
  isVisible: boolean;
  onClose: () => void;
}

const ModalCard: React.FC<ModalCardProps> = ({
  card,
  isVisible,
  onClose
}) => {
  const { t } = useTranslation('cards');

  if (!card) {
    return null;
  }

  const renderCardTypeSpecificInfo = () => {
    switch (card.cardType) {
      case 'BestPractice':
      case 'BadPractice': {
        const practiceCard = card as Practice_Card;
        return (
          <>
            <Divider my="md" label={t('modal.gains')} labelPosition="center" />
            <div className={styles.headerBadegesContainer}>
              {practiceCard.network_gain && (<Badge color="teal">Network</Badge>)}
              {practiceCard.memory_gain && (<Badge color="teal">Memory</Badge>)}
              {practiceCard.cpu_gain && (<Badge color="teal">CPU</Badge>)}
              {practiceCard.storage_gain && (<Badge color="teal">Storage</Badge>)}
            </div>

            <Divider my="md" label={t('modal.components')} labelPosition="center" />
            <div className={styles.headerBadegesContainer}>
              {practiceCard.interface_composant && (<Badge color="blue">Interface</Badge>)}
              {practiceCard.data_composant && (<Badge color="blue">Data</Badge>)}
              {practiceCard.network_composant && (<Badge color="blue">Network</Badge>)}
              {practiceCard.performance_composant && (<Badge color="blue">Performance</Badge>)}
              {practiceCard.system_composant && (<Badge color="blue">System</Badge>)}
            </div>

            <Divider my="md" label={t('modal.difficulty')} labelPosition="center" />
            <Text size="lg">
              {Array(practiceCard.difficulty || 0).fill('★').join('')}
              {Array(4 - (practiceCard.difficulty || 0)).fill('☆').join('')}
            </Text>
          </>
        );
      }
      case 'Formation': {
        const formationCard = card as Formation_Card;
        return (
          <>
            <Divider my="md" label={t('modal.formationLink')} labelPosition="center" />
            <Button
              component="a"
              href={formationCard.linkToFormation}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
              variant="outline"
            >
              {t('modal.openFormation')}
            </Button>
          </>
        );
      }
      case 'Expert':
      default:
        return null;
    }
  };

  const getCardTypeColor = (type: CardType) => {
    switch (type) {
      case 'BestPractice':
        return 'teal';
      case 'BadPractice':
        return 'red';
      case 'Formation':
        return 'blue';
      case 'Expert':
        return 'yellow';
      default:
        return 'gray';
    }
  }

  return (
    <Modal
      opened={isVisible}
      onClose={onClose}
      title={t('modal.title')}
      overlayProps={{ opacity: 0.9, blur: 3 }}
      zIndex={1000}
      padding={20}
      size="xxl"
      classNames={{
        body: styles.modalBody
      }}
      centered
    >
      <div className={styles.modalContent}>
        <div className={styles.cardContainer}>
          <GameCard card={card} width={400} className={styles.gameCard} />
        </div>

        <div className={styles.detailsContainer}>

          <div className={styles.headerBadegesContainer}>
            <Badge size="lg" color={getCardTypeColor(card.cardType)} className={styles.actorBadge}>
              {card.cardType === 'BestPractice' && t('cards.goodPractice.title')}
              {card.cardType === 'BadPractice' && t('cards.badPractice.title')}
              {card.cardType === 'Formation' && t('cards.formation.title')}
              {card.cardType === 'Expert' && t('cards.expert.title')}
            </Badge>

            <Badge size="lg" color="blue" className={styles.actorBadge}>
              {card.actor === 'Architect' && t('cards.expert.subtitle.architect')}
              {card.actor === 'Developer' && t('cards.expert.subtitle.developer')}
              {card.actor === 'ProductOwner' && t('cards.expert.subtitle.productowner')}
            </Badge>
          </div>

          {card.cardType === 'BestPractice' && (
            <Text size="lg" fw={400} c="cyan">
              {t('modal.carbonSaved') + ' : ' + (card as Best_Practice_Card).carbon_loss} kg CO₂
            </Text>
          )}

          <Divider my="md" label={t('modal.description')} labelPosition="center" />

          <Text size="xl" className={styles.cardTitle} fw={500}>
            {card.title}
          </Text>


          {card.cardType !== 'Expert' && (
            <Text className={styles.description} ta={'justify'}>
              {card.contents}
            </Text>
          )}

          {renderCardTypeSpecificInfo()}
        </div>
      </div>
    </Modal>
  );
};

export default ModalCard;