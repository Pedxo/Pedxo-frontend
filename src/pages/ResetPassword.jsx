import { useState } from "react";
import FormInput from "../components/FormInput";
import authFetch from "../api";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authFetch.post(
        "/auth/forgot-password", 
        JSON.stringify({ email })
      );
      
      if (response.status === 200 || response.status === 201) {
        toast.success("Password reset link sent to your email");
        setLinkSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {linkSent ? "Check Your Email" : "Reset Password"}
        </h1>

        {!linkSent ? (
          <form onSubmit={handleResetRequest} className="space-y-4">
            <FormInput
              htmlFor="email"
              label="Email Address"
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
            </p>
            <p className="text-gray-600">
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <button
              onClick={() => setLinkSent(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Didn&apos;t receive it? Try again
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResetPassword;