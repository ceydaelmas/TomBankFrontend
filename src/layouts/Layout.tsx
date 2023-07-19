import React from 'react'
import { usePage } from '../contexts/PageContext';
import MenuAppBar from '../components/Navbar';
import { Outlet } from "react-router-dom";
const Layout = () => {
    const { tabs } = usePage();

    return (
      <div>
        <MenuAppBar/>
       < Outlet />

    </div>
    );
  }

export default Layout