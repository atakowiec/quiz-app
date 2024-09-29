import { Outlet } from 'react-router-dom';
import Header from '../Header.tsx';

const Layout = () => {
  return (
    <>
        <Header />
        <Outlet />
    </>
  )
}

export default Layout