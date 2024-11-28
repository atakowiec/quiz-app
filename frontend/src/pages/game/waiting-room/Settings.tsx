import { Breadcrumb } from "react-bootstrap";
import Meta from "../../../components/Meta";
import Sidebar from "../../../components/SideBar";
import MainContainer from "../../../components/MainContainer";
import MainBox from "../../../components/MainBox";
import MainTitle from "../../../components/MainTitle";
import { IoArrowBack } from "react-icons/io5";
import styles from "./Settings.module.scss";
import { FC, useEffect, useRef, useState } from "react";
import { GameSettings, HelperType } from "@shared/game";
import { useSocket } from "../../../socket/useSocket";
import { useGlobalData } from "../../../store/globalDataSlice";
import CategoriesModal from "./CategoriesModal";
import HelpersModal from "./HelpersModal";
import { useGame } from "../../../store/gameSlice.ts";
import { useNavigate } from "react-router-dom";
import InviteModal from "./InviteModal.tsx";
import { useGameSidebarItems } from "../../../hooks/useSidebarItems.ts";

const DEBOUNCE_DELAY = 500;

const HELPER_NAMES: HelperType[] = [
  "cheat_from_others",
  "extend_time",
  "fifty_fifty",
];

const Settings: FC = () => {
  const sidebarItems = useGameSidebarItems(() => setShowInviteModal(true));

  const socket = useSocket();
  const game = useGame();
  const navigate = useNavigate();
  const isOwner = game?.owner?.username === game?.player?.username;

  const [showModal, setShowModal] = useState(false);
  const [showLifelineModal, setShowLifelineModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [numberOfRounds, setNumberOfRounds] = useState(game?.settings.number_of_rounds ?? 5);
  const [questionsPerRound, setQuestionsPerRound] = useState(game?.settings.number_of_questions_per_round ?? 5);
  const [categoriesPerVoting, setCategoriesPerVoting] = useState(game?.settings.number_of_categories_per_voting ?? 5);
  const [timeForAnswer, setTimeForAnswer] = useState(game?.settings.time_for_answer ?? 30);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = useGlobalData().categories.map((category) => ({
    ...category,
    img: category.img || "",
  }));

  function onNumberOfRoundsChange(value: number) {
    value = Math.min(Math.max(value, 1), 25);
    setNumberOfRounds(value);
  }

  function onQuestionsPerRoundChange(value: number) {
    value = Math.min(Math.max(value, 1), 25);
    setQuestionsPerRound(value);
  }

  function onCategoriesPerVotingChange(value: number) {
    value = Math.min(Math.max(value, 1), 20);
    setCategoriesPerVoting(value);
  }

  function onTimeForAnswerChange(value: number) {
    value = Math.min(Math.max(value, 1), 120);
    setTimeForAnswer(value);
  }

  useEffect(() => {
    const updatedSettings = {} as GameSettings;

    if (numberOfRounds !== game?.settings.number_of_rounds) {
      updatedSettings.number_of_rounds = numberOfRounds;
    }

    if (questionsPerRound !== game?.settings.number_of_questions_per_round) {
      updatedSettings.number_of_questions_per_round = questionsPerRound;
    }

    if (categoriesPerVoting !== game?.settings.number_of_categories_per_voting) {
      updatedSettings.number_of_categories_per_voting = categoriesPerVoting;
    }

    if (timeForAnswer !== game?.settings.time_for_answer) {
      updatedSettings.time_for_answer = timeForAnswer;
    }

    if (Object.keys(updatedSettings).length > 0) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        socket.emit("change_settings", updatedSettings);
      }, DEBOUNCE_DELAY);
    }
  }, [timeForAnswer, categoriesPerVoting, questionsPerRound, numberOfRounds]);

  const [selectedCategories, setSelectedCategories] = useState<number[]>(game?.settings?.category_whitelist || []);
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

  const [helperStates, setHelperStates] = useState<boolean[]>(
    game?.settings?.blackListedHelpers
      ? HELPER_NAMES.map((helper) => !game?.settings?.blackListedHelpers?.includes(helper))
      : [true, true, true]
  );

  const handleToggle = (index: number) => {
    const updatedStates = [...helperStates];
    updatedStates[index] = !updatedStates[index]; // Zmiana stanu

    const blackListedHelpers = HELPER_NAMES.filter(
      (_, i) => !updatedStates[i]
    ) as HelperType[];

    socket.emit("change_settings_helpers", blackListedHelpers);
    setHelperStates(updatedStates); // Aktualizacja stanu
  };

  const handleGoToWaitingRoom = () => {
    navigate("/waiting-room");
  };

  return (
    <>
      <Meta title={"Ustawienia"}/>
      <Breadcrumb title="Ustawienia"/>
      <Sidebar items={sidebarItems}/>
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
                      onClick={() => onNumberOfRoundsChange(numberOfRounds - 1)}>
                      -
                    </button>
                    <input
                      type="number"
                      value={numberOfRounds}
                      className={styles.choiceValue}
                      onChange={(e) => onNumberOfRoundsChange(Number(e.target.value))}
                    />
                    <button
                      className={styles.changeButton}
                      onClick={() => onNumberOfRoundsChange(numberOfRounds + 1)}>
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
                      onClick={() => onQuestionsPerRoundChange(questionsPerRound - 1)}>
                      -
                    </button>
                    <input
                      type="number"
                      value={questionsPerRound}
                      className={styles.choiceValue}
                      onChange={(e) => onQuestionsPerRoundChange(Number(e.target.value))}
                    />
                    <button
                      className={styles.changeButton}
                      onClick={() => onQuestionsPerRoundChange(questionsPerRound + 1)}>
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
                      onClick={() => onCategoriesPerVotingChange(categoriesPerVoting - 1)}>
                      -
                    </button>
                    <input
                      type="number"
                      value={categoriesPerVoting}
                      className={styles.choiceValue}
                      onChange={(e) => onCategoriesPerVotingChange(Number(e.target.value))}
                    />
                    <button
                      className={styles.changeButton}
                      onClick={() => onCategoriesPerVotingChange(categoriesPerVoting + 1)}>
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
                      onClick={() => onTimeForAnswerChange(timeForAnswer - 1)}>
                      -
                    </button>
                    <input
                      type="number"
                      value={timeForAnswer}
                      className={styles.choiceValue}
                      onChange={(e) => onTimeForAnswerChange(Number(e.target.value))}
                    />
                    <button
                      className={styles.changeButton}
                      onClick={() => onTimeForAnswerChange(timeForAnswer + 1)}>
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
                  <IoArrowBack/> Powrót
                </button>
                <button className={styles.settings} onClick={() => setShowModal(true)}>
                  Wybór kategorii
                </button>
                <button
                  className={styles.settings}
                  onClick={() => setShowLifelineModal(true)}
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
        handleClose={() => setShowModal(false)}
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
        handleClose={() => setShowLifelineModal(false)}
        helperStates={helperStates}
        handleToggle={handleToggle}
        isOwner={isOwner}
        gameSettings={game?.settings}
        helpersNames={HELPER_NAMES}
      />
      <InviteModal show={showInviteModal} onClose={() => setShowInviteModal(false)}/>
    </>
  );
};

export default Settings;
