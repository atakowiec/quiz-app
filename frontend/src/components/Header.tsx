import "../styles/Header.scss";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";

const Header = () => {
  return (
    <>
      <header className="header-top-strip p-1">
        <div className="header-content">
          <a href="/" className="logo" >Quiz</a>
          <div className="icon-container">
            <a href="/" className="info gap-15">
              <IoInformationCircleOutline color="white" size="30px" />
            </a>
            <a href="/" className="notifications gap-15">
              <IoMdNotificationsOutline color="white" size="30px" />
            </a>
            <a href="/login" className="profile gap-15">
              <IoPersonCircleOutline color="white" size="30px" />
            </a>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
