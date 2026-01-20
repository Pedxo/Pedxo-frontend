import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import useLogin from "../features/auth/useLogin";
import * as Yup from "yup";
import { useFormik } from "formik";
import MiniLoader from "../components/MiniLoader";
import Socials from "../components/Socials";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useLogin();
  const [socialLoading, setSocialLoading] = useState({ 
    loading: false, 
    provider: null 
  });
  
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (socialLoading.loading) return; // Prevent form submission during social loading
      
      login(values, {
        onSuccess: () => {
          navigate("/dashboard");
        },
        onSettled: () => setSubmitting(false),
      });
    },
  });

  const handleSocialLoadingChange = ({ loading, provider }) => {
    setSocialLoading({ loading, provider });
  };

  // Function to capitalize first letter of provider name
  const capitalizeFirst = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  };

  return (
    <section className="w-full mx-auto md:w-1/2 md:max-w-[38em] flex justify-center flex-col px-4 h-screen">
      <div className={`w-full max-w-lg bg-white rounded-xl shadow-md p-6 relative ${socialLoading.loading ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Loading Overlay */}
        {socialLoading.loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="animate-spin h-8 w-8 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
              <span className="text-sm font-medium">
                Redirecting to {capitalizeFirst(socialLoading.provider)}...
              </span>
            </div>
          </div>
        )}
        
        <h1 className="mb-[39px] text-2xl font-semibold leading-normal 2xl:text-[30px] ">
          Login to continue
        </h1>
        
        <Socials 
          onLoadingChange={handleSocialLoadingChange}
        />
        
        <div className="text-lg font-medium line-with-text">Or</div>
        
        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <FormInput
            error={Boolean(formik.errors.email)}
            errorMessage={formik.errors.email}
            htmlFor="email"
            label="Email"
            type="email"
            name="email"
            onBlur={formik.handleBlur}
            id="email"
            placeholder="email address"
            value={formik.values.email}
            onChange={formik.handleChange}
            disabled={socialLoading.loading}
          />

          <div className="relative ">
            <FormInput
              htmlFor="password"
              label="Password"
              type={"password"}
              name="password"
              id="password"
              onBlur={formik.handleBlur}
              placeholder="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.password)}
              errorMessage={formik.errors.password}
              disabled={socialLoading.loading}
            />
          </div>

          <div className="pr-text-clr font-medium text-right sm:text-base text-xs -mt-2">
            <Link 
              to="/reset-password" 
              className={socialLoading.loading ? "pointer-events-none opacity-50" : ""}
            >
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            className={`sm:py-4 py-3 font-medium pr-bg-clr text-white sm:text-base text-xs w-full mt-[6px] overview-expense ${socialLoading.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={socialLoading.loading || isLoggingIn}
          >
            {isLoggingIn ? <MiniLoader /> : "Continue"}
          </button>
        </form>
        
        <div className="flex gap-1 flex-wrap justify-center sm:text-base text-xs items-center mt-[10px] font-medium">
          <span>Don&apos;t have an account?</span>
          <div className="pr-text-clr sm:text-base text-xs">
            <Link 
              to="/signup" 
              className={socialLoading.loading ? "pointer-events-none opacity-50" : ""}
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;