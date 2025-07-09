// frontend/src/components/PageComment.js
import React, { useEffect, useState, useCallback } from "react";
import API from "../utils/api";

const PageComment = ({ page, userPermissions }) => {
  const [comments, setComments] = useState([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(() => {
    setLoading(true);
    setError(null);
    API.get(`/comments/?page=${page}`)
      .then((res) => setComments(res.data))
      .catch(() => setError("Failed to load comments"))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCreate = async () => {
    if (!newText.trim()) return;
    setActionLoadingId("create");
    setError(null);
    try {
      await API.post("/comments/", { page, text: newText });
      setNewText("");
      fetchComments();
    } catch {
      setError("Failed to add comment");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdate = async (id, text) => {
    if (!text) return;
    setActionLoadingId(id);
    setError(null);
    try {
      await API.put(`/comments/${id}/`, { page, text });
      fetchComments();
    } catch {
      setError("Failed to update comment");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    setActionLoadingId(id);
    setError(null);
    try {
      await API.delete(`/comments/${id}/`);
      fetchComments();
    } catch {
      setError("Failed to delete comment");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="mt-4">
      <h4>Comments for {page}</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      {userPermissions?.view ? (
        <>
          <ul className="list-group mb-3">
            {comments.map((c) => (
              <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{c.text}</span>
                <div>
                  {userPermissions?.edit && (
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        const edited = prompt("Edit comment:", c.text);
                        if (edited !== null) handleUpdate(c.id, edited);
                      }}
                      disabled={actionLoadingId === c.id}
                    >
                      {actionLoadingId === c.id ? "Saving..." : "Edit"}
                    </button>
                  )}
                  {userPermissions?.delete && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(c.id)}
                      disabled={actionLoadingId === c.id}
                    >
                      {actionLoadingId === c.id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {userPermissions?.create && (
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Add a new comment"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                disabled={actionLoadingId === "create"}
              />
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={actionLoadingId === "create"}
              >
                {actionLoadingId === "create" ? "Adding..." : "Add Comment"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-muted">You do not have permission to view comments on this page.</p>
      )}
    </div>
  );
};

export default PageComment;