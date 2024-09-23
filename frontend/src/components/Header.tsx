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
import { GameState, useGame } from "../store/gameSlice.ts";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector<State, UserState>((state: State) => state.user);

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

  const handleIconClick = () => {
    if (user.loggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  //TODO: make edit profile work
  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <>
      <header className={`${styles.headerTopStrip} p-1`}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            Quiz
          </Link>
          {!shouldHideIcons && (
            <div className={styles.iconContainer}>
              <Link to="/" className={`info ${styles.gap15}`}>
                <IoInformationCircleOutline
                  color="white"
                  className={styles.iconSize}
                />
              </Link>
              <Link to="/" className={`notifications ${styles.gap15}`}>
                <IoMdNotificationsOutline
                  color="white"
                  className={styles.iconSize}
                />
              </Link>
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
      </header>
    </>
  );
};

export default Header;
