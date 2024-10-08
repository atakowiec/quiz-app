import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { IoStatsChartSharp } from "react-icons/io5";
import Meta from "../../components/Meta.tsx";
import Sidebar, { SidebarItem } from "../../components/SideBar.tsx";
import styles from "./Profile.module.scss";
import { useSelector } from "react-redux";
import { State } from "../../store";
import {
  IoIosAddCircleOutline,
  IoIosPlay,
  IoLogoGameControllerB,
} from "react-icons/io";
import MainContainer from "../../components/MainContainer.tsx";
import MainBox from "../../components/MainBox.tsx";
import MainTitle from "../../components/MainTitle.tsx";
import { FaEdit } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { GiGamepad } from "react-icons/gi";
import { IoMdPerson } from "react-icons/io";
import { UserState } from "../../store/userSlice.ts";
import useProfileModal from "../../hooks/profile-modal/useProfileModal.ts";

const Profile: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoIosAddCircleOutline, label: "Stwórz Grę", href: "/create-game" },
    { icon: IoIosPlay, label: "Dołącz do gry", href: "/join-game" },
    { icon: IoLogoGameControllerB, label: "Historia Gier", href: "/history" },
    { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
  ];

  const user = useSelector<State, UserState>(state => state.user);
  const {showModal} = useProfileModal();

  return (
    <>
      <Meta title={"Profil"} />
      <Breadcrumb title="Profil" />
      <Sidebar items={sidebarItems} />
      <MainContainer className={styles.sidebarContainer}>
        <MainBox>
          <MainTitle>Twój Profil</MainTitle>
          <div className={styles.profileBox}>
            <div className={styles.iconAndName}>
              <div className={styles.profileIcon}>{user.username?.[0] ?? "-"}</div>
              <div className={styles.nameEmail}>
                <div className={styles.profileName}>
                  {user.username}
                  <FaEdit className={styles.editIcon} />
                </div>
                <div className={styles.profileEmail}>{user.email}</div>
              </div>
            </div>
            <button className={styles.changePass}>
              <FaLock className={styles.lockIcon} /> Zmień hasło
            </button>
          </div>
          <div className={styles.friendsText}>Lista znajomych</div>
          <div className={styles.friendsBox}>
            <div className={styles.addFriends}>Wyszukaj...</div>
            <div className={styles.friend}>
              <div className={styles.friendIconNick}>
                <div className={styles.friendIcon}>B</div>
                <div className={styles.nickStatus}>
                  <div className={styles.friendNick}>Blablador</div>
                  <div className={styles.statusOnline}>
                    <FaCircle className={styles.circle} />
                    online
                  </div>
                </div>
              </div>
              <div className={styles.rightSide}>
                <button className={styles.invite}>
                  <GiGamepad className={styles.gamePad} /> Zaproś do gry
                </button>
                <button
                  className={styles.friendModal}
                  onClick={() => showModal(user.id)}
                >
                  <IoMdPerson />
                </button>
              </div>
            </div>
          </div>
        </MainBox>
      </MainContainer>
    </>
  );
};

export default Profile;
