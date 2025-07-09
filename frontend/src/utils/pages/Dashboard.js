// src/pages/Dashboard.js
import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import API from "../utils/api";
import UserTable from "../components/UserTable";
import UserPermissionPanel from "../components/UserPermissionPanel";

const Dashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchAll = () => {
    API.get("/users/").then((res) => setUsers(res.data));
    API.get("/api/permissions/").then((res) => setPermissions(res.data));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <p>Welcome, <strong>{user?.username}</strong></p>
      <button className="btn btn-danger mb-3" onClick={logoutUser}>Logout</button>

      <UserTable users={users} permissions={permissions} onEdit={setSelectedUser} />

      {selectedUser && (
        <UserPermissionPanel
          selectedUser={selectedUser}
          onClose={() => setSelectedUser(null)}
          refresh={fetchAll}
        />
      )}
    </div>
  );
};

export default Dashboard;
