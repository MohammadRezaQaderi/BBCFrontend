import React, { useState } from "react";
import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import styled from "styled-components";
import { ProfileSideBar } from "../componenets/ProfileSideBar/ProfileSideBar";
import QuizShow from "../componenets/QuizShow";
import { useParams } from "react-router-dom";
const QuizShowPage = () => {
  const { id } = useParams();
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
        <QuizShow id={id} />
      </QuizContainer>
    </>
  );
};

export default QuizShowPage;

export const QuizContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
