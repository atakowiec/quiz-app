import { Breadcrumb, Container } from "react-bootstrap";
import Meta from "../components/Meta";
import "../styles/CreateGame.scss";
import { FaWrench, FaGamepad, FaPlay } from "react-icons/fa";
import { IoPersonSharp, IoPeopleSharp, IoPodiumSharp, IoStatsChartSharp } from "react-icons/io5";
import Sidebar, {SidebarItem} from "../components/Sidebar";

const CreateGame: React.FC = () => {

  const sidebarItems: SidebarItem[] = [
    {icon: FaGamepad, label: "Historia Gier", href: "/games"},
    {icon: FaPlay, label: "Stwórz Grę", href: "/create-game"},
    {icon: IoStatsChartSharp, label: "Statystyki", "href": "/stats"},
  ]

  return (
    <div>
      <Meta title={"Stwórz grę"} />
      <Breadcrumb title="Stwórz grę" />
      <Sidebar items={sidebarItems} />
      <Container className="create-container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className="create-box">
              <div className="create-text">
                <FaWrench className="mb-2 fs-2" /> Stwórz Grę
              </div>
              <div className="mode-text">Wybierz tryb gry</div>
              <div className="selection-boxes">
                <div className="mode-selection-text">Jednoosobowy <IoPersonSharp className="single-player"/></div>
                <div className="mode-selection-text">Wieloosobowy <IoPeopleSharp className="multi-player" /></div>
                <div className="mode-selection-text">Rankingowy <IoPodiumSharp className="ranked"/></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CreateGame;
