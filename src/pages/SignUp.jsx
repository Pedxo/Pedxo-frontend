import { Link, useNavigate } from "react-router-dom";
// import googleLogo from "../assets/svg/google-logo.svg";
// import GitHubLogo from '../assets/svg/githubLogo.svg';
import FormInput from "../components/FormInput";
import { useState } from "react";
import { useGlobalContext } from "../Context";
import toast from "react-hot-toast";
import authFetch from "../api";
import Socials from "../components/Socials"

const SignUp = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const { setUserBio } = useGlobalContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const validateForm = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()_+!])[A-Za-z\d@#$%^&*()_+!]{8,24}$/;
    if (!formData.firstName.trim()) {
      toast.error("first name is required.");
      return false;
    } else if (!formData.lastName.trim()) {
      toast.error("last name is required.");
      return false;
    } else if (!formData.email.trim()) {
      toast.error("email is required.");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("invalid email format.");
      return false;
    } else if (!formData.password.trim()) {
      toast.error("password should not be empty.");
      return false;
    } else if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return false;
    } else if (!confirmPassword.trim()) {
      toast.error("confirm password is required.");
      return false;
    } else if (formData.password !== confirmPassword) {
      toast.error("passwords do not match.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm()) {
      try {
        const response = await authFetch.post(
          "/auth",
          JSON.stringify(formData)
        );
        if (response.data === "success" || response.status === 201) {
          const userBio = response.data.result;
          setUserBio(userBio);
          toast.success("Check mail for otp");
          setTimeout(() => {
            navigate("/account-verification", {
              state: { email: formData.email },
            });
          }, 2000);
        }

        const tokenResp = response.data.result;
        const accessTokenExpiration = Date.now() + 1200000;
        const refreshTokenExpiration = Date.now() + 604800000;

        const tokenData = {
          accessToken: tokenResp.accessToken,
          refreshToken: tokenResp.refreshToken,
          accessTokenExpiration,
          refreshTokenExpiration,
        };
        localStorage.setItem("user", JSON.stringify(tokenData));
       
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message === "email already exist"
        ) {
          toast.error("email already exists.");
          return false;
        }
        toast.error(error.response.data.message);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create account
        </h1>
        {/* <div className="flex sm:space-x-4 sm:flex-row flex-col space-x-0">
          <button className="w-full flex items-center justify-center p-2 gap-[5px] sm:gap-[1-px] border-[2px] overview-expense-bg rounded-lg mb-[15px]">
            <img src={GitHubLogo} alt="github logo" className="w-6 h-6" />
            <span className="font-medium text-xs sm:text-base">Github</span>
          </button>
          <button className="w-full flex items-center justify-center p-2 gap-[5px] sm:gap-[1-px] border-[2px] overview-expense-bg rounded-lg mb-[15px]">
            <img src={googleLogo} alt="google logo" />
            <span className="font-medium text-xs sm:text-base">Google</span>
          </button>
        </div> */}
        <Socials isRegisterPage />

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 font-medium">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              htmlFor="firstName"
              label="First Name"
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full"
            />

            <FormInput
              htmlFor="lastName"
              label="Last Name"
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <FormInput
            htmlFor="email"
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="relative">
            <FormInput
              htmlFor="password"
              label="Password"
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            {/* <button
              type="button"
              className="absolute right-1 top-[42px] p-1 rounded-md hover:bg-gray-100"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <img
                src={isPasswordVisible ? eyesolid : eyeslashsolid}
                alt={isPasswordVisible ? "Hide password" : "Show password"}
                className="w-5 h-5"
              />
            </button> */}
          </div>

          <div className="relative">
            <FormInput
              htmlFor="confirmPassword"
              label="Confirm Password"
              type={isConfirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {/* <button
              type="button"
              className="absolute right-1 top-[42px] p-1 rounded-md hover:bg-gray-100"
              onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
            >
              <img
                src={isConfirmPasswordVisible ? eyesolid : eyeslashsolid}
                alt={isConfirmPasswordVisible ? "Hide password" : "Show password"}
                className="w-5 h-5"
              />
            </button> */}
          </div>

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
              "Continue"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
