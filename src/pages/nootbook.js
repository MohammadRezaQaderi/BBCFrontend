import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import styled from "styled-components";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import NoteBook from "../componenets/NoteBook/NoteBook";
const NoteBookPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <ScrollToTop />
      <NoteBookContainer>
        <ProfileSideBar />
        <NoteBook />
      </NoteBookContainer>
    </>
  );
};

export default NoteBookPage;
const NoteBookContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
