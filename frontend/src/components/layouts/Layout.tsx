import { Outlet } from "react-router-dom";
import Header from "../main-components/header/Header.tsx";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
