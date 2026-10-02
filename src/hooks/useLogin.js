import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, login } from "../apis/authApi";

export function useLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      const { data: user } = await getMe();
      navigate(user.onboardingCompletedAt ? "/archive" : "/onboarding", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ??
          err.response?.data?.detail ??
          "이메일 또는 비밀번호를 확인해주세요.",
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, error, loading, handleChange, handleSubmit };
}
