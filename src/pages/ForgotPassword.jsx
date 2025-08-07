import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import authFetch from "../api";
import FormInput from "../components/FormInput";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authFetch.post(
        "/auth/reset-password",
        JSON.stringify({
          email: email,
          password: password,
          // token: token 
        })
      );

      // Handle successful response
      if (response.data === "Password Change Successfully") {
        toast.success("Password reset successfully!");
        setTimeout(() => navigate("/login"), 1500); // Redirect after 1.5 seconds
      } else {
        // Handle unexpected successful response
        toast.error("Unexpected response from server");
        console.warn("Unexpected response:", response);
      }
    } catch (error) {
      // Handle error responses
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Password reset failed";
      toast.error(errorMessage);
      
      // Specific handling for token errors
      if (error.response?.data?.message?.includes("token")) {
        toast.error("Invalid or expired token. Please request a new reset link.");
      }
      
      console.error("Reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Reset Your Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            htmlFor="email"
            label="Email Address"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormInput
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <FormInput
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;