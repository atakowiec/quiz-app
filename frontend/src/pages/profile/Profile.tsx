import React, { useState } from "react";
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
import { UserState } from "../../store/userSlice.ts";
import useApi from "../../api/useApi.ts";
import { Friend } from "@shared/friends";
import FriendCard from "./components/FriendCard.tsx";

const Profile: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoIosAddCircleOutline, label: "Stwórz Grę", href: "/create-game" },
    { icon: IoIosPlay, label: "Dołącz do gry", href: "/join-game" },
    { icon: IoLogoGameControllerB, label: "Historia Gier", href: "/history" },
    { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
  ];

  const [searchFriend, setSearchFriend] = useState<string>("");
  const user = useSelector<State, UserState>(state => state.user);
  const friends = useApi<Friend[]>("/friends", "get");

  return (
    <>
      <Meta title={"Profil"}/>
      <Breadcrumb title="Profil"/>
      <Sidebar items={sidebarItems}/>
      <MainContainer className={styles.sidebarContainer}>
        <MainBox>
          <MainTitle>Twój Profil</MainTitle>
          <div className={styles.profileBox}>
            <div className={styles.iconAndName}>
              <div className={styles.profileIcon}>{user.username?.[0] ?? "-"}</div>
              <div className={styles.nameEmail}>
                <div className={styles.profileName}>
                  {user.username}
                  <FaEdit className={styles.editIcon}/>
                </div>
                <div className={styles.profileEmail}>{user.email}</div>
              </div>
            </div>
            <button className={styles.changePass}>
              <FaLock className={styles.lockIcon}/> Zmień hasło
            </button>
          </div>
          <div className={styles.friendsText}>Lista znajomych</div>
          <div className={styles.friendsBox}>
            <input type={"text"}
                   placeholder={"Wyszukaj..."}
                   className={styles.searchFriendInput}
                   value={searchFriend}
                   onChange={e => setSearchFriend(e.target.value)}/>
            {friends.loaded && friends.data &&
              friends.data
                .filter(friend => friend.username.includes(searchFriend))
                .map(friend => (
                  <FriendCard key={friend.id} friend={friend}/>
                ))}
          </div>
        </MainBox>
      </MainContainer>
    </>
  );
};

export default Profile;
