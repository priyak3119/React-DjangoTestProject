import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

const PAGES = [
  { key: "products", label: "Products List" },
  { key: "marketing", label: "Marketing List" },
  { key: "order", label: "Order List" },
  { key: "media_plans", label: "Media Plans" },
  { key: "offer_pricing_skus", label: "Offer Pricing SKUs" },
  { key: "clients", label: "Clients" },
  { key: "suppliers", label: "Suppliers" },
  { key: "customer_support", label: "Customer Support" },
  { key: "sales_reports", label: "Sales Reports" },
  { key: "finance_accounting", label: "Finance & Accounting" },
];

const UserDashboard = ({ userInfo, logoutUser }) => {
  const navigate = useNavigate();

  // Filter based on permissions
  const allowedPages = Object.entries(userInfo.permissions || {}).filter(
    ([_, perms]) => perms.view
  ).map(([key]) => key);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Dashboard</h2>
        <Button variant="danger" onClick={logoutUser}>Logout</Button>
      </div>
      <p>Welcome, <strong>{userInfo.username}</strong></p>

      <div className="row">
        {PAGES.filter(p => allowedPages.includes(p.key)).map((page) => (
          <div className="col-md-4 mb-4" key={page.key}>
            <Card className="h-100 shadow-sm" onClick={() => navigate(`/page/${page.key}`)} style={{ cursor: 'pointer' }}>
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Card.Title>{page.label}</Card.Title>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {allowedPages.length === 0 && (
        <div className="alert alert-warning text-center">
          You do not have access to any pages.
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
