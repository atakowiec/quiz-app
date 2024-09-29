import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import Meta from "../../components/Meta.tsx";
import Sidebar, { SidebarItem } from "../../components/SideBar.tsx";
import styles from "./Profile.module.scss";
import { IoPersonSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { SiDatadog } from "react-icons/si";
import { useSelector } from "react-redux";
import { State } from "../../store";
import {
  IoIosAddCircleOutline,
  IoIosPlay,
  IoLogoGameControllerB,
} from "react-icons/io";
import MainContainer from "../../components/MainContainer.tsx";
import MainBox from "../../components/MainBox.tsx";

const Profile: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoIosAddCircleOutline, label: "Stwórz Grę", href: "/create-game" },
    { icon: IoIosPlay, label: "Dołącz do gry", href: "/join-game" },
    { icon: IoLogoGameControllerB, label: "Historia Gier", href: "/games" },
    { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
  ];

  const user = useSelector<State>((state: State) => state.user) as any;

  return (
    <>
      <Meta title={"Profil"}/>
      <Breadcrumb title="Profil"/>
      <Sidebar items={sidebarItems}/>
      <MainContainer>
        <MainBox>
          <div className={styles.profileBox}>
            <div className={styles.profilePic}>
              <IoPersonSharp className={styles.personIcon}/>
              <MdEdit className={styles.editPic}/>
            </div>
            <div className={styles.personInfo}>
              <div className={`${styles.personNick} mb-2`}>
                Nickname:
                <span className={styles.nick}>
                  {user.username || "Example username"}
                </span>
                <MdEdit className={styles.editIcon}/>
              </div>
              <div className={`${styles.personEmail} mb-2`}>
                Email:{" "}
                <span className={styles.email}>
                  {user.email || "Example email"}
                </span>
                <MdEdit className={styles.editIcon}/>
              </div>
            </div>
          </div>
          <div className={styles.friendsText}>Znajomi</div>
          <hr className={styles.line}/>
          <div className={styles.addFriends}>
            Szukaj <FaSearch className={styles.searchIcon}/>
          </div>
          <div className={styles.friendsList}>
            <div className={styles.friend}>
              <SiDatadog className={styles.friendIcon}/>
              <div className={styles.friendNickname}>Friend#1</div>
            </div>
            <div className={styles.friend}>
              <SiDatadog className={styles.friendIcon}/>
              <div className={styles.friendNickname}>Friend#2</div>
            </div>
            <div className={styles.friend}>
              <SiDatadog className={styles.friendIcon}/>
              <div className={styles.friendNickname}>Friend#3</div>
            </div>
            <div className={styles.friend}>
              <SiDatadog className={styles.friendIcon}/>
              <div className={styles.friendNickname}>Friend#4</div>
            </div>
            <div className={styles.friend}>
              <SiDatadog className={styles.friendIcon}/>
              <div className={styles.friendNickname}>Friend#5</div>
            </div>
            <div className={styles.friend}>
              <SiDatadog className={styles.friendIcon}/>
              <div className={styles.friendNickname}>Friend#6</div>
            </div>
            <div className={styles.friend}>
              <SiDatadog className={styles.friendIcon}/>
              <div className={styles.friendNickname}>Friend#7</div>
            </div>
            <div className={styles.friend}>
              <SiDatadog className={styles.friendIcon}/>
              <div className={styles.friendNickname}>Friend#8</div>
            </div>
            <div className={styles.friend}>
              <SiDatadog className={styles.friendIcon}/>
              <div className={styles.friendNickname}>Friend#8</div>
            </div>
          </div>
        </MainBox>
      </MainContainer>
    </>
  );
};

export default Profile;
