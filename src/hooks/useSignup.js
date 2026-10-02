import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../apis/authApi";

export function useSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      const { data: user } = await signup(form);
      navigate(user.onboardingCompletedAt ? "/archive" : "/onboarding", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ??
          err.response?.data?.detail ??
          "회원가입에 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, error, loading, handleChange, handleSubmit };
}
