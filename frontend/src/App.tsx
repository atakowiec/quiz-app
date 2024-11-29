import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/layouts/Layout.tsx";
import "./styles/Global.scss";
import Login from "./pages/login/Login.tsx";
import Register from "./pages/login/Register.tsx";
import CreateGame from "./pages/create-game/CreateGame.tsx";
import Profile from "./pages/profile/Profile.tsx";
import Logout from "./pages/login/Logout.tsx";
import WaitingRoom from "./pages/game/waiting-room/WaitingRoom.tsx";
import { useEffect } from "react";
import JoinGame from "./pages/join-game/JoinGame.tsx";
import Home from "./pages/Home.tsx";
import Game from "./pages/game/Game.tsx";
import { useGame } from "./store/gameSlice.ts";
import IsInWaitingRoomLayout from "./components/layouts/IsInWaitingRoomLayout.tsx";
import Settings from "./pages/game/waiting-room/Settings.tsx";
import History from "./pages/game-history/History.tsx";
import Stats from "./pages/game-stats/Stats.tsx";
import { NavigationHandler } from "./socket/NavigationHandler.tsx";
import ProtectedRoutes, {
  PermissionEnum,
} from "./components/ProtectedRoute.tsx";
import { AudioProvider } from "./components/Audio/AudioContext.tsx";
import Categories from "./pages/admin/categories/Categories.tsx";
import Questions from "./pages/admin/questions/Questions.tsx";

function App() {
  const game = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!game?.status || game.status === "waiting_for_players") return;

    if (!window.location.pathname.includes("game")) {
      navigate("/game");
    }
  }, [window.location.pathname, game?.status]);

  // this totally blocks other routes if the game already started
  if (game && game.status !== "waiting_for_players") {
    return (
      <Routes>
        <Route path="*" element={<Layout />}>
          <Route path="*" element={<Game />} />
        </Route>
      </Routes>
    );
  }

  return (
    <AudioProvider>
      <NavigationHandler />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="logout" element={<Logout />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="waiting-room" element={<WaitingRoom />} />
          <Route path="game" element={<Game />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route
            path="/admin/categories/:categoryName/"
            element={<Questions />}
          />
          <Route
            element={<ProtectedRoutes permissions={PermissionEnum.USER} />}
          >
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route
            element={<ProtectedRoutes permissions={PermissionEnum.ADMIN} />}
          >
            {/* Here all protected routes like admin /> */}
          </Route>

          <Route
            element={
              <IsInWaitingRoomLayout
                isInLobby={game?.status === "waiting_for_players"}
                ifHasToBeNavigatedTo={true}
              />
            }
          >
            <Route path="create-game" element={<CreateGame />} />
            <Route path="join-game" element={<JoinGame />} />
          </Route>

          <Route
            element={
              <IsInWaitingRoomLayout
                ifHasToBeNavigatedTo={false}
                isInLobby={game?.status === "waiting_for_players"}
              />
            }
          >
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route
            element={<ProtectedRoutes permissions={PermissionEnum.USER} />}
          >
            <Route path="history" element={<History />} />
            <Route path="stats" element={<Stats />} />
          </Route>
        </Route>
      </Routes>
    </AudioProvider>
  );
}

export default App;
