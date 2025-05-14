import React, { useEffect, useState } from "react";
import styles from "./BookletBP.module.css";
import { useTranslation } from "react-i18next";

interface BookletBPProps {
  userId: string | null;
}

const BookletBP: React.FC<BookletBPProps> = ({ userId }) => {
  const { t, i18n } = useTranslation('greenIt', { keyPrefix: "booklet-bp-mp" });
  const currentLanguage = i18n.language;

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [originalOrders] = useState<{
    [card_id: string]: number;
  }>({});
  const [modifiedItems, setModifiedItems] = useState(new Set());

  const [filter, setFilter] = useState('all'); // 'all', 'applied', 'notApplied'
  const [sortOrder, setSortOrder] = useState('priority-desc'); // 'priority-desc', 'priority-asc'

  useEffect(() => {
    const fetchData = async () => {
      try {

        const practicesResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/booklet/applied-practices?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const practicesData = await practicesResponse.json();

        console.log("practicesData", practicesData);
        const practicesApplied = practicesData.practices;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/booklet/good-practice-details`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(`Error: ${response.status} ${response.statusText}`);
          throw new Error("Failed to fetch best practice details");
        }
        const bestPracticeDetails = await response.json();

        console.log("bestPracticeDetails", bestPracticeDetails);

        const filteredPractices = bestPracticeDetails.filter(practice =>
          practice.language === currentLanguage ||
          practice.language === currentLanguage.split('-')[0]
        );

        const initializedData = filteredPractices.map((item) => {
          let isUserApplied = false;
          let order = 1;

          practicesApplied.forEach((practice) => {
            if (practice.id === item.card_id) {
              isUserApplied = true;
              order = practice.priority;
            }
          });

          return {
            ...item,
            order: order,
            UIApplied: isUserApplied,
            applied: isUserApplied,
          };
        });

        setData(initializedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userId, currentLanguage]);

  useEffect(() => {
    let result = [...data];

    if (filter === 'applied') {
      result = result.filter(item => item.UIApplied);
    } else if (filter === 'notApplied') {
      result = result.filter(item => !item.UIApplied);
    }

    if (sortOrder === 'priority-desc') {
      result.sort((a, b) => b.order - a.order);
    } else if (sortOrder === 'priority-asc') {
      result.sort((a, b) => a.order - b.order);
    }

    setFilteredData(result);
  }, [data, filter, sortOrder]);

  const handleApplyUIChange = (index: number) => {
    const newData = [...data];
    const item = newData[index];
    item.UIApplied = !item.UIApplied;
    setData(newData);
    setModifiedItems(new Set(modifiedItems).add(item.card_id));
  };

  const syncApplyStateWithServer = async (index: number) => {
    const newData = [...data];
    const item = newData[index];
    const user_id = userId;

    const action = item.UIApplied !== item.applied
      ? (item.UIApplied ? "addApply" : "removeApply")
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

      item.applied = item.UIApplied;
      setData([...newData]);

    } catch (error) {
      console.error("Failed to sync applied state with server:", error);
      item.UIApplied = item.applied;
      setData([...newData]);
    }
  };

  const validateChange = async (index: number) => {
    const newData = [...data];
    const item = newData[index];
    const user_id = userId;

    try {
      await syncApplyStateWithServer(index);

      if (item.UIApplied) {
        const url = `${import.meta.env.VITE_API_URL}/booklet/updatePriority/${item.card_id}`;
        const bookletDto = {
          user_id: user_id,
          order: item.order,
          typePractices: "good",
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
      case "applied":
        newData.sort((a, b) =>
          a.applied === b.applied ? 0 : a.applied ? -1 : 1
        );
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
    <div className={styles.bookletBPContainer}>
      <h3>{t('title-bp')}</h3>

      <div className={styles.filterControls}>
        <div className={styles.filterGroup}>
          <span>{t('filters.show')}:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">{t('filters.all')}</option>
            <option value="applied">{t('filters.applied-only')}</option>
            <option value="notApplied">{t('filters.not-applied-only')}</option>
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

      <div className={styles.bPCardContainer}>
        {filteredData.map((card, index) => (
          <div key={card.card_id} className={styles.bPCard}>
            <h3>{card.label}</h3>

            <div className={styles.bPCardPriority}>
              <span>{t('table-headers.priority-order')}</span>
              <div className={styles.bPCardPriorityButtons}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(priority => (
                  <div
                    key={priority}
                    className={card.order === priority ? styles.selectedPriority : styles.unselectedPriority}
                    onClick={() => {
                      const originalIndex = data.findIndex(item => item.card_id === card.card_id);
                      handlePriorityChange(originalIndex, priority);
                    }}
                  >
                    {priority}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.bPCardApply}>
              <span>{t('table-headers.apply')}</span>
              <div
                className={card.UIApplied ? styles.appliedCheckBox : styles.unappliedCheckBox}
                onClick={() => {
                  const originalIndex = data.findIndex(item => item.card_id === card.card_id);
                  handleApplyUIChange(originalIndex);
                }}>
              </div>
            </div>

            <div className={styles.bPCardValidate}>
              <button
                disabled={
                  (originalOrders[card.card_id] === card.order ||
                    !modifiedItems.has(card.card_id) ||
                    !card.UIApplied) &&
                  card.UIApplied === card.applied
                }
                onClick={() => {
                  const originalIndex = data.findIndex(item => item.card_id === card.card_id);
                  validateChange(originalIndex);
                }}
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

export default React.memo(BookletBP);
