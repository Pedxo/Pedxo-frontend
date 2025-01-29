import CustomForm from "../ui/CustomForm";
import { FcGoogle } from "react-icons/fc";
import CustomInput from "../ui/CustomInput";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

function SignUp() {
  return (
    <section className="w-full  flex py-20 items-center justify-center">
      <div className="w-full mx-auto md:w-1/2 md:max-w-[38em] gap-10 flex justify-center flex-col px-4">
        <h1 className="text-2xl font-semibold leading-normal 2xl:text-[30px] ">
          Create account
        </h1>
        <CustomForm>
          <Button size="large" type="accent" iconLeft={<FcGoogle size={21} />}>
            Continue with Google
          </Button>
          <div className="text-lg font-medium line-with-text">Or</div>
          <CustomInput
            placeholder="First name"
            label="First Name"
            type="text"
          />
          <CustomInput placeholder="Last name" label="Last Name" type="text" />
          <CustomInput placeholder="Email Address" label="Email" type="email" />
          <CustomInput
            placeholder="Password"
            label="Password"
            type="password"
          />
          <CustomInput
            placeholder="Confirm Password"
            label="Confirm Password"
            type="password"
          />

          <div className="flex flex-col w-full gap-3">
            <Button size="large" type="primary">
              Continue
            </Button>
            <p className="text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-sm hover:underline font-medium text-primary"
              >
                Login
              </Link>
            </p>
          </div>
        </CustomForm>
      </div>
    </section>
  );
}

export default SignUp;
