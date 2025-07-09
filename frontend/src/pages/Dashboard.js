import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const { userInfo, logoutUser } = useContext(AuthContext);

  if (!userInfo) return <p className="text-center mt-5">Loading user info...</p>;

  return userInfo.is_super_admin ? (
    <AdminDashboard userInfo={userInfo} logoutUser={logoutUser} />
  ) : (
    <UserDashboard userInfo={userInfo} logoutUser={logoutUser} />
  );
};

export default Dashboard;