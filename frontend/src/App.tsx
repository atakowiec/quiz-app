import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import "./styles/Global.scss";
import Login from './pages/Login';
import Register from './pages/Register';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}> 
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
