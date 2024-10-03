import { Breadcrumb, Modal, ModalBody } from "react-bootstrap";
import Meta from "../../../components/Meta";
import Sidebar, { SidebarItem } from "../../../components/SideBar";
import MainContainer from "../../../components/MainContainer";
import MainBox from "../../../components/MainBox";
import MainTitle from "../../../components/MainTitle";
import { IoHomeSharp, IoSettingsSharp } from "react-icons/io5";
import styles from "./Settings.module.scss";
import { useState } from "react";
import { FaCheckSquare } from "react-icons/fa";
import { FaSquare } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineMoreTime } from "react-icons/md";
import { MdQueryStats } from "react-icons/md";

const Settings: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoHomeSharp, label: "Powrót", href: "/" },
    { icon: IoSettingsSharp, label: "Ustawienia", href: "/settings" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [showLifelineModal, setShowLifelineModal] = useState(false);
  const handleModalShow = () => setShowModal(true);
  const handleModalHide = () => setShowModal(false);
  const handleLifelineModalShow = () => setShowLifelineModal(true);
  const handleLifelineModalHide = () => setShowLifelineModal(false);

  const categories = ["Geografia", "Historia", "Biblia", "Matematyka"];
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleCategoryClick = (index: number) => {
    if (selectedCategories.includes(index)) {
      setSelectedCategories(selectedCategories.filter((i) => i !== index));
    } else {
      setSelectedCategories([...selectedCategories, index]);
    }
  };

  const selectAllCategories = () => {
    setSelectedCategories(categories.map((_, index) => index));
  };

  const deselectAllCategories = () => {
    setSelectedCategories([]);
  };

  const [helperStates, setHelperStates] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const handleToggle = (index: number) => {
    const updatedStates = [...helperStates];
    updatedStates[index] = !updatedStates[index]; // Zmiana stanu
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
                <button className={styles.changeButton}>-</button>
                <div className={styles.choiceValue}>3</div>
                <button className={styles.changeButton}>+</button>
              </div>
            </div>
            <div className={styles.singleSetting}>
              <div className={styles.settingsTitle}>Liczba pytań na rundę</div>
              <div className={styles.choiceBox}>
                <button className={styles.changeButton}>-</button>
                <div className={styles.choiceValue}>3</div>
                <button className={styles.changeButton}>+</button>
              </div>
            </div>
            <div className={styles.singleSetting}>
              <div className={styles.settingsTitle}>
                Liczba kategorii podczas głosowania
              </div>
              <div className={styles.choiceBox}>
                <button className={styles.changeButton}>-</button>
                <div className={styles.choiceValue}>50</div>
                <button className={styles.changeButton}>+</button>
              </div>
            </div>
            <div className={styles.singleSetting}>
              <div className={styles.settingsTitle}>
                Czas na udzielenie odpowiedzi
              </div>
              <div className={styles.choiceBox}>
                <button className={styles.changeButton}>-</button>
                <div className={styles.choiceValue}>12</div>
                <button className={styles.changeButton}>+</button>
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
            {categories.map((category, index) => (
              <div
                key={index}
                className={`${styles.categoriesChoice} ${
                  selectedCategories.includes(index) ? styles.active : ""
                }`}
                onClick={() => handleCategoryClick(index)}
              >
                <img
                  src="../../../../public/assets/categories/biblia.png"
                  alt="Kategoria"
                  className={styles.categoryImage}
                />
                <div className={styles.categoryName}>{category}</div>
              </div>
            ))}
          </div>
          <div className={styles.settButtons}>
            <button className={styles.saveBut}>Zapisz</button>
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
      {/* Modal Ustawień Kół Ratunkowych */}
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
            <button className={styles.saveBut}>Zapisz</button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Settings;
