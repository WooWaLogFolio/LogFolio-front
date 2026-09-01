import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="로그인"
      subtitle="다시 오신 걸 환영합니다!"
      socialActionLabel="로그인"
      bottomText="아직 계정이 없으신가요?"
      bottomLinkText="회원가입 하기"
      bottomLinkTo="/signup"
    >
      <LoginForm />
    </AuthLayout>
  );
}
