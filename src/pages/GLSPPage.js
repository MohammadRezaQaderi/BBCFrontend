import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
// import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import styled from "styled-components";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import GLSpecialList from "../componenets/FPList/SPTables/GLSpecialList";

const GLSPPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <ScrollToTop />
      <GLSPContainer>
        {/* <ProfileSideBar /> */}
        <GLSpecialList />
      </GLSPContainer>
    </>
  );
};

export default GLSPPage;
const GLSPContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
