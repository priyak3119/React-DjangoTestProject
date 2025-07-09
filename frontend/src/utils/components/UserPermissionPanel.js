// src/components/UserPermissionPanel.js
import React, { useState, useEffect } from "react";
import { PAGES, ACTIONS } from "../utils/permissions";
import API from "../utils/api";

const UserPermissionPanel = ({ selectedUser, onClose, refresh }) => {
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await API.get(`/permissions/?user=${selectedUser.id}`);
        console.log("Raw permission data:", res.data);

        const formatted = {};
        res.data.forEach(({ page, action }) => {
          if (!formatted[page]) formatted[page] = {};
          formatted[page][action] = true;
        });

        setSelectedPermissions(formatted);
      } catch (err) {
        console.error("Error fetching permissions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedUser) {
      setLoading(true);
      fetchPermissions();
    }
  }, [selectedUser]);

  const handleCheckboxChange = (page, action) => {
    setSelectedPermissions((prev) => {
      const updated = { ...prev };
      updated[page] = { ...(updated[page] || {}) };
      updated[page][action] = !updated[page][action];
      return updated;
    });
  };

  const isChecked = (page, action) =>
    selectedPermissions?.[page]?.[action] ?? false;

  const handleSubmit = async () => {
    try {
      // Delete old permissions
      await API.delete(`/permissions/?user=${selectedUser.id}`);

      // Prepare new payload
      const payload = [];

      for (const [page, actions] of Object.entries(selectedPermissions)) {
        for (const [action, allowed] of Object.entries(actions)) {
          if (allowed) {
            payload.push({ user: selectedUser.id, page, action });
          }
        }
      }

      // Save new permissions
      for (const perm of payload) {
        await API.post("/permissions/", perm);
      }

      alert("✅ Permissions saved successfully!");
      refresh();
      onClose();
    } catch (err) {
      console.error("Error saving permissions:", err);
      alert("Failed to save permissions.");
    }
  };

  return (
    <div className="border p-3 bg-light rounded mt-3">
      <h5 className="mb-3">
        Edit Permissions for <strong>{selectedUser.username}</strong>
      </h5>

      {loading ? (
        <p>Loading permissions...</p>
      ) : (
        <>
          {PAGES.map((page) => (
            <div key={page.key} className="mb-2">
              <strong>{page.label}</strong>
              <div className="form-check form-check-inline ms-3">
                {ACTIONS.map((action) => (
                  <label key={action} className="form-check-label me-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isChecked(page.key, action)}
                      onChange={() => handleCheckboxChange(page.key, action)}
                    />
                    {action}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button className="btn btn-success me-2 mt-3" onClick={handleSubmit}>
            Save
          </button>
          <button className="btn btn-secondary mt-3" onClick={onClose}>
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default UserPermissionPanel;
