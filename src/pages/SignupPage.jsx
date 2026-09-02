import AuthLayout from "../components/auth/AuthLayout";
import SignupForm from "../components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="회원가입"
      socialActionLabel="회원가입"
      bottomText="아직 계정이 있으신가요?"
      bottomLinkText="로그인 하기"
      bottomLinkTo="/login"
    >
      <SignupForm />
    </AuthLayout>
  );
}
