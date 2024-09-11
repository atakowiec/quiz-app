import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Layout from './components/Layout'
import "./styles/Global.scss";
import Login from './pages/Login';
import Register from './pages/Register';
import CreateGame from './pages/CreateGame';
import {Provider} from "react-redux";
import {store} from "./store";

function App() {

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route path='login' element={<Login/>}/>
              <Route path='register' element={<Register/>}/>
              <Route path='/create-game' element={<CreateGame/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
