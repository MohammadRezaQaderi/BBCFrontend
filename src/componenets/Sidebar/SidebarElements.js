import { FaTimes } from "react-icons/fa";
import { Link as LinkR } from "react-router-dom";
import { Link as LinkS } from "react-scroll";
import styled, { keyframes } from "styled-components";

export const UserCard = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  background: #fff;
`;
export const SidebarContainer = styled.aside`
  position: fixed;
  z-index: 999;
  width: 25%;
  height: 100%;
  display: none;
  align-items: center;
  top: 0;
  backdrop-filter: blur(10px);
  boxshadow: none;
  right: 0;
  transition: 0.3s ease;
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  right: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
  @media screen and (max-width: 768px) {
    display: grid;
    width: 50%;
  }
  @media screen and (max-width: 480px) {
    display: grid;
    width: 80%;
  }
`;

export const CloseIcon = styled(FaTimes)`
  color: #ff5e5e;
`;

export const Icon = styled.div`
  position: absolute;
  right: 50px;
  top: 50px;
  background: transparent;
  font-size: 2rem;
  cursor: pointer;
  outline: none;
`;// Keyframes for sliding animation
const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Keyframes for link animation
const fadeInUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const SidebarMenu = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding-left: 0rem;
  padding-top: 5rem;
  padding-bottom: 5rem;
  animation: ${slideIn} 0.8s ease forwards;

  @media screen and (max-width: 480px) {
    padding-top: 3rem;
  }
`;

export const SidebarWrapper = styled.div`
  color: #000;
  margin-top: 50px;
  height: 100vh;
  z-index: 1000;
  animation: ${slideIn} 0.5s ease-out forwards;
`;

export const SidebarLink = styled(LinkS)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  text-decoration: none;
  list-style: none;
  transition: color 0.2s ease-in-out, transform 0.3s ease;
  color: #fff;
  margin-top: 15px;
  border-radius: 15px;
  background: #36ae7c;
  width: 75%;
  height: 50px;
  cursor: pointer;
  opacity: 0; /* Start invisible */
  animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${({ delay }) => delay || "0s"}; /* Add staggered delay */

  &:hover {
    color: #36ae7c;
    transform: scale(1.05);
    transition: color 0.2s ease-in-out, transform 0.3s ease;
  }
`;

export const SideBtnWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const SidebarRoute = styled(LinkR)`
  border-radius: 50px;
  background: #36ae7c;
  white-space: nowarp;
  padding: 16px 64px;
  color: #fff;
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
