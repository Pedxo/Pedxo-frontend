import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useGlobalContext } from "../Context";
import authFetch from "../api";

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserBio } = useGlobalContext();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
        const fetchUser = async() => {
      try {
       

        const result = await authFetch.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
      });

      const user = result.data;
            const refreshToken = user?.refreshToken;

        if (!user || !refreshToken) {
          toast.error("Unable to get user details");
          navigate("/login", { replace: true });
          return;
        }
        setUserBio(user);
         const accessTokenExpiration = Date.now() + 1200000;
         
        const refreshTokenExpiration = Date.now() + 604800000;
        const tokenData = {
          accessToken: token,
          accessTokenExpiration,
          userName: user?.firstName,
          refreshTokenExpiration,
          refreshToken,
          ...user,
        };
        localStorage.setItem("user", JSON.stringify(tokenData));

        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        navigate("/login", { replace: true });
      }
    }
    fetchUser();

    } else {
      toast.error("No token found in redirect.");
      navigate("/login", { replace: true });
    }
  }, []);

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
