// src/components/UserPermissionPanel.jsx
import React, { useEffect, useState } from "react";
import API from "../utils/api";

const ALL_PAGES = [
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

const ACTIONS = ["view", "create", "edit", "delete"];

const UserPermissionPanel = ({ selectedUser, onClose, refresh }) => {
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    // Load user permissions into local state
    const userPerms = selectedUser.permissions || {};
    const updated = {};
    ALL_PAGES.forEach(page => {
      updated[page] = { view: false, create: false, edit: false, delete: false, ...userPerms[page] };
    });
    setPermissions(updated);
  }, [selectedUser]);

  const handleCheckboxChange = (page, action) => {
    setPermissions(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [action]: !prev[page][action]
      }
    }));
  };

  const handleSave = async () => {
    try {
      await API.put(`/api/users/${selectedUser.id}/permissions/`, { permissions });
      refresh();
      onClose();
    } catch (err) {
      console.error("Error saving permissions", err);
      alert("Failed to save permissions");
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-header d-flex justify-content-between">
        <h5>Edit Permissions: {selectedUser.username}</h5>
        <button className="btn btn-sm btn-secondary" onClick={onClose}>Close</button>
      </div>
      <div className="card-body">
        <table className="table table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>Page</th>
              {ACTIONS.map(action => (
                <th key={action}>{action.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_PAGES.map(page => (
              <tr key={page}>
                <td>{page}</td>
                {ACTIONS.map(action => (
                  <td key={action}>
                    <input
                      type="checkbox"
                      checked={permissions[page]?.[action] || false}
                      onChange={() => handleCheckboxChange(page, action)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-success mt-2" onClick={handleSave}>Save Permissions</button>
      </div>
    </div>
  );
};

export default UserPermissionPanel;
