import { IconType } from "react-icons";
import styles from "../styles/Sidebar.module.scss";
import { Link } from "react-router-dom";
import AudioPlayer from "./Audio/AudioPlayer";

export interface SidebarItem {
  icon: IconType;
  label: string;
  href: string;
  onClick?: () => void;
}
interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <div className={styles.sidebar}>
      <ul>
        {items.map((item, index) => (
          <li key={index} className={`${styles.sidebarItem}`}>
            {item.onClick ? (
              <button className={styles.sidebarLink} onClick={item.onClick}>
                <div className={styles.sidebarIcon}>{<item.icon />}</div>
                <div className={styles.sidebarLabel}>{item.label}</div>
              </button>
            ) : (
              <Link to={item.href} className={styles.sidebarLink}>
                <div className={styles.sidebarIcon}>{<item.icon />}</div>
                <div className={styles.sidebarLabel}>{item.label}</div>
              </Link>
            )}
          </li>
        ))}
        <div className={styles.playMusicButton}>
          <AudioPlayer />
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
