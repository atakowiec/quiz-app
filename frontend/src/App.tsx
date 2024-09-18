import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import "./styles/Global.scss";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateGame from "./pages/CreateGame";
import Profile from "./pages/Profile.tsx";
import { useDispatch, useSelector } from "react-redux";
import Logout from "./pages/Logout.tsx";
import WaitingRoom from "./pages/WaitingRoom.tsx";
import Question from "./pages/Question.tsx";
import Category from "./pages/Category.tsx";
import { useEffect, useState } from "react";
import getApi from "./api/axios.ts";
import { AxiosResponse } from "axios";
import { UserPacket } from "@shared/user";
import { userActions } from "./store/userSlice.ts";
import { useSocket } from "./socket/useSocket.ts";
import JoinGame from "./pages/JoinGame.tsx";
import { State } from "./store";
import { GameState } from "./store/gameSlice.ts";
import Home from "./pages/Home.tsx";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const socket = useSocket();
  const game = useSelector<State, GameState>((state) => state.game);

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
    if (!game?.status) return;

    if (game.status === "waiting_for_players") navigate("/queue");
    else if (game.status === "voting_phase") navigate("/category");
    else if (game.status === "question_phase") navigate("/question");

    // add route to game over screen
  }, [game?.status, window.location.pathname]);

  // wait for the request to finish before rendering the app - this way we can avoid flickering
  if (!loaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="logout" element={<Logout />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="create-game" element={<CreateGame />} />
          <Route path="join-game" element={<JoinGame />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/queue" element={<WaitingRoom />} />
          <Route path="/question" element={<Question />} />
          <Route path="/category" element={<Category />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
