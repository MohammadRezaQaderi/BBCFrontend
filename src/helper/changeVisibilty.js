import React, { useState } from "react";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import styled from "styled-components";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import ChangeVisibilty from "../componenets/Setting/ChangeVisibilty";

const ChangeVisibiltyPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <ChangeVisibiltyContainer>
        <ProfileSideBar />
        <ChangeVisibilty />
      </ChangeVisibiltyContainer>
    </>
  );
};

export default ChangeVisibiltyPage;

export const ChangeVisibiltyContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
