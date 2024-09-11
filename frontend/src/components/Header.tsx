import styles from  "../styles/Header.module.scss";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";

const Header = () => {
  return (
    <>
      <header className={`${styles.headerTopStrip} p-1`}>
        <div className={styles.headerContent}>
          <a href="/" className={styles.logo} >Quiz</a>
          <div className={styles.iconContainer}>
            <a href="/" className={`info ${styles.gap15}`}>
              <IoInformationCircleOutline color="white" size="30px" />
            </a>
            <a href="/" className={`notifications ${styles.gap15}`}>
              <IoMdNotificationsOutline color="white" size="30px" />
            </a>
            <a href="/login" className={`profile ${styles.gap15}`}>
              <IoPersonCircleOutline color="white" size="30px" />
            </a>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
