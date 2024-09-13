import React from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { FaGamepad, FaPlay, FaSearch } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import Meta from "../components/Meta";
import Sidebar, { SidebarItem } from "../components/SideBar";
import styles from "../styles/Profile.module.scss";
import { IoPersonSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { SiDatadog } from "react-icons/si";

const Profile: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: FaGamepad, label: "Historia Gier", href: "/games" },
    { icon: FaPlay, label: "Stwórz Grę", href: "/create-game" },
    { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
  ];

  return (
    <>
      <Meta title={"Profil"} />
      <Breadcrumb title="Profil" />
      <Sidebar items={sidebarItems} />
      <Container className={styles.profileContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 d-flex align-items-center">
            <div className={styles.profileMainBox}>
              <div className={styles.profileBox}>
                <div className={styles.profilePic}>
                  <IoPersonSharp className={styles.personIcon} />
                  <MdEdit className={styles.editPic} />
                </div>
                <div className={styles.personInfo}>
                  <div className={`${styles.personNick} mb-2`}>
                    Nickname:
                    <span className={styles.nick}> Example nickname</span>
                    <MdEdit className={styles.editIcon} />
                  </div>
                  <div className={`${styles.personEmail} mb-2`}>
                    Email: <span className={styles.email}> Example email</span>
                    <MdEdit className={styles.editIcon} />
                  </div>
                </div>
              </div>
              <div className={styles.friendsText}>Znajomi</div>
              <hr className={styles.line} />
              <div className={styles.addFriends}>
                Szukaj <FaSearch className={styles.searchIcon} />
              </div>
              <div className={styles.friendsList}>
                <div className={styles.friend}>
                  <SiDatadog className={styles.friendIcon} />
                  <div className={styles.friendNickname}>Friend#1</div>
                </div>
                <div className={styles.friend}>
                  <SiDatadog className={styles.friendIcon} />
                  <div className={styles.friendNickname}>Friend#2</div>
                </div>
                <div className={styles.friend}>
                  <SiDatadog className={styles.friendIcon} />
                  <div className={styles.friendNickname}>Friend#3</div>
                </div>
                <div className={styles.friend}>
                  <SiDatadog className={styles.friendIcon} />
                  <div className={styles.friendNickname}>Friend#4</div>
                </div>
                <div className={styles.friend}>
                  <SiDatadog className={styles.friendIcon} />
                  <div className={styles.friendNickname}>Friend#5</div>
                </div>
                <div className={styles.friend}>
                  <SiDatadog className={styles.friendIcon} />
                  <div className={styles.friendNickname}>Friend#6</div>
                </div>
                <div className={styles.friend}>
                  <SiDatadog className={styles.friendIcon} />
                  <div className={styles.friendNickname}>Friend#7</div>
                </div>
                <div className={styles.friend}>
                  <SiDatadog className={styles.friendIcon} />
                  <div className={styles.friendNickname}>Friend#8</div>
                </div>
                <div className={styles.friend}>
                  <SiDatadog className={styles.friendIcon} />
                  <div className={styles.friendNickname}>Friend#8</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Profile;
