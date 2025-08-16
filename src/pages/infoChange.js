import React, { useState } from "react";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import styled from "styled-components";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import InfoChange from "../componenets/Setting/Info";

const InfoChangePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <InfoChangeContainer>
        <ProfileSideBar />
        <InfoChange />
      </InfoChangeContainer>
    </>
  );
};

export default InfoChangePage;

export const InfoChangeContainer = styled.div`
  height: 100vh;
  // width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
