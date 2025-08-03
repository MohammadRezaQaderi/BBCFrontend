import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import styled from "styled-components";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import PickFieldKind from "../componenets/PickFieldKind";

const PickFieldKindPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <ScrollToTop />
      <PickFieldKindContainer>
        <ProfileSideBar  />
        <PickFieldKind />
      </PickFieldKindContainer>
    </>
  );
};

export default PickFieldKindPage;
const PickFieldKindContainer = styled.div`
  display: flex;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding-left: 0;
  }
`;