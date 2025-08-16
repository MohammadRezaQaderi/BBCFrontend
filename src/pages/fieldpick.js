import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import styled from "styled-components";
import FieldPickList from "../componenets/Lists/FieldPickList";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
const FieldPickPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} update={false} />
      <ScrollToTop />
      <FieldPickContainer>
        <ProfileSideBar />
        <FieldPickList />
      </FieldPickContainer>
    </>
  );
};

export default FieldPickPage;
const FieldPickContainer = styled.div`
  // height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
