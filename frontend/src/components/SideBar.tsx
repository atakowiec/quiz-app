import { IconType } from "react-icons";
import styles from "../styles/Sidebar.module.scss";
import { Link } from "react-router-dom";

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
          <li key={index} className={`${styles.sidebarItem}`}>
            <Link to={item.href} className={styles.sidebarLink}>
              <div className={styles.sidebarIcon}>{<item.icon />}</div>
              <div className={styles.sidebarLabel}>{item.label}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
