import styled from "styled-components";
import TextField from "../common/TextField";
import { PrimaryButton } from "../common/Button";
import { useSignup } from "../../hooks/useSignup";

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

const ErrorText = styled.p`
  font-size: 12px;
  color: #e02424;
`;

export default function SignupForm() {
  const { form, error, loading, handleChange, handleSubmit } = useSignup();

  return (
    <Form onSubmit={handleSubmit}>
      <FieldGroup>
        <TextField
          id="name"
          type="text"
          label="이름"
          placeholder="홍길동"
          value={form.name}
          onChange={handleChange}
          required
        />
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
          placeholder="8자 이상"
          minLength={8}
          value={form.password}
          onChange={handleChange}
          required
        />
        <TextField
          id="passwordConfirm"
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          value={form.passwordConfirm}
          onChange={handleChange}
          required
        />
      </FieldGroup>

      {error && <ErrorText>{error}</ErrorText>}

      <PrimaryButton type="submit" disabled={loading}>
        회원가입
      </PrimaryButton>
    </Form>
  );
}
