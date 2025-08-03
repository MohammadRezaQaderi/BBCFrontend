import styled from "styled-components";
import { Link as LinkR } from "react-router-dom";
import { Link as LinkS } from "react-scroll";
export const Nav = styled.nav`
  background: ${({ scrollNav }) => (scrollNav ? "transparent" : "transparent")};
  height: 80px;
  margin-top: -80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  // border: 1px solid gray;
  backdrop-filter: blur(10px);
  boxshadow: none;
  // border-top-right-radius: 100px;
  // border-bottom-right-radius: 100px;
  // border-top-left-radius: 100px;
  // border-bottom-left-radius: 100px;
  margin: 10px 20px 0px 20px;
  @media screen and (max-width: 768px) {
    transition: 0.8s all ease;
    margin: 10px 0px 0px 0px;
  }

  @media screen and (max-width: 480px) {
    transition: 0.8s all ease;
    margin: 10px 0px 0px 0px;
  }
`;

export const NavbarContainer = styled.div`
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  max-width: 1100px;
  z-index: 1;
  direction: ltr;
`;

export const MobileIcon = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    font-size: 1.8rem;
    right: 30px;
    top: 18px;
    transition: translate(-100%, 60%);
    cursor: pointer;
    color: #000;
  }
  @media screen and (max-width: 480px) {
    display: block;
    position: absolute;
    font-size: 1.8rem;
    right: 30px;
    top: 18px;
    transition: translate(-100%, 60%);
    cursor: pointer;
    color: #000;
  }
`;

export const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;
  margin-right: -22px;
  margin-bottom: 0;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavItem = styled.li`
  height: 80px;
`;

export const NavLinks = styled(LinkS)`
  color: ${({ scrollNav }) => (scrollNav ? "#000" : "#000")};
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  &.active {
    border-bottom: 3px solid #3cbcff;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled(LinkR)`
  border-radius: 8px;
  background: ${({ scrollNav }) => (scrollNav ? "#36ae7c" : "#36ae7c")};
  white-space: nowarp;
  padding: 10px 22px;
  color: ${({ scrollNav }) => (scrollNav ? "#fff" : "#fff")};
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin-right: 10px;
  &:hover {
    transition: all 0.2s ease-in-out;
    color: #fff;
    transform: scale(1.02);
  }
`;

export const NavBtnLink1 = styled(LinkR)`
  border-radius: 8px;
  background: ${({ scrollNav }) => (scrollNav ? "#36ae7c" : "#36ae7c")};
  white-space: nowarp;
  padding: 10px 22px;
  color: ${({ scrollNav }) => (scrollNav ? "#fff" : "#fff")};
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;
  }
`;

export const LogoIcon = styled.img`
  height: 60px;
  width: 60px;
  margin-top: 10px;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  cursor: pointer;
`;
