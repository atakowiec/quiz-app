import styles from "../styles/Header.module.scss";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { State } from "../store";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector<State>((state: State) => state.user) as any;

  const handleIconClick = () => {
    if (user.loggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <header className={`${styles.headerTopStrip} p-1`}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            Quiz
          </Link>
          <div className={styles.iconContainer}>
            <Link to="/" className={`info ${styles.gap15}`}>
              <IoInformationCircleOutline color="white" size="30px" />
            </Link>
            <Link to="/" className={`notifications ${styles.gap15}`}>
              <IoMdNotificationsOutline color="white" size="30px" />
            </Link>
            <div
              className={`${styles.profile} ${styles.gap15}`}
              onClick={handleIconClick}
            >
              <IoPersonCircleOutline color="white" size="30px" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
