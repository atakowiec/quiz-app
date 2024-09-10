import { IconType } from "react-icons";
import styles from "../styles/Sidebar.module.scss";

export interface SidebarItem {
  icon: IconType;
  label: string;
  href: string;
}
interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <div className={styles.sidebar}>
      <ul>
        {items.map((item, index) => (
          <li key={index} className={styles.sidebarItem}>
            <a href={item.href} className={styles.sidebarLink}>
              <div className={styles.sidebarIcon}>{<item.icon />}</div>
              <div className={styles.sidebarLabel}>{item.label}</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
