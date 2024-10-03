import { Breadcrumb, Modal, ModalBody } from "react-bootstrap";
import Meta from "../../../components/Meta";
import Sidebar, { SidebarItem } from "../../../components/SideBar";
import MainContainer from "../../../components/MainContainer";
import MainBox from "../../../components/MainBox";
import MainTitle from "../../../components/MainTitle";
import { IoHomeSharp, IoSettingsSharp } from "react-icons/io5";
import styles from "./Settings.module.scss";
import { useEffect, useRef, useState } from "react";
import { FaCheckSquare } from "react-icons/fa";
import { FaSquare } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineMoreTime } from "react-icons/md";
import { MdQueryStats } from "react-icons/md";
import { GameSettings, HelperType } from "@shared/game";
import { useSocket } from "../../../socket/useSocket";
import { useGlobalData } from "../../../store/globalDataSlice";

const Settings: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoHomeSharp, label: "Powrót", href: "/waiting-room" },
    { icon: IoSettingsSharp, label: "Ustawienia", href: "/settings" },
  ];

  const socket = useSocket();

  const [number_of_rounds, setNumberOfRounds] = useState(2);
  const [number_of_questions_per_round, setNumberOfQuestions] = useState(5);
  const [number_of_categories_per_voting, setNumberOfCategoriesInVoting] =
    useState(5);
  const [time_for_answer, setTimeForAnswer] = useState(30);

  // if settings has been changed send event to update this settings
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

    prevSettings.current = {
      number_of_rounds,
      number_of_questions_per_round,
      number_of_categories_per_voting,
      time_for_answer,
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

  const categories = useGlobalData().categories;

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
    updatedStates[index] = !updatedStates[index]; // Zmiana stanu

    const blackListedHelpers = helpersNames.filter(
      (_, i) => !updatedStates[i]
    ) as HelperType[];

    socket.emit("change_settings_helpers", blackListedHelpers);
    setHelperStates(updatedStates); // Aktualizacja stanu
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
                    if (Number(e.target.value) > 25) e.target.value = "25";
                    else if (Number(e.target.value) < 1) e.target.value = "1";
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
                    if (Number(e.target.value) > 25) e.target.value = "25";
                    else if (Number(e.target.value) < 1) e.target.value = "1";
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
                    if (Number(e.target.value) > 10) e.target.value = "10";
                    else if (Number(e.target.value) < 1) e.target.value = "1";
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
                    if (Number(e.target.value) > 120) e.target.value = "120";
                    else if (Number(e.target.value) < 1) e.target.value = "1";
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
              </div>
            </div>
            <div className={styles.settingsButtons}>
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
      <Modal
        show={showModal}
        onHide={handleModalHide}
        centered
        className={styles.customModal}
      >
        <ModalBody className={styles.settModal}>
          <MainTitle>Wybór kategorii</MainTitle>
          <div className={styles.categoryModalBox}>
            {categories.map((category) => (
              <div
                key={category.id}
                className={`${styles.categoriesChoice} ${
                  selectedCategories.includes(category.id) ? styles.active : ""
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <img
                  src={`/assets/categories/${category.img}`}
                  alt={category.name}
                  className={styles.categoryImage}
                />
                <div className={styles.categoryName}>{category.name}</div>
              </div>
            ))}
          </div>
          <div className={styles.settButtons}>
            <button className={styles.saveBut} onClick={handleModalHide}>
              Zapisz
            </button>
            <div className={styles.markButtons}>
              <button className={styles.markBut} onClick={selectAllCategories}>
                <FaCheckSquare />
              </button>
              <button
                className={styles.markBut}
                onClick={deselectAllCategories}
              >
                <FaSquare />
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      {/* Modal Ustawień Kół Ratunkowych ~ TODO: Trzeba by to rozdzielić jakoś bo strasznie dużo jak na ten plik, w osobne komponenty te modale */}
      <Modal
        show={showLifelineModal}
        onHide={handleLifelineModalHide}
        size="lg"
        centered
        className={styles.customModal}
      >
        <ModalBody className={styles.settModal}>
          <MainTitle>Koła ratunkowe</MainTitle>
          <div className={styles.helpers}>
            {helperStates.map((isEnabled, index) => (
              <div key={index} className={styles.singleHelper}>
                {/* Różne ikony dla każdego pomocnika */}
                {index === 0 && <FaRegEye className={styles.helperIcon} />}
                {index === 1 && (
                  <MdOutlineMoreTime className={styles.helperIcon} />
                )}
                {index === 2 && <MdQueryStats className={styles.helperIcon} />}

                <div className={styles.helper}>
                  <div className={styles.helperName}>
                    {index === 0 && "Zobacz odpowiedzi innych"}
                    {index === 1 && "Wydłuż czas na odpowiedź"}
                    {index === 2 && "50/50"}
                  </div>
                  <div className={styles.helperDesc}>
                    {index === 0 &&
                      "Użyte przed wybraniem odpowiedzi, pozwala graczowi na wgląd w odpowiedzi udzielone przez innych graczy."}
                    {index === 1 &&
                      "Użyte przed wybraniem odpowiedzi, pozwala graczowi na wydłużenie czasu na odpowiedź."}
                    {index === 2 &&
                      "Użyte przed wybraniem odpowiedzi, pozwala graczowi na wyeliminowanie dwóch błędnych odpowiedzi."}
                  </div>
                </div>
                <div className={styles.toggleContainer}>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleToggle(index)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.settButtons}>
            <button
              className={styles.saveBut}
              onClick={handleLifelineModalHide}
            >
              Zapisz
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Settings;
