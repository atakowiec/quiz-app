import styles from "./Header.module.scss";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { State } from "../../../store";
import { useNavigate } from "react-router-dom";
import { UserState } from "../../../store/userSlice.ts";
import { Dropdown } from "react-bootstrap";
import { useGame } from "../../../store/gameSlice.ts";
import FancyLogo from "./FancyLogo.tsx";
import Notifications from "../../Notifications.tsx";
import { useState } from "react";
import { useNotifications } from "../../../store/notificationsSlice.ts";
import QueueBox from "../queue-box/QueueBox.tsx";
import LeaveGameButton from "../../../pages/game/components/leave-game-button/LeaveGameButton.tsx";
import { GameStatus } from "@shared/game";

const HIDE_ICON_STATUSES: GameStatus[] = [
  "voting_phase",
  "selected_category_phase",
  "question_phase",
  "question_result_phase",
  "leaderboard",
  "game_over"
];

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector<State, UserState>((state: State) => state.user);
  const [notificationsShow, setNotificationsShow] = useState(false);
  const notificationCount = useNotifications().length;

  const gameState = useGame();

  // Sprawdzanie statusu gry, aby ukryć ikony
  const shouldHideIcons =
    gameState && HIDE_ICON_STATUSES.includes(gameState.status);

  function toggleNotifications() {
    setNotificationsShow((prev) => !prev);
  }

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <>
      <header className={`${styles.headerTopStrip}`}>
        <div className={styles.headerContent}>
          <FancyLogo/>
          <QueueBox/>
          {!shouldHideIcons && (
            <div className={styles.iconContainer}>
              {user.loggedIn ? (
                <div
                  className={`${styles.gap15} ${styles.notificationIconLink}`}
                  onClick={toggleNotifications}
                >
                  <IoMdNotificationsOutline
                    color="white"
                    className={styles.iconSize}
                  />
                  {notificationCount > 0 && (
                    <div className={styles.notificationsIndicator}>
                      {notificationCount}
                    </div>
                  )}
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
                    {user.permission === 1 && (
                      <Dropdown.Item
                        onClick={() => navigate("/admin/categories")}
                        className={styles.dropdownItemCustom}
                      >
                        Admin
                      </Dropdown.Item>
                    )}

                    <Dropdown.Item
                      onClick={handleLogout}
                      className={styles.dropdownItemCustom}
                    >
                      Wyloguj się
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <button
                  className={`${styles.loginButton} ${styles.gap15}`}
                  onClick={() => navigate("/login")}
                >
                  Zaloguj się
                </button>
              )}
            </div>
          )}
          {
            gameState && gameState.status !== "waiting_for_players" &&
              <div className={styles.gameNavButtons}>
                  <span>
                    Kod: #{gameState.id}
                  </span>
                  <LeaveGameButton/>
              </div>
          }
        </div>
        <Notifications
          show={notificationsShow}
          setShow={setNotificationsShow}
        />
      </header>
    </>
  );
};

export default Header;
