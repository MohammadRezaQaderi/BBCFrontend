import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
import styled from "styled-components";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import FRTrashList from "../componenets/FPList/TRTables/FRTrashList";

const FRTRPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <ScrollToTop />
      <FRTRContainer>
        <FRTrashList />
      </FRTRContainer>
    </>
  );
};

export default FRTRPage;
const FRTRContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
