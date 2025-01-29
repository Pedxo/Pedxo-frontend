import { FcGoogle } from "react-icons/fc";
import Button from "../ui/Button";
import CustomForm from "../ui/CustomForm";
import CustomInput from "../ui/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import MiniLoader from "../ui/MiniLoader";
import useLogin from "../features/auth/useLogin";
import toast from "react-hot-toast";

function Login() {
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
          navigate("/");
        },

        onSettled: () => setSubmitting(false),
      });
    },
  });

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <div className="w-full mx-auto md:w-1/2 md:max-w-[38em] gap-10 flex justify-center flex-col px-4">
        <h1 className="text-2xl font-semibold leading-normal 2xl:text-[30px] ">
          Login
        </h1>
        <CustomForm onSubmit={formik.handleSubmit}>
          <Button size="large" type="accent" iconLeft={<FcGoogle size={21} />}>
            Continue with Google
          </Button>
          <div className="text-lg font-medium line-with-text">Or</div>
          <CustomInput
            placeholder="Email Address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isLoggingIn || formik.isSubmitting}
            value={formik.values.email}
            name="email"
            error={Boolean(formik.errors.email)}
            errorMessage={formik.errors.email}
            label="Email"
            type="email"
          />
          <CustomInput
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isLoggingIn || formik.isSubmitting}
            value={formik.values.password}
            name="password"
            error={Boolean(formik.errors.password)}
            errorMessage={formik.errors.password}
            label="Password"
            type="password"
          />
          <Link
            to="/"
            className="text-sm hover:underline font-medium text-primary"
          >
            Forgot Password?
          </Link>
          <div className="flex flex-col w-full gap-3">
            <Button
              disabled={!formik.isValid || formik.isSubmitting}
              size="large"
              buttonType="submit"
              type="primary"
            >
              {formik.isSubmitting || isLoggingIn ? <MiniLoader /> : "Continue"}
            </Button>
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-sm hover:underline font-medium text-primary"
              >
                Create account
              </Link>
            </p>
          </div>
        </CustomForm>
      </div>
    </section>
  );
}

export default Login;
