import { Breadcrumb } from "react-bootstrap";
import Meta from "../../../components/Meta";
import Sidebar, { SidebarItem } from "../../../components/SideBar";
import MainContainer from "../../../components/MainContainer";
import MainBox from "../../../components/MainBox";
import MainTitle from "../../../components/MainTitle";
import { IoHomeSharp, IoSettingsSharp } from "react-icons/io5";

const Settings: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoHomeSharp, label: "Powrót", href: "/" },
    { icon: IoSettingsSharp, label: "Ustawienia", href: "/settings" },
  ];

  return (
    <>
      <Meta title={"Poczekalnia"} />
      <Breadcrumb title="Poczekalnia" />
      <Sidebar items={sidebarItems} />
      <MainContainer>
        <MainBox>
          <MainTitle>Ustawienia</MainTitle>
        </MainBox>
      </MainContainer>
    </>
  );
};

export default Settings;
