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
