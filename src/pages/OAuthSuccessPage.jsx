import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMe } from "../apis/authApi";

const Page = styled.main`
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
  background: ${({ theme }) => theme.colors.bgApp};
`;

const Status = styled.div`
  color: ${({ $error, theme }) =>
    $error ? "#e02424" : theme.colors.textDark};
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

export default function OAuthSuccessPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getMe()
      .then(({ data: user }) => {
        if (!active) return;
        navigate(user.onboardingCompletedAt ? "/archive" : "/onboarding", {
          replace: true,
        });
      })
      .catch(() => {
        if (!active) return;
        setError("로그인 세션을 확인할 수 없습니다. 다시 로그인해주세요.");
        window.setTimeout(() => navigate("/login", { replace: true }), 1800);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <Page>
      <Status $error={Boolean(error)}>
        {error || "로그인 정보를 확인하고 있습니다..."}
      </Status>
    </Page>
  );
}
