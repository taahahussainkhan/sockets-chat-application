import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import toast from "react-hot-toast";

const OTPVerification = ({ email, onVerified }) => {
  const [otp, setOtp] = useState("");
  const { verifyOTP, isVerifyingOTP } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }
    const success = await verifyOTP({ email, otp });
    if (success) onVerified();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Verify Your Email</h2>
      <p className="mb-4">
        An OTP has been sent to <strong>{email}</strong>. Please enter it below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="input input-bordered w-full text-center text-xl tracking-widest"
          placeholder="Enter OTP"
          autoFocus
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isVerifyingOTP}
        >
          {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
