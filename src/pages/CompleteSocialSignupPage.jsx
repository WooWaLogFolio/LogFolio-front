import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  completeSocialSignup,
  getPendingSocialSignup,
} from "../apis/authApi";
import AuthLayout from "../components/auth/AuthLayout";
import TextField from "../components/common/TextField";
import { PrimaryButton } from "../components/common/Button";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`;

const Guide = styled.p`
  padding: 12px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.textLabel};
  font-size: 13px;
  line-height: 1.6;
`;

const ErrorText = styled.p`
  color: #e02424;
  font-size: 12px;
`;

const providerNames = {
  NAVER: "네이버",
  KAKAO: "카카오",
};

export default function CompleteSocialSignupPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getPendingSocialSignup()
      .then(({ data }) => {
        if (active) setPending(data);
      })
      .catch(() => {
        if (active) navigate("/login", { replace: true });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: user } = await completeSocialSignup(email);
      navigate(user.onboardingCompletedAt ? "/archive" : "/onboarding", {
        replace: true,
      });
    } catch (requestError) {
      const status = requestError.response?.status;
      if (status === 409) {
        setError("이미 가입된 이메일입니다. 기존 계정으로 로그인해주세요.");
      } else if (status === 400) {
        setError("올바른 이메일을 입력해주세요.");
      } else if (status === 401 || status === 403) {
        setError("가입 세션이 만료되었습니다. 소셜 로그인을 다시 진행해주세요.");
      } else {
        setError("가입 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const providerName = providerNames[pending?.provider] ?? "소셜";
  const subtitle = loading
    ? "가입 정보를 확인하고 있습니다."
    : `${providerName} 가입을 완료해주세요.`;

  return (
    <AuthLayout
      title="추가 정보 입력"
      subtitle={subtitle}
      socialActionLabel="계속하기"
      bottomText="이미 계정이 있으신가요?"
      bottomLinkText="로그인 하기"
      bottomLinkTo="/login"
      showSocialActions={false}
    >
      <Form onSubmit={handleSubmit}>
        {pending?.suggestedName && (
          <Guide>
            {pending.suggestedName}님, {providerName}에서 이메일 정보를 받지
            못했습니다. 사용할 이메일을 입력해주세요.
          </Guide>
        )}
        <TextField
          id="email"
          type="email"
          label="이메일"
          placeholder="name@university.ac.kr"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={loading}
        />
        {error && <ErrorText>{error}</ErrorText>}
        <PrimaryButton type="submit" disabled={loading || !pending}>
          가입 완료
        </PrimaryButton>
      </Form>
    </AuthLayout>
  );
}
