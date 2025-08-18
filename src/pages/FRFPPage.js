import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
import styled from "styled-components";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import FRFieldPickTable from "../componenets/FPList/FPTables/FRFieldPickTable";

const FRFPPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <ScrollToTop />
      <FRFPContainer>
        <FRFieldPickTable />
      </FRFPContainer>
    </>
  );
};

export default FRFPPage;
const FRFPContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
