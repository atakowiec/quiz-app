import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import "./styles/Global.scss";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateGame from "./pages/CreateGame";
import Profile from "./pages/Profile.tsx";
import { useDispatch } from "react-redux";
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
import Home from "./pages/Home.tsx";

function App() {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const socket = useSocket();

  // on start of the application check whether the user has some valid token
  useEffect(() => {
    getApi()
      .post("/auth/verify")
      .then((response: AxiosResponse<UserPacket>) => {
        dispatch(userActions.setUser(response.data));

        if (response.data.id) socket.connect(); // maybe we can do it in a better way maybe connect user only when he enters the game?

        setLoaded(true);
      })
      .catch(() => {
        dispatch(userActions.setUser(null));

        setLoaded(true);
      });
  }, []);

  // wait for the request to finish before rendering the app - this way we can avoid flickering
  if (!loaded) return null;

  return (
    <>
      <BrowserRouter>
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
            <Route path="/room" element={<WaitingRoom />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
