import React, { useEffect, useState } from "react";
import styles from "./BookletBP.module.css";
import { useTranslation } from "react-i18next";
interface BookletBPProps {
  userId: string | null;
}

const BookletBP: React.FC<BookletBPProps> = ({ userId }) => {
  const { t } = useTranslation('greenIt', {keyPrefix:"booklet-bp-mp"});

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

        const initializedData = bestPracticeDetails.map((item) => {
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
  }, []);

  const handleCheckboxChange = (index: number) => {
    const newData = [...data];
    newData[index].UIApplied = !newData[index].UIApplied;
    setData(newData);
  };

  const handleApplyChange = async (index: number) => {
    const newData = [...data];
    const item = newData[index];
    const action = item.applied ? "removeApply" : "addApply";

    const user_id = userId;

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

      item.applied = !item.applied;
      if (!item.applied) {
        item.order = 1;
      }

      setData(newData);
    } catch (error) {
      console.error("Failed to update practice", error);
    }
  };

  const handleIncreaseOrder = (index: number) => {
    const newData = [...data];
    if (newData[index].order === null) {
      newData[index].order = 1;
    } else {
      newData[index].order++;
    }
    setData(newData);
    setModifiedItems(new Set(modifiedItems).add(newData[index].card_id));
  };

  const handleDecreaseOrder = (index: number) => {
    const newData = [...data];
    if (newData[index].order !== null && newData[index].order > 1) {
      newData[index].order--;
    }
    setData(newData);
    setModifiedItems(new Set(modifiedItems).add(newData[index].card_id));
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

  const validateChange = async (index: number) => {
    const newData = [...data];
    const item = newData[index];
    const user_id = userId;

    if (item.applied === true && item.UIApplied === true) {
      const url = `${import.meta.env.VITE_API_URL}/booklet/updatePriority/${item.card_id}`;
      const bookletDto = {
        user_id: user_id,
        order: item.order,
        typePractices: "good",
      };
      const responce = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookletDto),
      });

      if (!responce.ok) {
        throw new Error("HTTP error, status = " + responce.status);
      }
    } else {
      console.log(
        "case where user has applied a practice frontside but not backend"
      );
      handleApplyChange(index);
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <strong>{t('title-bp')}</strong>
      </label>
      <br />
      <table className={styles.table}>
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
      </table>
    </div>
  );
};

export default React.memo(BookletBP);
