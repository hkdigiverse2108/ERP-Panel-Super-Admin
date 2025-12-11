import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { CommonButton, CommonTextField } from "../../Attribute";
import { ImagePath, ROUTES } from "../../Constants";
import ThemeToggler from "../../Layout/ThemeToggler";
import { SigninSchema } from "../../Utils/ValidationSchemas";
import { Mutations } from "../../Api";
import type { LoginPayload } from "../../Types";
import { useAppDispatch } from "../../Store/hooks";
import { useNavigate } from "react-router-dom";
import { setSignin } from "../../Store/Slices/AuthSlice";

const SignInForm = () => {
  const { mutate: Signin, isPending: isSigninPending } = Mutations.useSignin();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginPayload,{ resetForm }: FormikHelpers<LoginPayload>) => {
    Signin({...values,email:values.email.toLowerCase()}, {
      onSuccess: (response) => {
        dispatch(setSignin(response?.data));
        navigate(ROUTES.DASHBOARD);
        resetForm()
      },
    });
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen relative">
      {/* LEFT PANEL (form) */}
      <div className="flex flex-col flex-1 w-full h-full px-5 pt-10 lg:px-10 ">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-10 lg:mt-0 gap-10">
          <div>
            <div className="mb-4 sm:mb-5">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Sign In</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enter your email and password to sign in!</p>
            </div>
            <Formik initialValues={{ email: "", password: "" }} validationSchema={SigninSchema} onSubmit={handleSubmit}>
              <Form>
                <Grid container spacing={2}>
                  <CommonTextField name="email" label="Email ID" placeholder="Enter your email" required isFormLabel grid={{ xs: 12 }} />
                  <CommonTextField name="password" label="password" type="password" placeholder="Enter your password" required isFormLabel showPasswordToggle grid={{ xs: 12 }} />
                  <CommonButton loading={isSigninPending} type="submit" variant="contained" title="Sign In" size="medium" fullWidth grid={{ xs: 12 }} />
                </Grid>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (fixed) */}
      <div className="hidden w-full lg:grid lg:w-1/2 h-full bg-brand-950 relative dark:bg-white/5">
        <div>
          <img src={`${ImagePath}logo/grid-01.svg`} alt="pattern" className=" absolute w-full z-1 right-0 top-0  max-w-[300px] xl:max-w-[500px]" />
        </div>
        <div>
          <img src={`${ImagePath}logo/grid-01.svg`} alt="pattern" className="absolute bottom-0 left-0  w-full max-w-[300px] rotate-180 xl:max-w-[500px]" />
        </div>

        <div className="absolute overflow-hidden  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
          <img src={`${ImagePath}logo/logo-dark.svg`} alt="TailAdmin Logo" className="w-60 h-20" />
          <p className="text-gray-300 text-sm flex">
            Free and Open-Source Tailwind CSS Admin
            <br />
            Dashboard Template
          </p>
        </div>
      </div>

      {/* GLOBAL MOON BUTTON – FIXED ALWAYS */}
      <div className="fixed bottom-5 right-5 z-50">
        <ThemeToggler />
      </div>
    </div>
  );
};

export default SignInForm;
