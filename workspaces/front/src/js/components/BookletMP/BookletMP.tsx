import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BookletMP.module.css";

const BookletMP: React.FC = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("------------useEffect MP--------");
        const token = localStorage.getItem("token");
        if (!token || token === "undefined") {
          console.error("No token found in local storage");
          return;
        }
        // On récupère le carnet de l'utilisateur
        const bookletResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/users/getBooklet?token=${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!bookletResponse.ok) {
          console.error(
            `Error: ${bookletResponse.status} ${bookletResponse.statusText}`
          );
          throw new Error("Failed to fetch booklet");
        }

        const bookletData = await bookletResponse.json();
        const user_id = bookletData.booklet.user_id.toString();

        // Récupère les pratiques bannies par l'utilisateur
        const practicesResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/booklet/banned-practices?user_id=${user_id}`,
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
          // Check if the practice is banned by iterating over practicesBanned
          practicesBanned.forEach((practice) => {
            if (practice.id === item.card_id) {
              isUserBanned = true; // Found a match, set to true
            }
          });

          // Return the item with the banned property set based on the check
          return {
            ...item,
            order: 1, // Default order
            banned: isUserBanned, // Explicitly set to true if matched
          };
        });

        setData(initializedData);
        console.log("initializeData", initializedData);
      } catch (error) {
        console.error(error);
        // Handle error appropriately
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (index: number) => {
    const newData = [...data];
    const item = newData[index];
    // Only update if the banned status is actually changing
    if (item.banned !== !item.banned) {
      item.banned = !item.banned;
      setData(newData);
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
  };

  const handleDecreaseOrder = (index: number) => {
    const newData = [...data];
    if (newData[index].order !== null && newData[index].order > 1) {
      newData[index].order--;
    }
    setData(newData);
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

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <strong>Mes mauvaises pratiques</strong>
        <i> (A implémenter)</i>
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
                  checked={card.banned}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(BookletMP);
