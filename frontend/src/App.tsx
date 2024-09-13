import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import "./styles/Global.scss";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateGame from "./pages/CreateGame";
import Profile from "./pages/Profile.tsx";
import { Provider } from "react-redux";
import { store } from "./store";
import Logout from "./pages/Logout.tsx";
import WaitingRoom from "./pages/WaitingRoom.tsx";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="logout" element={<Logout />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="create-game" element={<CreateGame />} />
              <Route path="profile" element={<Profile />} />
              <Route path="/queue" element={<WaitingRoom />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
