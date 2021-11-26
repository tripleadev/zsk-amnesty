import { object, string, TypeOf } from "yup";

export const LoginInputSchema = object({
  email: string().required("E-Mail is required").email("E-Mail must be valid"),
  password: string()
    .required("Password is required")
    .min(8, "Password should be at least 8 characters"),
});

export type LoginInput = TypeOf<typeof LoginInputSchema>;
