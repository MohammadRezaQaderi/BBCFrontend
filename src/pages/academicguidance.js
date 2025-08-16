import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import styled from "styled-components";
import AcademicGuidanceList from "../componenets/Lists/AcademicGuidanceList";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
const AcademicGuidancePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} update={false} />
      <ScrollToTop />
      <AcademicGuidanceContainer>
        <ProfileSideBar />
        <AcademicGuidanceList />
      </AcademicGuidanceContainer>
    </>
  );
};

export default AcademicGuidancePage;
const AcademicGuidanceContainer = styled.div`
  // height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
