import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useGlobalContext } from "../Context";
import authFetch from "../api";
import { useUser } from "../context/UserContext";
import {jwtDecode} from "jwt-decode";

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserBio } = useGlobalContext();
  const { login } = useUser(); // <-- use login function from context


  useEffect(() => {

    if (!location.search) return;

    const params = new URLSearchParams(location.search);

    // BACKEND SENDS `token`
    const accessToken =
      params.get("accessToken") ||
      params.get("token");

    const refreshToken =
      params.get("refreshToken") || null;

    if (!accessToken) {
      toast.error("OAuth login failed");
      navigate("/login");
      return;
    }

    try {

      const payload = jwtDecode(accessToken);

      const userData = {
        accessToken,
        refreshToken,

        userName: payload.firstName,
        email: payload.email,

        _id: payload._id,
        userId: payload._id,

        accessTokenExpiration: Date.now() + 20 * 60 * 1000,
        refreshTokenExpiration: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };

      // STORE USER
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", accessToken);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // SET AXIOS HEADER
      authFetch.defaults.headers.common.Authorization =
        `Bearer ${accessToken}`;

      // UPDATE CONTEXT
      login(userData);

      // REMOVE TOKEN FROM URL (SECURITY)
      window.history.replaceState(
        {},
        document.title,
        "/auth/success"
      );

      toast.success("Login successful");

      navigate("/dashboard", { replace: true });

    } catch (err) {

      console.error("Token decode failed:", err);

      toast.error("Authentication failed");

      navigate("/login");
    }

  }, [location.search]);




  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Authenticating...
        </h1>
        <p className="text-gray-600 mb-6">
          Please wait while we finalize your login. You’ll be redirected
          shortly.
        </p>

        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Not redirected?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Go back to login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AuthSuccess;
