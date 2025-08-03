import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
// import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import styled from "styled-components";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import GLTrashList from "../componenets/FPList/TRTables/GLTrashList";

const GLTRPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <ScrollToTop />
      <GLTRContainer>
        {/* <ProfileSideBar /> */}
        <GLTrashList />
      </GLTRContainer>
    </>
  );
};

export default GLTRPage;
const GLTRContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
