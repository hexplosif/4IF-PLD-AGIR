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
  const [originalOrders] = useState<{
    [card_id: string]: number;
  }>({});
  const [modifiedItems, setModifiedItems] = useState(new Set());

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

        //Fetch best practice details
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

        // Filtrer les pratiques pour ne garder que celles dans la langue actuelle
        const filteredPractices = bestPracticeDetails.filter(practice =>
          practice.language === currentLanguage ||
          practice.language === currentLanguage.split('-')[0] // Pour gérer fr-FR -> fr
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

  const handleApplyUIChange = (index: number) => {
    const newData = [...data];
    const item = newData[index];
    // Mise à jour UI seulement - pas d'appel API
    item.UIApplied = !item.UIApplied;
    setData(newData);
    setModifiedItems(new Set(modifiedItems).add(item.card_id));
  };

  const syncApplyStateWithServer = async (index: number) => {
    const newData = [...data];
    const item = newData[index];
    const user_id = userId;

    // Déterminer l'action à effectuer en fonction de l'état UI vs serveur
    const action = item.UIApplied !== item.applied
      ? (item.UIApplied ? "addApply" : "removeApply")
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
      item.applied = item.UIApplied;
      setData([...newData]);

    } catch (error) {
      console.error("Failed to sync applied state with server:", error);
      // Restaurer l'état UI en cas d'erreur
      item.UIApplied = item.applied;
      setData([...newData]);
    }
  };

  const validateChange = async (index: number) => {
    const newData = [...data];
    const item = newData[index];
    const user_id = userId;

    try {
      // Étape 1: Synchroniser l'état "applied" avec le serveur
      await syncApplyStateWithServer(index);

      // Étape 2: Si la pratique est appliquée, mettre à jour la priorité
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
      <div className={styles.bPCardContainer}>
        {data.map((card, index) => (
          <div key={index} className={styles.bPCard}>

            <h3>{card.label}</h3>

            <div className={styles.bPCardPriority}>
              <span>{t('table-headers.priority-order')}</span>
              <div className={styles.bPCardPriorityButtons}>
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

            <div className={styles.bPCardApply}>
              <span>{t('table-headers.apply')}</span>
              <div
                className={card.UIApplied ? styles.appliedCheckBox : styles.unappliedCheckBox}
                onClick={() => handleApplyUIChange(index)}>
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
                onClick={() => validateChange(index)}
              >
                {t('validate-button')}
              </button>
            </div>

          </div>
        ))}
      </div>



      {/* <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => sortDataByColumn("title")}>
              <strong>{t('table-headers.practice')}</strong>
            </th>
            <th onClick={() => sortDataByColumn("order")}>
              <strong>{t('table-headers.priority-order')}</strong>
            </th>
            <th onClick={() => sortDataByColumn("applied")}>
              <strong>{t('table-headers.apply')}</strong>
            </th>
            <th>
              <strong>{t('table-headers.validate')}</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((card, index) => (
            <tr key={index}>
              <td>{card.label}</td>
              <td>
                <button
                  className={styles.button}
                  onClick={() => handleDecreaseOrder(index)}
                >
                  -
                </button>
                {card.order || ""}
                <button
                  className={styles.button}
                  onClick={() => handleIncreaseOrder(index)}
                >
                  +
                </button>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={card.UIApplied}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td>
                <button
                  disabled={
                    (originalOrders[card.card_id] === card.order ||
                      !modifiedItems.has(card.card_id) ||
                      !card.UIApplied) &&
                    card.UIApplied === card.applied
                  }
                  onClick={() => validateChange(index)}
                >
                  {t('validate-button')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default React.memo(BookletBP);
