import React, { useState, useEffect } from "react";
import API from "../utils/api";

const CommentHistoryTooltip = ({ commentId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.get(`/comments/${commentId}/history/`)
      .then((res) => setHistory(res.data))
      .catch(() => setError("Failed to load history"))
      .finally(() => setLoading(false));
  }, [commentId]);

  if (loading) return <span className="text-muted">Loading history...</span>;
  if (error) return <span className="text-danger">{error}</span>;

  return (
    <div className="bg-light p-2 rounded border mt-2">
      <h6 className="fw-bold">Modification History</h6>
      <ul className="list-unstyled mb-0 small">
        {history.map((h, index) => (
          <li key={index}>
            <span className="fw-semibold">{h.modified_by.username}</span>: "{h.text}"<br />
            <span className="text-muted">{new Date(h.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentHistoryTooltip;