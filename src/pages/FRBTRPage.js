import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
import styled from "styled-components";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import FRBTrashList from "../componenets/FPList/TRTables/FRBTrashList";

const FRBTRPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <ScrollToTop />
      <FRBTRContainer>
        <FRBTrashList />
      </FRBTRContainer>
    </>
  );
};

export default FRBTRPage;
const FRBTRContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
