import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SideBar from './SideBar';

const Layout = () => {
  return (
    <div>
        <Header />
        <SideBar />
        <Outlet />
        <Footer />
    </div>
  )
}

export default Layout