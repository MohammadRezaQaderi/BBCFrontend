import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
// import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import styled from "styled-components";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import FRBFieldPickTable from "../componenets/FPList/FPTables/FRBFieldPickTable";

const FRBFPPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <ScrollToTop />
      <FRBFPContainer>
        {/* <ProfileSideBar /> */}
        <FRBFieldPickTable />
      </FRBFPContainer>
    </>
  );
};

export default FRBFPPage;
const FRBFPContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
