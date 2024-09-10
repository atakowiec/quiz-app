import { IconType } from "react-icons";
import "../styles/Sidebar.scss";

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
    <div className="sidebar">
      <ul>
        {items.map((item, index) => (
          <li key={index} className="sidebar-item">
            <a href={item.href} className="sidebar-link">
              <div className="sidebar-icon">{<item.icon />}</div>
              <div className="sidebar-label">{item.label}</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
