import React, { useState } from "react";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import styled from "styled-components";
import Setting from "../componenets/Setting";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";

const SettingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <SettingContainer>
        <ProfileSideBar />
        <Setting />
      </SettingContainer>
    </>
  );
};

export default SettingPage;

export const SettingContainer = styled.div`
  height: 100vh;
  // width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
