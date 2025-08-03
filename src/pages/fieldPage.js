import React, { useState } from "react";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import styled from "styled-components";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import Fields from "../componenets/FieldInfo/Fields";

const FieldsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <FieldsContainer>
        <ProfileSideBar />
        <Fields />
      </FieldsContainer>
    </>
  );
};

export default FieldsPage;

export const FieldsContainer = styled.div`
  height: 100vh;
  // width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
