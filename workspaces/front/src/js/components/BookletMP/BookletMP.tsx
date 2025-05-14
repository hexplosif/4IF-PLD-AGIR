import React, { useEffect, useState } from "react";
import styles from "./BookletMP.module.css";
import { useTranslation } from "react-i18next";
interface BookletMPProps {
  userId: string | null;
}

const BookletMP: React.FC<BookletMPProps> = ({ userId }) =>  {
  const { t, i18n } = useTranslation('greenIt', {keyPrefix:"booklet-bp-mp"});
  const currentLanguage = i18n.language;

  const [data, setData] = useState([]);
  const [originalOrders] = useState<{
    [card_id: string]: number;
  }>({});
  const [modifiedItems, setModifiedItems] = useState(new Set());

  // Nouvel état pour le filtrage
  const [filter, setFilter] = useState('all'); // 'all', 'banned', 'notBanned'
  // Nouvel état pour l'ordre de tri
  const [sortOrder, setSortOrder] = useState('priority-desc'); // 'priority-desc', 'priority-asc'
  const [filteredData, setFilteredData] = useState([]);

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
        
        const filteredPractices = badPracticeDetails.filter(practice =>
          practice.language === currentLanguage ||
          practice.language === currentLanguage.split('-')[0]
        );

        const initializedData = filteredPractices.map((item) => {
          let isUserBanned = false;
          let order = 1;
          practicesBanned.forEach((practice) => {
            if (practice.id === item.card_id) {
              isUserBanned = true;
              order = practice.priority;
            }
          });
          return {
            ...item,
            order: order,
            UIBanned: isUserBanned,
            banned: isUserBanned,
          };
        });
        setData(initializedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userId, currentLanguage]);

  // Nouvel effet pour appliquer les filtres et tri
  useEffect(() => {
    let result = [...data];
    
    if (filter === 'banned') {
      result = result.filter(item => item.UIBanned);
    } else if (filter === 'notBanned') {
      result = result.filter(item => !item.UIBanned);
    }
    
    if (sortOrder === 'priority-desc') {
      result.sort((a, b) => b.order - a.order);
    } else if (sortOrder === 'priority-asc') {
      result.sort((a, b) => a.order - b.order);
    }
    
    setFilteredData(result);
  }, [data, filter, sortOrder]);

  const handleBannedUIChange = (index: number) => {
    const newData = [...data];
    const item = newData[index];
    item.UIBanned = !item.UIBanned;
    setData(newData);
    setModifiedItems(new Set(modifiedItems).add(item.card_id));
  };

  const syncBannedStateWithServer = async (index: number) => {
    const newData = [...data];
    const item = newData[index];
    const user_id = userId;
    
    const action = item.UIBanned !== item.banned
      ? (item.UIBanned ? "addBan" : "removeBan")
      : null;
      
    if (!action) return;
    
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
      
      item.banned = item.UIBanned;
      setData([...newData]);
      
    } catch (error) {
      console.error("Failed to sync banned state with server:", error);
      item.UIBanned = item.banned;
      setData([...newData]);
    }
  };

  const validateChange = async (index: number) => {
    const newData = [...data];
    const item = newData[index];
    const user_id = userId;

    try {
      await syncBannedStateWithServer(index);
      
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
      
      {/* Nouveaux contrôles de filtrage et tri */}
      <div className={styles.filterControls}>
        <div className={styles.filterGroup}>
          <span>{t('filters.show')}:</span>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">{t('filters.all')}</option>
            <option value="banned">{t('filters.banned-only')}</option>
            <option value="notBanned">{t('filters.not-banned-only')}</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <span>{t('filters.sort-by')}:</span>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="priority-desc">{t('filters.priority-high-to-low')}</option>
            <option value="priority-asc">{t('filters.priority-low-to-high')}</option>
          </select>
        </div>
      </div>

      <div className={styles.mPCardContainer}>
        {filteredData.map((card, index) => (
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
