import styled from "styled-components";
import logo from "../../assets/images/logo.svg";

const Header = styled.header`
  height: 57px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 80px);
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;

  @media (max-width: 720px) {
    width: calc(100% - 32px);
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
`;

const Brand = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.5px;

  img {
    width: 24px;
    height: 24px;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 2px;
`;

const NavButton = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textGray};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 700;
`;

export default function AppHeader({ onArchiveClick }) {
  return (
    <Header>
      <Inner>
        <Left>
          <Brand type="button" onClick={onArchiveClick}>
            <img src={logo} alt="" />
            LogFolio
          </Brand>
          <Navigation aria-label="주요 메뉴">
            <NavButton type="button" $active onClick={onArchiveClick}>
              경험 아카이브
            </NavButton>
            <NavButton type="button">설정</NavButton>
          </Navigation>
        </Left>
        <Avatar aria-label="김 님 프로필">김</Avatar>
      </Inner>
    </Header>
  );
}
