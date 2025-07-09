import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import API from "../utils/api";

const Profile = () => {
  const { userInfo, logoutUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: "" });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setFormData({ username: userInfo.username });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await API.put("/profile/", formData);
      setSuccess("Profile updated successfully.");
    } catch {
      setError("Failed to update profile.");
    }
  };

  if (!userInfo) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Edit Profile</h2>
      <p>Email: <strong>{userInfo.email}</strong></p>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Update</button>
        <button type="button" className="btn btn-secondary ms-3" onClick={logoutUser}>Logout</button>
      </form>
    </div>
  );
};

export default Profile;