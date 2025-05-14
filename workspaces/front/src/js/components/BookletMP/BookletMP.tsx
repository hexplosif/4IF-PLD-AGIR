import React, { useEffect, useState } from "react";
import styles from "./BookletMP.module.css";
import { useTranslation } from "react-i18next";
interface BookletMPProps {
  userId: string | null;
}

const BookletMP: React.FC<BookletMPProps> = ({ userId }) =>  {
  // Ajouter i18n et récupérer la langue actuelle
  const { t, i18n } = useTranslation('greenIt', {keyPrefix:"booklet-bp-mp"});
  const currentLanguage = i18n.language;

  const [data, setData] = useState([]);
  const [originalOrders] = useState<{
    [card_id: string]: number;
  }>({});
  const [modifiedItems, setModifiedItems] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const practicesResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/booklet/banned-practices?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const practicesData = await practicesResponse.json();
        const practicesBanned = practicesData.practices;

        // Fetch bad practice details
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/booklet/bad-practice-details`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(`Error: ${response.status} ${response.statusText}`);
          throw new Error("Failed to fetch bad practice details");
        }

        const badPracticeDetails = await response.json();
        
        // Filtrer les pratiques pour ne garder que celles dans la langue actuelle
        const filteredPractices = badPracticeDetails.filter(practice =>
          practice.language === currentLanguage ||
          practice.language === currentLanguage.split('-')[0] // Pour gérer fr-FR -> fr
        );

        const initializedData = filteredPractices.map((item) => {
          // Check if the practice is banned by iterating over practicesBanned
          let isUserBanned = false;
          let order = 1; // Default order
          practicesBanned.forEach((practice) => {
            if (practice.id === item.card_id) {
              isUserBanned = true; // Found a match, set to true
              order = practice.priority; // Set the order to the one stored in the database
            }
          });
          // Return the item with the banned property set based on the check
          return {
            ...item,
            order: order,
            UIBanned: isUserBanned, // Explicitly set to true if matched
            banned: isUserBanned,
          };
        });
        setData(initializedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userId, currentLanguage]); // Ajouter currentLanguage comme dépendance

  const handleBannedUIChange = (index: number) => {
    const newData = [...data];
    const item = newData[index];
    // Mise à jour UI seulement - pas d'appel API
    item.UIBanned = !item.UIBanned;
    setData(newData);
    setModifiedItems(new Set(modifiedItems).add(item.card_id));
  };

  const syncBannedStateWithServer = async (index: number) => {
    const newData = [...data];
    const item = newData[index];
    const user_id = userId;
    
    // Déterminer l'action à effectuer en fonction de l'état UI vs serveur
    const action = item.UIBanned !== item.banned
      ? (item.UIBanned ? "addBan" : "removeBan")
      : null;
      
    if (!action) return; // Aucune action nécessaire
    
    try {
      const url = `${import.meta.env.VITE_API_URL}/booklet/${action}/${item.card_id}`;
      const bookletDto = { user_id: user_id, order: item.order };
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookletDto),
      });
      
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      
      // Synchroniser l'état du serveur avec l'UI
      item.banned = item.UIBanned;
      setData([...newData]);
      
    } catch (error) {
      console.error("Failed to sync banned state with server:", error);
      // Restaurer l'état UI en cas d'erreur
      item.UIBanned = item.banned;
      setData([...newData]);
    }
  };

  const validateChange = async (index: number) => {
    const newData = [...data];
    const item = newData[index];
    const user_id = userId;

    try {
      // Étape 1: Synchroniser l'état "banned" avec le serveur
      await syncBannedStateWithServer(index);
      
      // Étape 2: Si la pratique est bannie, mettre à jour la priorité
      if (item.UIBanned) {
        const url = `${import.meta.env.VITE_API_URL}/booklet/updatePriority/${item.card_id}`;
        const bookletDto = {
          user_id: user_id,
          order: item.order,
          typePractices: "bad",
        };
        
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookletDto),
        });

        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }
        
        console.log("Changement de priorité validé avec succès.");
      }
    } catch (error) {
      console.error("Failed to validate changes:", error);
    }
  };

  const sortDataByColumn = (column: string) => {
    const newData = [...data];
    switch (column) {
      case "title":
        newData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "order":
        newData.sort((a, b) => (b.order || 0) - (a.order || 0));
        break;
      case "banned":
        newData.sort((a, b) => (a.banned === b.banned ? 0 : a.banned ? -1 : 1));
        break;
      default:
        break;
    }
    setData(newData);
  };

  const handlePriorityChange = (index: number, priority: number) => {
    const newData = [...data];
    newData[index].order = priority;
    setData(newData);
    setModifiedItems(new Set(modifiedItems).add(newData[index].card_id));
  };

  return (
    <div className={styles.bookletMPContainer}>
      <h3>{t('title-mp')}</h3>
      <div className={styles.mPCardContainer}>
        {data.map((card, index) => (
          <div key={index} className={styles.mPCard}>

            <h3>{card.label}</h3>

            <div className={styles.mPCardPriority}>
              <span>{t('table-headers.priority-order')}</span>
              <div className={styles.mPCardPriorityButtons}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(priority => (
                  <div
                    key={priority}
                    className={card.order === priority ? styles.selectedPriority : styles.unselectedPriority}
                    onClick={() => handlePriorityChange(index, priority)}
                  >
                    {priority}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.mPCardApply}>
              <span>{t('table-headers.ban')}</span>
              <div
                className={card.UIBanned ? styles.appliedCheckBox : styles.unappliedCheckBox}
                onClick={() => handleBannedUIChange(index)}>
              </div>
            </div>

            <div className={styles.mPCardValidate}>
              <button
                disabled={
                  (originalOrders[card.card_id] === card.order ||
                    !modifiedItems.has(card.card_id) ||
                    !card.UIBanned) &&
                  card.UIBanned === card.banned
                }
                onClick={() => validateChange(index)}
              >
                {t('validate-button')}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(BookletMP);
