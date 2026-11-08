import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../apis/authApi";
import AuthLayout from "../components/auth/AuthLayout";
import SignupForm from "../components/auth/SignupForm";

export default function SignupPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    getMe()
      .then(() => {
        if (active) navigate("/archive", { replace: true });
      })
      .catch(() => {
        // 로그인 세션이 없으면 회원가입 화면을 그대로 보여줍니다.
      });

    return () => {
      active = false;
    };
  }, [navigate]);

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
