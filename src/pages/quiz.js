import React, { useState } from "react";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import styled from "styled-components";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import Quiz from "../componenets/Quiz";
const QuizPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <QuizContainer>
        <ProfileSideBar />
        <Quiz />
      </QuizContainer>
    </>
  );
};

export default QuizPage;

export const QuizContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
