import React, { useEffect, useState } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import MainTitle from "../../components/MainTitle";
import styles from "./CategoriesModal.module.scss";
import { CategoryScore } from "@shared/game";
import getApi from "../../api/axios";
import { useGlobalData } from "../../store/globalDataSlice";

interface StatsModalProps {
  show: boolean;
  handleClose: () => void;
  userId: number | undefined;
}

const getWordForm = (count: number) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (
    count === 0 ||
    (lastTwoDigits >= 10 && lastTwoDigits <= 20) ||
    lastDigit === 0 ||
    lastDigit >= 5
  ) {
    return "gier";
  } else if (lastDigit === 1) {
    return "gra";
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return "gry";
  }
};

const StatsModal: React.FC<StatsModalProps> = ({
  show,
  handleClose,
  userId,
}) => {
  const [avgCategoryPoints, setAvgCategoryPoints] = useState<CategoryScore[]>(
    []
  );
  const [gamesPerCategory, setGamesPerCategory] = useState<CategoryScore[]>([]);
  const [activeButton, setActiveButton] = useState<string>("points");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = (buttonType: string) => {
    setActiveButton(buttonType);
  };

  const categories = useGlobalData().categories;

  useEffect(() => {
    if (show && userId) {
      fetchCategoryStats();
    }
  }, [show, userId]);

  const findImageFromCategoryName = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.img : "";
  };

  const fetchCategoryStats = async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [avgResponse, gamesResponse] = await Promise.all([
        getApi().get(`history/stats/${userId}/category/avg`),
        getApi().get(`history/stats/${userId}/category/count`),
      ]);
      for (const category of avgResponse.data) {
        category.img = findImageFromCategoryName(category.category_name);
      }
      for (const category of gamesResponse.data) {
        category.img = findImageFromCategoryName(category.category_name);
      }
      avgResponse.data.sort(
        (a: CategoryScore, b: CategoryScore) => b.number - a.number
      );
      gamesResponse.data.sort(
        (a: CategoryScore, b: CategoryScore) => b.number - a.number
      );
      setAvgCategoryPoints(avgResponse.data);
      setGamesPerCategory(gamesResponse.data);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStats = () => {
    const statsData =
      activeButton === "points" ? avgCategoryPoints : gamesPerCategory;

    if (statsData.length === 0) {
      return <div className={styles.noGamesMessage}>Brak zagranych gier</div>;
    }

    return statsData.map((stat) => (
      <div key={stat.category_name} className={styles.statItem}>
        <div className={styles.imgName}>
          <img
            className={styles.categoryImage}
            src={stat.img ? `${stat.img}` : "/api/placeholder/50/50"}
            alt={stat.category_name}
          />
          <div className={styles.categoryName}>{stat.category_name}</div>
        </div>
        <div className={styles.categoryValue}>
          {activeButton === "points" ? (
            <span>{stat.number} pkt</span>
          ) : (
            <span>
              {stat.number} {getWordForm(stat.number)}
            </span>
          )}
        </div>
      </div>
    ));
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className={styles.customModal}
    >
      <ModalBody className={styles.settModal}>
        <MainTitle>Statystyki kategorii</MainTitle>
        <div className={styles.sortButtons}>
          <button
            className={`${styles.sortButton} ${
              activeButton === "points" ? styles.activeButton : ""
            }`}
            onClick={() => handleButtonClick("points")}
          >
            Względem średniej punktów
          </button>
          <button
            className={`${styles.sortButton} ${
              activeButton === "games" ? styles.activeButton : ""
            }`}
            onClick={() => handleButtonClick("games")}
          >
            Względem liczby gier
          </button>
        </div>
        {isLoading && <div className={styles.loadingMessage}>Ładowanie...</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.statsModalBox}>
          {!isLoading && !error && renderStats()}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default StatsModal;
