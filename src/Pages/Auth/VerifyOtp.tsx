import { Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutations } from "../../Api";
import { CommonButton, CommonValidationTextField } from "../../Attribute";
import { ImagePath, ROUTES, STORAGE_KEYS, ThemeTitle } from "../../Constants";
import ThemeToggler from "../../Layout/ThemeToggler";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { setSignin } from "../../Store/Slices/AuthSlice";
import { Storage, VerifyOtpSchema } from "../../Utils";

const OTP_DURATION = 600;

const VerifyOtp = () => {
  const [seconds, setSeconds] = useState<number>(OTP_DURATION);
  const { signinResponse } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { mutate: VerifyOtp, isPending: isVerifyOtpPending } = Mutations.useVerifyOtp();
  const { mutate: ResendOtp, isPending: isResendOtpPending } = Mutations.useResendOtp();

  const handleSubmit = (values: { otp: string }) => {
    const payload = {
      email: signinResponse?.email || "",
      otp: values.otp,
    };
    VerifyOtp(payload, {
      onSuccess: () => {
        dispatch(setSignin(signinResponse));
        navigate(ROUTES.DASHBOARD);
        Storage.removeItem(STORAGE_KEYS.OTP_EXPIRY_KEY);
      },
    });
  };

  useEffect(() => {
    const savedExpiry = localStorage.getItem(STORAGE_KEYS.OTP_EXPIRY_KEY);

    if (savedExpiry) {
      const expiryTime = parseInt(savedExpiry, 10);
      const now = Date.now();
      const remaining = Math.floor((expiryTime - now) / 1000);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSeconds(remaining > 0 ? remaining : 0);
    } else {
      const newExpiry = Date.now() + OTP_DURATION * 1000;
      localStorage.setItem(STORAGE_KEYS.OTP_EXPIRY_KEY, newExpiry.toString());
      setSeconds(OTP_DURATION);
    }
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleResend = async () => {
    ResendOtp(
      {
        email: signinResponse?.email || "",
      },
      {
        onSuccess: () => {
          const newExpiry = Date.now() + OTP_DURATION * 1000;
          localStorage.setItem(STORAGE_KEYS.OTP_EXPIRY_KEY, newExpiry.toString());
          setSeconds(OTP_DURATION);
        },
      },
    );
  };

  useEffect(() => {
    if (!signinResponse?.email) {
      navigate(ROUTES.AUTH.SIGNIN);
      Storage.clear();
    }
  }, [navigate, signinResponse]);

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen relative">
      {/* LEFT PANEL (form) */}
      <div className="hidden w-full lg:grid lg:w-1/2 h-full bg-brand-950 relative dark:bg-white/5">
        <div>
          <img src={`${ImagePath}logo/grid-01.svg`} alt="pattern" className=" absolute w-full z-1 right-0 top-0  max-w-[300px] xl:max-w-[500px]" />
        </div>
        <div>
          <img src={`${ImagePath}logo/grid-01.svg`} alt="pattern" className="absolute bottom-0 left-0  w-full max-w-[300px] rotate-180 xl:max-w-[500px]" />
        </div>

        <div className="absolute overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
          <img src={`${ImagePath}logo/logo-dark.png`} alt="Ai Setu Logo" className="w-39 h-11" />
          <p className="text-gray-300 text-sm flex pt-3">{ThemeTitle}</p>
        </div>
      </div>

      {/* RIGHT PANEL (fixed) */}
      <div className="flex flex-col flex-1 w-full h-full px-5 pt-10 lg:px-10 ">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-10 lg:mt-0 gap-10">
          <div>
            <div className="mb-4 sm:mb-5">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Verify OTP</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enter the 6-digit Verification Code</p>
            </div>
            <Formik initialValues={{ otp: "" }} validationSchema={VerifyOtpSchema} onSubmit={handleSubmit}>
              <Form>
                <Grid container spacing={2}>
                  <CommonValidationTextField name="otp" label="OTP" placeholder="Enter your OTP" type="number" maxDigits={6} required isFormLabel grid={{ xs: 12 }} />
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-black">Didn’t get the code? </span>
                    {seconds > 0 ? <span className="font-bold text-primary">Resend in {formatTime(seconds)}</span> : <CommonButton loading={isResendOtpPending} type="button" variant="text" title="Resend Code" onClick={handleResend} />}
                  </div>
                  <CommonButton loading={isVerifyOtpPending} type="submit" variant="contained" title="Verify OTP" size="medium" fullWidth grid={{ xs: 12 }} />
                </Grid>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
      {/* GLOBAL MOON BUTTON – FIXED ALWAYS */}
      <div className="fixed bottom-5 right-5 z-50">
        <ThemeToggler />
      </div>
    </div>
  );
};

export default VerifyOtp;
