import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import styled from "styled-components";
import StudentList from "../componenets/Lists/StudentList";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";

const StudentPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <ScrollToTop />
      <StudentContainer>
        <ProfileSideBar />
        <StudentList />
      </StudentContainer>
    </>
  );
};

export default StudentPage;
const StudentContainer = styled.div`
  // height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
