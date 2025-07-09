import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import PageComment from "../components/PageComment";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const PageWrapper = () => {
  const { pageName } = useParams();
  const { logoutUser } = useContext(AuthContext);
  const [userPermissions, setUserPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        // Decode token to get user_id
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const userId = decoded.user_id;

        // Fetch all permissions for this user
        const res = await axiosClient.get(`/permissions/?user=${userId}`);
        const pagePermissions = res.data
          .filter((perm) => perm.page === pageName)
          .map((perm) => perm.action);

        setUserPermissions({
          can_view: pagePermissions.includes("view"),
          can_edit: pagePermissions.includes("edit"),
          can_create: pagePermissions.includes("create"),
          can_delete: pagePermissions.includes("delete"),
        });
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setError("Failed to fetch permissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [pageName, navigate]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 text-capitalize">
          {pageName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </h2>
        <button onClick={logoutUser} className="btn btn-danger">
          Logout
        </button>
      </div>

      {userPermissions?.can_view ? (
        <>
          <p>Content for <strong>{pageName}</strong> would be rendered here.</p>
          <PageComment page={pageName} userPermissions={userPermissions} />
        </>
      ) : (
        <p className="text-muted">You do not have permission to view this page.</p>
      )}
    </div>
  );
};

export default PageWrapper;
