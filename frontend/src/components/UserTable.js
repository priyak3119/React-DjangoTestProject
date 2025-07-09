// src/components/UserTable.js
import React from "react";
import { PAGES, ACTIONS } from "../utils/permissions";

const UserTable = ({ users, permissions, onEdit }) => {
  const getUserPermissions = (userId, pageKey) => {
    const perms = permissions.filter(
      (p) => p.user === userId && p.page === pageKey
    );
    return perms.map((p) => p.action).join(", ");
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>User</th>
            {PAGES.map((p) => (
              <th key={p.key}>{p.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              {PAGES.map((page) => (
                <td key={page.key}>{getUserPermissions(u.id, page.key)}</td>
              ))}
              <td>
                <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(u)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
