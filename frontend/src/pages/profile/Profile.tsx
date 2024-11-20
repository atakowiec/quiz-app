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
import { FaEdit, FaLock } from "react-icons/fa";
import { UserState } from "../../store/userSlice.ts";
import FriendCard from "./components/FriendCard.tsx";
import AddFriendsModal from "./components/AddFriendsModal.tsx";
import UpdateEmailModal from "./Edit/UpdateEmailModal.tsx";
import ChangePasswordModal from "./Edit/ChangePasswordModal.tsx";
import ProfileIcon from "../../components/ProfileIcon.tsx";
import ProfileIconPicker from "../../components/profile-icon-picker/ProfileIconPicker.tsx";

const Profile: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoIosAddCircleOutline, label: "Stwórz Grę", href: "/create-game" },
    { icon: IoIosPlay, label: "Dołącz do gry", href: "/join-game" },
    { icon: IoLogoGameControllerB, label: "Historia Gier", href: "/history" },
    { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
  ];

  const [addFriendsVisible, setAddFriendsVisible] = useState(false);
  const [updateEmailVisible, setUpdateEmailVisible] = useState(false);
  const [searchFriend, setSearchFriend] = useState("");
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [iconPickerVisible, setIconPickerVisible] = useState(false);

  const user = useSelector<State, UserState>((state) => state.user);

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
              <ProfileIcon className={styles.profileIcon}
                           username={user.username}
                           onClick={() => setIconPickerVisible(true)}
                           iconColor={user.iconColor}/>
              <div className={styles.nameEmail}>
                <div className={styles.profileName}>
                  {user.username}
                  <FaEdit
                    className={styles.editIcon}
                    onClick={() => setUpdateEmailVisible(true)}
                  />
                </div>
                <div className={styles.profileEmail}>{user.email}</div>
              </div>
            </div>
            <button
              className={styles.changePass}
              onClick={() => setChangePasswordVisible(true)}
            >
              <FaLock className={styles.lockIcon} /> Zmień hasło
            </button>
          </div>
          <div className={styles.friendsText}>Lista znajomych</div>
          <div className={styles.friendsBox}>
            <input
              type="text"
              placeholder="Wyszukaj..."
              className={styles.searchFriendInput}
              value={searchFriend}
              onChange={(e) => setSearchFriend(e.target.value)}
            />
            {user.friends &&
              user.friends
                .filter((friend) => friend.username.includes(searchFriend))
                .map((friend) => (
                  <FriendCard key={friend.id} friend={friend} />
                ))}
            {user.friends?.length === 0 && (
              <div className={styles.noFriends}>Lista znajomych jest pusta</div>
            )}
            <button
              className={styles.addFriends}
              onClick={() => setAddFriendsVisible(true)}
            >
              Wyszukaj znajomych
            </button>
          </div>
        </MainBox>
      </MainContainer>
      <AddFriendsModal
        show={addFriendsVisible}
        setShow={setAddFriendsVisible}
      />
      <UpdateEmailModal
        show={updateEmailVisible}
        handleClose={() => setUpdateEmailVisible(false)}
        userId={user.id}
      />
      <ChangePasswordModal
        show={changePasswordVisible}
        handleClose={() => setChangePasswordVisible(false)}
      />
      <ProfileIconPicker
        visible={iconPickerVisible}
        setVisible={setIconPickerVisible}
      />
    </>
  );
};

export default Profile;
