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
import { useGame } from "../../../store/gameSlice.ts";
import { useNavigate } from "react-router-dom";

const Settings: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoHomeSharp, label: "Powrót", href: "/waiting-room" },
    { icon: IoSettingsSharp, label: "Ustawienia", href: "/settings" },
  ];

  const socket = useSocket();
  const game = useGame();
  const navigate = useNavigate();
  const isOwner = game?.owner?.username === game?.player?.username;

  const [number_of_rounds, setNumberOfRounds] = useState(
    game?.settings.number_of_rounds || 5
  );
  const [number_of_questions_per_round, setNumberOfQuestions] = useState(
    game?.settings.number_of_questions_per_round || 5
  );
  const [number_of_categories_per_voting, setNumberOfCategoriesInVoting] =
    useState(game?.settings.number_of_categories_per_voting || 5);
  const [time_for_answer, setTimeForAnswer] = useState(
    game?.settings.time_for_answer || 30
  );

  const DEBOUNCE_DELAY = 50;
  // if settings has been changed send event to update this settings
  const initialSettings = useRef({
    number_of_rounds,
    number_of_questions_per_round,
    number_of_categories_per_voting,
    time_for_answer,
  });
  // Refs for previous settings and debounce timeout
  const prevSettings = useRef(initialSettings.current);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Check if updatedSettings differs from initial settings
    const settingsChanged =
      JSON.stringify(updatedSettings) !==
      JSON.stringify(initialSettings.current);

    if (settingsChanged && Object.keys(updatedSettings).length > 0) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        socket.emit("change_settings", updatedSettings);
      }, DEBOUNCE_DELAY);
    }

    // Update previous settings reference
    prevSettings.current = {
      number_of_rounds,
      number_of_questions_per_round,
      number_of_categories_per_voting,
      time_for_answer,
    };

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
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

  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    game?.settings?.category_whitelist || []
  );
  const initialSelectedCategories = useRef(selectedCategories);

  const handleCategoryClick = (index: number) => {
    if (selectedCategories.includes(index)) {
      setSelectedCategories(selectedCategories.filter((i) => i !== index));
    } else {
      setSelectedCategories([...selectedCategories, index]);
    }
  };

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Check if selectedCategories has changed from its initial state
    const categoriesChanged =
      JSON.stringify(selectedCategories) !==
      JSON.stringify(initialSelectedCategories.current);

    if (categoriesChanged) {
      debounceTimeoutRef.current = setTimeout(() => {
        socket.emit("change_settings_categories", selectedCategories);
      }, DEBOUNCE_DELAY);
    }

    // Update initial selected categories reference
    initialSelectedCategories.current = selectedCategories;

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [selectedCategories, socket]);

  const selectAllCategories = () => {
    setSelectedCategories(categories.map((_, index) => index));
  };

  const deselectAllCategories = () => {
    setSelectedCategories([]);
  };
  const helpersNames: HelperType[] = [
    "cheat_from_others",
    "extend_time",
    "fifty_fifty",
  ];

  const [helperStates, setHelperStates] = useState<boolean[]>(
    game?.settings?.blackListedHelpers
      ? helpersNames.map(
          (helper) => !game?.settings?.blackListedHelpers?.includes(helper)
        )
      : [true, true, true]
  );

  const handleToggle = (index: number) => {
    const updatedStates = [...helperStates];
    updatedStates[index] = !updatedStates[index]; // Zmiana stanu

    const blackListedHelpers = helpersNames.filter(
      (_, i) => !updatedStates[i]
    ) as HelperType[];

    console.log("new", blackListedHelpers);
    socket.emit("change_settings_helpers", blackListedHelpers);
    setHelperStates(updatedStates); // Aktualizacja stanu
  };

  const handleGoToWaitingRoom = () => {
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
                {isOwner ? (
                  <>
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
                        if (Number(e.target.value) > 25) e.target.value = "25";
                        else if (Number(e.target.value) < 1)
                          e.target.value = "1";
                        setNumberOfRounds(Number(e.target.value));
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
                  </>
                ) : (
                  <div className={styles.choiceValue}>
                    {game?.settings.number_of_rounds}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.singleSetting}>
              <div className={styles.settingsTitle}>Liczba pytań na rundę</div>
              <div className={styles.choiceBox}>
                {isOwner ? (
                  <>
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
                        if (Number(e.target.value) > 25) e.target.value = "25";
                        else if (Number(e.target.value) < 1)
                          e.target.value = "1";
                        setNumberOfQuestions(Number(e.target.value));
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
                  </>
                ) : (
                  <div className={styles.choiceValue}>
                    {game?.settings.number_of_questions_per_round}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.singleSetting}>
              <div className={styles.settingsTitle}>
                Liczba kategorii podczas głosowania
              </div>
              <div className={styles.choiceBox}>
                {isOwner ? (
                  <>
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
                        if (Number(e.target.value) > 10) e.target.value = "10";
                        else if (Number(e.target.value) < 1)
                          e.target.value = "1";
                        setNumberOfCategoriesInVoting(Number(e.target.value));
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
                  </>
                ) : (
                  <div className={styles.choiceValue}>
                    {game?.settings.number_of_categories_per_voting}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.singleSetting}>
              <div className={styles.settingsTitle}>
                Czas na udzielenie odpowiedzi
              </div>
              <div className={styles.choiceBox}>
                {isOwner ? (
                  <>
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
                        if (Number(e.target.value) > 120)
                          e.target.value = "120";
                        else if (Number(e.target.value) < 1)
                          e.target.value = "1";
                        setTimeForAnswer(Number(e.target.value));
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
                  </>
                ) : (
                  <div className={styles.choiceValue}>
                    {game?.settings.time_for_answer}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.settingsButtons}>
              <>
                <button
                  className={styles.settings}
                  onClick={handleGoToWaitingRoom}
                >
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
              </>
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
        isOwner={isOwner}
        gameSettings={game?.settings}
      />

      {/* Modal Ustawień Kół Ratunkowych */}
      <HelpersModal
        show={showLifelineModal}
        handleClose={handleLifelineModalHide}
        helperStates={helperStates}
        handleToggle={handleToggle}
        isOwner={isOwner}
        gameSettings={game?.settings}
        helpersNames={helpersNames}
      />
    </>
  );
};

export default Settings;
