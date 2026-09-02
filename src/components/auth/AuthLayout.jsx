import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import iconNaver from "../../assets/images/icon-naver.svg";
import iconKakao from "../../assets/images/icon-kakao.svg";
import { SocialButton } from "../common/Button";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 833px;
  padding: 40px 24px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 0;

  img {
    width: 24px;
    height: 24px;
  }

  span {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fonts.h2.fontSize};
  font-weight: ${({ theme }) => theme.fonts.h2.fontWeight};
  letter-spacing: ${({ theme }) => theme.fonts.h2.letterSpacing};
  color: ${({ theme }) => theme.colors.textDark};
  text-align: center;
`;

const Subtitle = styled.p`
  margin-top: 8px;
  font-size: ${({ theme }) => theme.fonts.bodyEmphasis.fontSize};
  font-weight: ${({ theme }) => theme.fonts.bodyEmphasis.fontWeight};
  color: ${({ theme }) => theme.colors.textGray};
  text-align: center;
`;

const FormArea = styled.div`
  width: 100%;
  padding-top: 36px;
`;

const DividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-top: 24px;

  span {
    flex-shrink: 0;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textGray};
    white-space: nowrap;
  }
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

const SocialRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 16px;
`;

const BottomText = styled.p`
  margin-top: 12px;
  width: 100%;
  font-size: 12px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textGray};

  a {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Footer = styled.div`
  margin-top: 40px;
  padding-top: 28px;
  font-size: 12px;
  line-height: 19.2px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textFooter};
`;

export default function AuthLayout({
  title,
  subtitle,
  children,
  socialActionLabel,
  bottomText,
  bottomLinkText,
  bottomLinkTo,
}) {
  return (
    <Wrapper>
      <Container>
        <LogoRow>
          <img src={logo} alt="LogFolio" />
          <span>LogFolio</span>
        </LogoRow>

        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}

        <FormArea>{children}</FormArea>

        <DividerRow>
          <DividerLine />
          <span>또는 소셜 계정으로</span>
          <DividerLine />
        </DividerRow>

        <SocialRow>
          <SocialButton type="button" $bg="#03c75a" $color="#ffffff">
            <img src={iconNaver} alt="" />
            네이버로 {socialActionLabel}
          </SocialButton>
          <SocialButton type="button" $bg="#fee500" $color="#3c1e1e">
            <img src={iconKakao} alt="" />
            카카오로 {socialActionLabel}
          </SocialButton>
        </SocialRow>

        <BottomText>
          {bottomText} <Link to={bottomLinkTo}>{bottomLinkText}</Link>
        </BottomText>

        <Footer>
          <p>Footer 영역</p>
          <p>LogFolio@gmail.com</p>
        </Footer>
      </Container>
    </Wrapper>
  );
}
