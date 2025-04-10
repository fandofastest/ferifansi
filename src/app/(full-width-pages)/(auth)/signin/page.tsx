import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Rifansi Admin Portal",
  description: "Sign in to access Rifansi Admin Portal",
};

export default function SignIn() {
  return <SignInForm />;
}
