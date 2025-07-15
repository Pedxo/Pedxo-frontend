import { Link, useNavigate } from "react-router-dom";
import googleLogo from "../assets/svg/google-logo.svg";
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
      <div className=" w-full">
        <h1 className="mb-[59px] text-2xl font-semibold leading-normal 2xl:text-[30px] ">
          Login
        </h1>
        <button className="w-full flex items-center justify-center p-4 gap-[10px] border border-black rounded-lg mb-[15px]">
          <img src={googleLogo} alt="google logo" />
          <span className="font-medium">Continue with Google</span>
        </button>
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

          <div className="pr-text-clr font-medium">
            <Link to="/reset-password-otp">Forgot password?</Link>
          </div>
          <button
            type="submit"
            className="py-4 font-medium pr-bg-clr text-white w-full mt-[6px] rounded-lg"
          >
            {isLoggingIn ? <MiniLoader /> : "Continue"}
          </button>
        </form>
        <div className="flex gap-2 text-[15px] mt-[13px] font-medium">
          <span>Don&apos;t have an account?</span>
          <div className="pr-text-clr">
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
