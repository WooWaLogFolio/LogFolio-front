import styled from "styled-components";
import { Link } from "react-router-dom";
import TextField from "../common/TextField";
import { PrimaryButton } from "../common/Button";
import { useLogin } from "../../hooks/useLogin";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`;

const ForgotPasswordRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const ForgotPasswordLink = styled(Link)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textGray};
`;

const ErrorText = styled.p`
  font-size: 12px;
  color: #e02424;
`;

export default function LoginForm() {
  const { form, error, loading, handleChange, handleSubmit } = useLogin();

  return (
    <Form onSubmit={handleSubmit}>
      <FieldGroup>
        <TextField
          id="email"
          type="email"
          label="이메일"
          placeholder="name@university.ac.kr"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          id="password"
          type="password"
          label="비밀번호"
          placeholder="비밀번호 입력"
          value={form.password}
          onChange={handleChange}
          required
        />
        <ForgotPasswordRow>
          <ForgotPasswordLink to="/find-password">비밀번호를 잊으셨나요?</ForgotPasswordLink>
        </ForgotPasswordRow>
      </FieldGroup>

      {error && <ErrorText>{error}</ErrorText>}

      <PrimaryButton type="submit" disabled={loading}>
        로그인
      </PrimaryButton>
    </Form>
  );
}
