import React, { useState } from "react";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import styled from "styled-components";
import Hoshmand from "../componenets/Hoshmand";

const HoshmandPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <HelpContainer>
        <Hoshmand />
      </HelpContainer>
    </>
  );
};

export default HoshmandPage;

export const HelpContainer = styled.div`
  // height: 100vh;
  // width: 100vw;
  // display: flex;
  // flex-direction: row;
  // justify-content: space-between;
`;
