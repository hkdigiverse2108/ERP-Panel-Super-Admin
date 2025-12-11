import * as Yup from "yup";
import { Validation } from "./Validation.ts";

// ---------- Reusable helpers ----------

const ImageSchema = (label: string, required = true) => Validation("array", label, required ? { minItems: 1 } : { required: false });

// Signin
export const SigninSchema = Yup.object({
  email: Validation("string", "Email", { extraRules: (s) => s.email("Invalid email address") }),
  password: Validation("string", "Password", { extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character") }),
});
