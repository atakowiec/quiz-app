import styles from  "../styles/Header.module.scss";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";
import {Link} from "react-router-dom";

const Header = () => {
  return (
    <>
      <header className={`${styles.headerTopStrip} p-1`}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo} >Quiz</Link>
          <div className={styles.iconContainer}>
            <Link to="/" className={`info ${styles.gap15}`}>
              <IoInformationCircleOutline color="white" size="30px" />
            </Link>
            <Link to="/" className={`notifications ${styles.gap15}`}>
              <IoMdNotificationsOutline color="white" size="30px" />
            </Link>
            <Link to="/login" className={`profile ${styles.gap15}`}>
              <IoPersonCircleOutline color="white" size="30px" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
