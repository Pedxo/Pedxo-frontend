import { Link, useNavigate } from "react-router-dom";
import googleLogo from "../assets/svg/google-logo.svg";
import GitHubLogo from "../assets/svg/githubLogo.svg";
import FormInput from "../components/FormInput";
import useLogin from "../features/auth/useLogin";
import * as Yup from "yup";
import { useFormik } from "formik";
import MiniLoader from "../components/MiniLoader";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useLogin();
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
      login(values, {
        onSuccess: () => {
          navigate("/dashboard");
        },

        onSettled: () => setSubmitting(false),
      });
    },
  });

  return (
    <section className="w-full mx-auto md:w-1/2 md:max-w-[38em] flex justify-center flex-col px-4 h-screen">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
        <h1 className="mb-[39px] text-2xl font-semibold leading-normal 2xl:text-[30px] ">
          Login
        </h1>
        <div className="flex sm:space-x-4 sm:flex-row flex-col space-x-0">
          <button className="w-full flex items-center justify-center p-2 gap-[5px] sm:gap-[1-px] border-[2px] overview-expense-bg rounded-lg mb-[15px]">
            <img src={GitHubLogo} alt="github logo" className="w-6 h-6" />
            <span className="font-medium text-xs sm:text-sm">
              Continue with Github
            </span>
          </button>
          <button className="w-full flex items-center justify-center p-2 gap-[5px] sm:gap-[1-px] border-[2px] overview-expense-bg rounded-lg mb-[15px]">
            <img src={googleLogo} alt="google logo" />
            <span className="font-medium text-xs sm:text-sm">
              Continue with Google
            </span>
          </button>
        </div>
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
            />
          </div>

          <div className="pr-text-clr font-medium text-right sm:text-base text-xs -mt-2">
            <Link to="/reset-password">Forgot password?</Link>
          </div>
          <button
            type="submit"
            className="sm:py-4 py-3 font-medium pr-bg-clr text-white sm:text-base text-xs w-full mt-[6px] rounded-lg"
          >
            {isLoggingIn ? <MiniLoader /> : "Continue"}
          </button>
        </form>
        <div className="flex gap-1 flex-wrap justify-center sm:text-base text-xs items-center mt-[10px] font-medium">
          <span>Don&apos;t have an account?</span>
          <div className="pr-text-clr sm:text-base text-xs">
            <Link to="/signup">Create account</Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Login;

//  const [isLoading, setIsLoading] = useState(false);
// const [formData, setFormData] = useState({
//   email: "",
//   password: "",
// });

// const { setUserBio } = useGlobalContext();
// const navigate = useNavigate();

// const validateForm = () => {
//   if (!formData.email.trim()) {
//     toast.error("email is required.");
//     return false;
//   } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//     toast.error("invalid email format.");
//     return false;
//   } else if (!formData.password.trim()) {
//     toast.error("password should not be empty.");
//     return false;
//   }

//   return true;
// };

// const handleChange = (e) => {
//   setFormData({
//     ...formData,
//     [e.target.name]: e.target.value,
//   });
// };

// const handleFormSubmit = async (e) => {
//   e.preventDefault();
//   setIsLoading(true);

//   if (validateForm()) {
//     try {
//       const response = await authFetch.post(
//         "/auth/login",
//         JSON.stringify(formData)
//       );
//       toast.success("Welcome!");
//       const token = response.data.result;
//       const accessTokenExpiration = Date.now() + 1200000;
//       const refreshTokenExpiration = Date.now() + 604800000;

//       const tokenData = {
//         accessToken: token.accessToken,
//         refreshToken: token.refreshToken,
//         accessTokenExpiration,
//         refreshTokenExpiration,
//       };
//       localStorage.setItem("user", JSON.stringify(tokenData));
//       setTimeout(() => {
//         navigate("/");
//       }, 2000);
//       console.log(response);

//       const userBio = response.data.result;
//       setUserBio(userBio);
//       console.log(userBio);
//     } catch (error) {
//       console.log(error);
//       if (error.status === 400) {
//         toast.error("invalid email or password");
//       } else if (error.response.data.message === "user is not found") {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error(error);
//       }
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   } else {
//     setIsLoading(false);
//   }
// };
