import React, { useState } from "react";
import API from "../utils/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSendOtp = async () => {
    setError(null);
    try {
      await API.post("/auth/request-reset/", { email });
      setStep(2);
    } catch {
      setError("Failed to send OTP");
    }
  };

  const handleResetPassword = async () => {
    setError(null);
    try {
      await API.post("/auth/reset-password/", {
        email,
        otp,
        new_password: newPassword,
      });
      setSuccess("Password reset successful. You can now log in.");
      setStep(3);
    } catch {
      setError("Failed to reset password");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Forgot Password</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {step === 1 && (
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleSendOtp}>
            Send OTP
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="mb-3">
            <label>OTP</label>
            <input
              type="text"
              className="form-control"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-success" onClick={handleResetPassword}>
            Reset Password
          </button>
        </div>
      )}

      {step === 3 && <p className="text-success mt-3">You can now login.</p>}
    </div>
  );
};

export default ForgotPassword;
