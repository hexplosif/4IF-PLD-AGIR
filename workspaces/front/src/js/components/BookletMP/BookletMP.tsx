import React, { useEffect, useState } from "react";
import styles from "./BookletMP.module.css";
interface BookletMPProps {
  userId: string | null;
}

const BookletMP: React.FC<BookletMPProps> = ({ userId }) =>  {
  const [data, setData] = useState([]);
  //const [userId, setUserId] = useState<string | null>(null);
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

        const initializedData = badPracticeDetails.map((item) => {
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
  }, []);

  const handleCheckboxChange = (index: number) => {
    const newData = [...data];
    newData[index].UIBanned = !newData[index].UIBanned;
    setData(newData);
  };

  const handleBannedChange = async (index: number) => {
    const newData = [...data];
    const item = newData[index];
    // Determine the action based on the current state of the checkbox
    const action = item.banned ? "removeBan" : "addBan";

    const user_id = userId;

    try {
      // Construct the URL dynamically based on the action
      const url = `${import.meta.env.VITE_API_URL}/booklet/${action}/${item.card_id}`;

      // Prepare the request body
      const bookletDto = { user_id, order: newData[index].order };

      // Perform the HTTP request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookletDto),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the item's banned status locally
      item.banned = !item.banned; // Update the actual banned status (=/= from UIBanned)
      if (!item.banned) {
        item.order = 1; // Reset the order when unbanning
      }
      setData(newData);
    } catch (error) {
      console.error("Failed to update ban status:", error);
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
      case "banned":
        newData.sort((a, b) => (a.banned === b.banned ? 0 : a.banned ? -1 : 1));
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
    console.log(
      "item id is ",
      item.card_id,
      "for user id ",
      user_id,
      "and item is banned ",
      item.banned,
      "and item UI banned",
      item.UIBanned
    );

    if (item.banned === true && item.UIBanned === true) {
      const url = `${import.meta.env.VITE_API_URL}/booklet/updatePriority/${item.card_id}`;

      const bookletDto = { user_id, order: item.order, typePractices: "bad" };

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
    } else {
      console.log(
        "case where the user has banned the practice front side but not validated it yet"
      );
      //case where the user has banned the practice front side but not validated it yet
      handleBannedChange(index);
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <strong>Mes mauvaises pratiques</strong>
      </label>
      <br />
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => sortDataByColumn("title")}>
              <strong>Pratique</strong>
            </th>
            <th onClick={() => sortDataByColumn("order")}>
              <strong>Ordre de priorité</strong>
            </th>
            <th onClick={() => sortDataByColumn("banned")}>
              <strong>Bannie</strong>
            </th>
            <th>
              <strong>Valider la modification</strong>
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
                  checked={card.UIBanned}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td>
                <button
                  disabled={
                    (originalOrders[card.card_id] === card.order ||
                      !modifiedItems.has(card.card_id) ||
                      !card.UIBanned) &&
                    card.UIBanned === card.banned
                  }
                  onClick={() => validateChange(index)}
                >
                  Valider
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(BookletMP);
