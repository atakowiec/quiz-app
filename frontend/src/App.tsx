import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import "./styles/Global.scss";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateGame from "./pages/CreateGame/CreateGame.tsx";
import Profile from "./pages/Profile.tsx";
import { useDispatch } from "react-redux";
import Logout from "./pages/Logout.tsx";
import WaitingRoom from "./pages/WaitingRoom.tsx";
import { useEffect, useState } from "react";
import getApi from "./api/axios.ts";
import { AxiosResponse } from "axios";
import { UserPacket } from "@shared/user";
import { userActions } from "./store/userSlice.ts";
import { useSocket } from "./socket/useSocket.ts";
import JoinGame from "./pages/JoinGame.tsx";
import Home from "./pages/Home.tsx";
import Categories from "./pages/Admin/Questions/Categories.tsx";
import Game from "./pages/game/Game.tsx";
import useApi from "./api/useApi.ts";
import { globalDataActions } from "./store/globalDataSlice.ts";
import { useGame } from "./store/gameSlice.ts";
import IsInWaitingRoomLayout from "./components/IsInWaitingRoomLayout.tsx";
import Questions from "./pages/Admin/Questions/Questions.tsx";
import GameOverPhase from "./pages/game/GameOverPhase.tsx";

function App() {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const socket = useSocket();
  const game = useGame();
  const navigate = useNavigate();
  const categoriesData = useApi("/questions/categories", "get");
  // on the start of the application fetch the categories and store them in the global state
  useEffect(() => {
    dispatch(globalDataActions.setData({ categories: categoriesData.data }));
  }, [categoriesData]);

  // on start of the application check whether the user has some valid token
  useEffect(() => {
    getApi()
      .post("/auth/verify")
      .then((response: AxiosResponse<UserPacket>) => {
        dispatch(userActions.setUser(response.data));

        if (response.data.id) {
          socket.connect();
        }

        setLoaded(true);
      })
      .catch(() => {
        dispatch(userActions.setUser(null));

        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!game?.status || game.status === "waiting_for_players") return;

    if (!window.location.pathname.includes("game")) {
      navigate("/game");
    }
  }, [window.location.pathname, game?.status]);

  // wait for the request to finish before rendering the app - this way we can avoid flickering
  if (!loaded) return null;

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
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="logout" element={<Logout />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="profile" element={<Profile />} />
          <Route path="waiting-room" element={<WaitingRoom />} />
          <Route path="game" element={<Game />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route
            path="/admin/categories/:categoryName/"
            element={<Questions />}
          />

          <Route
            element={
              <IsInWaitingRoomLayout
                isInLobby={game?.status === "waiting_for_players"}
              />
            }
          >
            <Route path="create-game" element={<CreateGame />} />
            <Route path="join-game" element={<JoinGame />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
