import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import styled from "styled-components";
import ConsultantList from "../componenets/Lists/ConsultantList";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";

const ConsultantPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <ScrollToTop />
      <ConsultantContainer>
        <ProfileSideBar />
        <ConsultantList />
      </ConsultantContainer>
    </>
  );
};

export default ConsultantPage;
const ConsultantContainer = styled.div`
  // height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
