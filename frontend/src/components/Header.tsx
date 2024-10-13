import styles from "../styles/Header.module.scss";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { State } from "../store";
import { useNavigate } from "react-router-dom";
import { UserState } from "../store/userSlice.ts";
import { Dropdown } from "react-bootstrap";
import { useGame } from "../store/gameSlice.ts";
import FancyLogo from "./FancyLogo.tsx";
import Notifications from "./Notifications.tsx";
import { useState } from "react";
import { useNotifications } from "../store/notificationsSlice.ts";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector<State, UserState>((state: State) => state.user);
  const [notificationsShow, setNotificationsShow] = useState(false);
  const notificationCount = useNotifications().length

  const gameState = useGame();

  // Lista statusów, w których ikony mają zniknąć
  const hideIconsStatuses = [
    "voting_phase",
    "selected_category_phase",
    "question_phase",
    "question_result_phase",
    "leaderboard",
  ];

  // Sprawdzanie statusu gry, aby ukryć ikony
  const shouldHideIcons =
    gameState && hideIconsStatuses.includes(gameState.status);

  function toggleNotifications() {
    setNotificationsShow(prev => !prev);
  }

  //TODO: make edit profile work
  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <>
      <header className={`${styles.headerTopStrip}`}>
        <div className={styles.headerContent}>
          <FancyLogo/>
          {!shouldHideIcons && (
            <div className={styles.iconContainer}>
              <Link to="/" className={`${styles.gap15}`}>
                <IoInformationCircleOutline
                  color="white"
                  className={styles.iconSize}
                />
              </Link>
              {user.loggedIn ? (
                <div
                  className={`${styles.gap15} ${styles.notificationIconLink}`}
                  onClick={toggleNotifications}>
                  <IoMdNotificationsOutline
                    color="white"
                    className={styles.iconSize}/>
                  {
                    notificationCount > 0 &&
                      <div className={styles.notificationsIndicator}>
                        {notificationCount}
                      </div>
                  }
                </div>
              ) : null}
              {user.loggedIn ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="secondary"
                    id="dropdown-basic"
                    className={`${styles.profile} ${styles.gap15}`}
                  >
                    <IoPersonCircleOutline
                      color="white"
                      className={styles.iconSize}
                    />
                  </Dropdown.Toggle>

                  {/* Menu rozwijane z opcjami */}
                  <Dropdown.Menu className={styles.dropdownMenu}>
                    <Dropdown.Item
                      onClick={() => navigate("/profile")}
                      className={styles.dropdownItemCustom}
                    >
                      Profil
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={handleLogout}
                      className={styles.dropdownItemCustom}
                    >
                      Wyloguj się
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                // Przycisk logowania dla niezalogowanego użytkownika
                <button
                  className={`${styles.loginButton} ${styles.gap15}`}
                  onClick={() => navigate("/login")}
                >
                  Zaloguj się
                </button>
              )}
            </div>
          )}
        </div>
        <Notifications show={notificationsShow} setShow={setNotificationsShow}/>
      </header>
    </>
  );
};

export default Header;
