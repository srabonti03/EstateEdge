import React from 'react';
import "./adminDashboardPage.scss";
import SideBar from '../../components/sideBar/sideBar';
import { Outlet } from 'react-router-dom';

function AdminDashboardPage() {
  return (
    <div className="admin-dashboard">
      <SideBar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboardPage;
