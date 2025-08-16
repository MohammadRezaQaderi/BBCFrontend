import React, { useState } from "react";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import styled from "styled-components";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import PasswordChange from "../componenets/Setting/Password";

const PasswordChangePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <PasswordChangeContainer>
        <ProfileSideBar />
        <PasswordChange />
      </PasswordChangeContainer>
    </>
  );
};

export default PasswordChangePage;

export const PasswordChangeContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
