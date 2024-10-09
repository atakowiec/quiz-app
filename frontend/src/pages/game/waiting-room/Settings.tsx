import { Breadcrumb } from "react-bootstrap";
import Meta from "../../../components/Meta";
import Sidebar, { SidebarItem } from "../../../components/SideBar";
import MainContainer from "../../../components/MainContainer";
import MainBox from "../../../components/MainBox";
import MainTitle from "../../../components/MainTitle";
import { IoArrowBack, IoHomeSharp, IoSettingsSharp } from "react-icons/io5";
import styles from "./Settings.module.scss";
import { useEffect, useRef, useState } from "react";
import { GameSettings, HelperType } from "@shared/game";
import { useSocket } from "../../../socket/useSocket";
import { useGlobalData } from "../../../store/globalDataSlice";
import CategoriesModal from "./CategoriesModal";
import HelpersModal from "./HelpersModal";
import { useNavigate } from "react-router-dom";

const Settings: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoHomeSharp, label: "Powrót", href: "/waiting-room" },
    { icon: IoSettingsSharp, label: "Ustawienia", href: "/settings" },
  ];

  const socket = useSocket();
  const navigate = useNavigate();

  // Load initial values from localStorage, or use default values
  const [number_of_rounds, setNumberOfRounds] = useState(() => {
    const savedValue = localStorage.getItem("number_of_rounds");
    return savedValue !== null ? Number(savedValue) : 2; // default value
  });

  const [number_of_questions_per_round, setNumberOfQuestions] = useState(() => {
    const savedValue = localStorage.getItem("number_of_questions_per_round");
    return savedValue !== null ? Number(savedValue) : 5; // default value
  });

  const [number_of_categories_per_voting, setNumberOfCategoriesInVoting] =
    useState(() => {
      const savedValue = localStorage.getItem(
        "number_of_categories_per_voting"
      );
      return savedValue !== null ? Number(savedValue) : 5; // default value
    });

  const [time_for_answer, setTimeForAnswer] = useState(() => {
    const savedValue = localStorage.getItem("time_for_answer");
    return savedValue !== null ? Number(savedValue) : 30; // default value
  });

  // if settings have been changed, send event to update this settings
  const prevSettings = useRef({
    number_of_rounds,
    number_of_questions_per_round,
    number_of_categories_per_voting,
    time_for_answer,
  });

  useEffect(() => {
    let updatedSettings: Partial<GameSettings> = {};
    if (prevSettings.current.number_of_rounds !== number_of_rounds)
      updatedSettings = { ...updatedSettings, number_of_rounds };
    if (
      prevSettings.current.number_of_questions_per_round !==
      number_of_questions_per_round
    )
      updatedSettings = { ...updatedSettings, number_of_questions_per_round };
    if (
      prevSettings.current.number_of_categories_per_voting !==
      number_of_categories_per_voting
    )
      updatedSettings = { ...updatedSettings, number_of_categories_per_voting };
    if (prevSettings.current.time_for_answer !== time_for_answer)
      updatedSettings = { ...updatedSettings, time_for_answer };

    if (Object.keys(updatedSettings).length > 0) {
      socket.emit("change_settings", updatedSettings);
    }

    // Update previous settings reference
    prevSettings.current = {
      number_of_rounds,
      number_of_questions_per_round,
      number_of_categories_per_voting,
      time_for_answer,
    };

    // Save updated settings to localStorage
    localStorage.setItem("number_of_rounds", number_of_rounds.toString());
    localStorage.setItem(
      "number_of_questions_per_round",
      number_of_questions_per_round.toString()
    );
    localStorage.setItem(
      "number_of_categories_per_voting",
      number_of_categories_per_voting.toString()
    );
    localStorage.setItem("time_for_answer", time_for_answer.toString());
  }, [
    number_of_rounds,
    number_of_questions_per_round,
    number_of_categories_per_voting,
    time_for_answer,
    socket,
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showLifelineModal, setShowLifelineModal] = useState(false);
  const handleModalShow = () => setShowModal(true);
  const handleModalHide = () => setShowModal(false);
  const handleLifelineModalShow = () => setShowLifelineModal(true);
  const handleLifelineModalHide = () => setShowLifelineModal(false);

  const categories = useGlobalData().categories.map((category) => ({
    ...category,
    img: category.img || "",
  }));

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleCategoryClick = (index: number) => {
    if (selectedCategories.includes(index)) {
      setSelectedCategories(selectedCategories.filter((i) => i !== index));
    } else {
      setSelectedCategories([...selectedCategories, index]);
    }
  };

  useEffect(() => {
    socket.emit("change_settings_categories", selectedCategories);
  }, [selectedCategories, socket]);

  const selectAllCategories = () => {
    setSelectedCategories(categories.map((_, index) => index));
  };

  const deselectAllCategories = () => {
    setSelectedCategories([]);
  };

  const [helperStates, setHelperStates] = useState<boolean[]>([
    true,
    true,
    true,
  ]);

  const helpersNames: HelperType[] = [
    "cheat_from_others",
    "extend_time",
    "fifty_fifty",
  ];

  const handleToggle = (index: number) => {
    const updatedStates = [...helperStates];
    updatedStates[index] = !updatedStates[index]; // Change state

    const blackListedHelpers = helpersNames.filter(
      (_, i) => !updatedStates[i]
    ) as HelperType[];

    socket.emit("change_settings_helpers", blackListedHelpers);
    setHelperStates(updatedStates); // Update state
  };

  const handleBackClick = () => {
    navigate("/waiting-room");
  };

  return (
    <>
      <Meta title={"Ustawienia"} />
      <Breadcrumb title="Ustawienia" />
      <Sidebar items={sidebarItems} />
      <MainContainer className={styles.sidebarContainer}>
        <MainBox>
          <MainTitle className={styles.Title}>Ustawienia gry</MainTitle>
          <div className={styles.settingsBox}>
            <div className={styles.singleSetting}>
              <div className={styles.settingsTitle}>Liczba rund</div>
              <div className={styles.choiceBox}>
                <button
                  className={styles.changeButton}
                  onClick={() =>
                    setNumberOfRounds(Math.max(1, number_of_rounds - 1))
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  value={number_of_rounds}
                  className={styles.choiceValue}
                  onChange={(e) => {
                    const value = Math.min(
                      Math.max(1, Number(e.target.value)),
                      25
                    ); // Limit value between 1 and 25
                    setNumberOfRounds(value);
                  }}
                />
                <button
                  className={styles.changeButton}
                  onClick={() =>
                    setNumberOfRounds(Math.min(25, number_of_rounds + 1))
                  }
                >
                  +
                </button>
              </div>
            </div>
            <div className={styles.singleSetting}>
              <div className={styles.settingsTitle}>Liczba pytań na rundę</div>
              <div className={styles.choiceBox}>
                <button
                  className={styles.changeButton}
                  onClick={() =>
                    setNumberOfQuestions(
                      Math.max(1, number_of_questions_per_round - 1)
                    )
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  value={number_of_questions_per_round}
                  className={styles.choiceValue}
                  onChange={(e) => {
                    const value = Math.min(
                      Math.max(1, Number(e.target.value)),
                      25
                    ); // Limit value between 1 and 25
                    setNumberOfQuestions(value);
                  }}
                />
                <button
                  className={styles.changeButton}
                  onClick={() =>
                    setNumberOfQuestions(
                      Math.min(25, number_of_questions_per_round + 1)
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
            <div className={styles.singleSetting}>
              <div className={styles.settingsTitle}>
                Liczba kategorii podczas głosowania
              </div>
              <div className={styles.choiceBox}>
                <button
                  className={styles.changeButton}
                  onClick={() =>
                    setNumberOfCategoriesInVoting(
                      Math.max(1, number_of_categories_per_voting - 1)
                    )
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  value={number_of_categories_per_voting}
                  className={styles.choiceValue}
                  onChange={(e) => {
                    const value = Math.min(
                      Math.max(1, Number(e.target.value)),
                      10
                    ); // Limit value between 1 and 10
                    setNumberOfCategoriesInVoting(value);
                  }}
                />
                <button
                  className={styles.changeButton}
                  onClick={() =>
                    setNumberOfCategoriesInVoting(
                      Math.min(10, number_of_categories_per_voting + 1)
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
            <div className={styles.singleSetting}>
              <div className={styles.settingsTitle}>
                Czas na udzielenie odpowiedzi
              </div>
              <div className={styles.choiceBox}>
                <button
                  className={styles.changeButton}
                  onClick={() =>
                    setTimeForAnswer(Math.max(1, time_for_answer - 1))
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  value={time_for_answer}
                  className={styles.choiceValue}
                  onChange={(e) => {
                    const value = Math.min(
                      Math.max(1, Number(e.target.value)),
                      120
                    ); // Limit value between 1 and 120
                    setTimeForAnswer(value);
                  }}
                />
                <button
                  className={styles.changeButton}
                  onClick={() =>
                    setTimeForAnswer(Math.min(120, time_for_answer + 1))
                  }
                >
                  +
                </button>
              </div>
            </div>
            <div className={styles.settingsButtons}>
              <button className={styles.settings2} onClick={handleBackClick}>
                <IoArrowBack /> Powrót
              </button>
              <button className={styles.settings} onClick={handleModalShow}>
                Wybór kategorii
              </button>
              <button
                className={styles.settings}
                onClick={handleLifelineModalShow}
              >
                Ustawienia kół ratunkowych
              </button>
            </div>
          </div>
        </MainBox>
      </MainContainer>
      {/* Modal Kategorii */}
      <CategoriesModal
        show={showModal}
        handleClose={handleModalHide}
        categories={categories}
        selectedCategories={selectedCategories}
        handleCategoryClick={handleCategoryClick}
        selectAllCategories={selectAllCategories}
        deselectAllCategories={deselectAllCategories}
      />

      {/* Modal Ustawień Kół Ratunkowych */}
      <HelpersModal
        show={showLifelineModal}
        handleClose={handleLifelineModalHide}
        helperStates={helperStates}
        handleToggle={handleToggle}
      />
    </>
  );
};

export default Settings;
