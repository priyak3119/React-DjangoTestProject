import React, { useState, useEffect } from "react";
import API from "../utils/api";
import UserPermissionPanel from "../components/UserPermissionPanel";

const PAGES = [
  "productslist",
  "marketinglist",
  "orderlist",
  "mediaplans",
  "offerpricingskus",
  "clients",
  "suppliers",
  "customersupport",
  "salesreports",
  "financeaccounting",
];

// Helper for rendering badges
function permissionBadge(action) {
  const colors = {
    view: "success",
    create: "primary",
    edit: "warning",
    delete: "danger",
  };
  return <span key={action} className={`badge bg-${colors[action]} me-1 text-uppercase`}>{action}</span>;
}

const AdminDashboard = ({ userInfo, logoutUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = () => {
    API.get("/users/")
      .then(res => setUsers(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Super Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={logoutUser}>Logout</button>
      </div>
      <p>Welcome, <strong>{userInfo.username}</strong></p>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>User</th>
              {PAGES.map(page => (
                <th key={page}>{page.replace(/([a-z])([A-Z])/g, '$1 $2')}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                {PAGES.map(page => {
                  const perms = user.permissions?.[page] || {};
                  return (
                    <td key={page}>
                      {(Array.isArray(perms) ? perms : []).map((action) =>
                        permissionBadge(action)
                      )}

                    </td>
                  );
                })}
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedUser(user)}
                  >
                    Edit Permissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserPermissionPanel
          selectedUser={selectedUser}
          onClose={() => setSelectedUser(null)}
          refresh={fetchUsers}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
