import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "@app/js/components/header/Header";
import BookletFormation from "@app/js/components/BookletFormation/BookletFormation";
import BookletStats from "@app/js/components/BookletStats/BookletStats";
import BookletBP from "@app/js/components/BookletBP/BookletBP";
import BookletMP from "@app/js/components/BookletMP/BookletMP";
import { useNavigate } from "react-router-dom";
import arrowBack from '@app/assets/icons/arrowBack.png';
import arrowNext from '@app/assets/icons/arrowNext.png';
import styles from "./greenIt.module.css";
import ExportPopup from "@app/js/components/PopUp/PopUp";
import BackgroundImg from "@app/js/components/BackgroundImage/BackgroundImg";

const GreenIt: React.FC = () => {
  const { t } = useTranslation('greenIt');
  const [page, setPage] = useState(1);
  const [animationVisible, setAnimationVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const redirectToPage = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchBooklet = async () => {
      const token = localStorage.getItem("token");
      if (!token || token === "undefined") {
        console.error("No token found in local storage");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/getBooklet?token=${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        throw new Error("Failed to fetch booklet");
      }

      const bookletData = await response.json();
      setUserId(bookletData.booklet.user_id.toString());
      console.log("bookletData", bookletData);
    };

    fetchBooklet();
  }, []);

  const nextPage = () => {
    setAnimationVisible(true);
    setPage(page === 1 ? 2 : 1);
    setTimeout(() => {
      setAnimationVisible(false);
    }, 500);
  };

  const previousPage = () => {
    setAnimationVisible(true);
    setPage(page === 1 ? 2 : 1);
    setTimeout(() => {
      setAnimationVisible(false);
    }, 500);
  };

  const fetchDataExport = async () => {
    const dataResponce = await fetch(
      `${import.meta.env.VITE_API_URL}/booklet/export/fetch/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("dataResponce type of ", typeof dataResponce);
    const dataFetch = await dataResponce.json();
    console.log("dataFetch", dataFetch);
    return dataFetch;
  };

  const handleExport = async (filename: string, format: string) => {
    console.log(
      "[green it] Exporting file:",
      filename,
      "in format ",
      format,
      userId
    );
    const data = await fetchDataExport();
    console.log("data", data);

    const payload = { filename, format, data };
    console.log("payload", payload);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/booklet/export`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(
          `[greenIT] Http error while exporting booklet], ${response.status}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting booklet", error);
      alert("Error exporting booklet");
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div>
      <Header />

      <div className={styles.carnetGreenITPage}>
        <div className={styles.carnetGreenITContainer}>
          <div className={styles.containerHeader}>
            <div className={styles.returnToPreviousPage} onClick={() => redirectToPage('/menu')}>
              <img src={arrowBack} />
              <span>{t('header.return')}</span>
            </div>
            <div className={styles.titlePageSwitch}>
              <h2>{t('header.title')}</h2>
              {page === 1 && (
                <div className={styles.goToNextPage} onClick={nextPage}>
                  <span>{t('header.next-page')}</span>
                  <img src={arrowNext} />
                </div>
              )}
              {page === 2 && (
                <div className={styles.goToPreviousPage} onClick={previousPage}>
                  <img src={arrowBack} />
                  <span>{t('header.previous-page')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Conditional rendering for the first page */}
          {page === 1 && (
            <div className={styles.pagesContainer}>
              <div className={styles.pageLeft}>
                <BookletStats />
              </div>
              <div className={styles.pageRight}>
                <BookletFormation />
              </div>
            </div>
          )}

          {/* Conditional rendering for the second page */}
          {page === 2 && (
            <div className={styles.pagesContainer}>
              <div className={styles.pageLeft}>
                <BookletBP userId={userId} />
              </div>
              <div className={styles.pageRight}>
                <BookletMP userId={userId} />
              </div>
            </div>
          )}

          <button onClick={togglePopup}>
            {t('export-button')}
          </button>

          {showPopup && userId && (
            <ExportPopup
              onClose={togglePopup}
              onSubmit={(filename, format) => {
                setPopupData({ filename, format });
                handleExport(filename, format);
              }}
              userId={userId}
            />
          )}
        </div>
      </div>
      <BackgroundImg/>
    </div>
  );
};

export default GreenIt;