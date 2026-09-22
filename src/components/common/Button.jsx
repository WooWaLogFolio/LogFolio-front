import styled from "styled-components";

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 16px 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fonts.button.fontSize};
  font-weight: ${({ theme }) => theme.fonts.button.fontWeight};
  text-align: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SocialButton = styled.button`
  display: flex;
  flex: 1;
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};

  img {
    width: 18px;
    height: 18px;
  }
`;

export const TextLinkButton = styled.button`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textGray};
`;

export const ToggleButton = styled.button`
  height: 48px;
  padding: 0 24px;
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: 8px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : theme.colors.white};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textDark};
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
`;

export const TagButton = styled.button`
  height: 40px;
  padding: 0 16px;
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: 100px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : theme.colors.white};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textDark};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
`;

export const NextButton = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: ${({ disabled, theme }) =>
    disabled ? theme.colors.border : theme.colors.primary};
  color: ${({ disabled, theme }) => (disabled ? theme.colors.textGray : theme.colors.white)};
  font-size: 15px;
  font-weight: 600;

  &:disabled {
    cursor: not-allowed;
  }
`;
