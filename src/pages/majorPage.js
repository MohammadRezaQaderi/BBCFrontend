import React, { useState } from "react";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import styled from "styled-components";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import Majors from "../componenets/FieldInfo/Majors";

const MajorsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <MajorsContainer>
        <ProfileSideBar />
        <Majors />
      </MajorsContainer>
    </>
  );
};

export default MajorsPage;

export const MajorsContainer = styled.div`
  height: 100vh;
  // width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
