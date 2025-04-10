import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Rifansi Admin Portal",
  description: "Create a new account for Rifansi Admin Portal",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
