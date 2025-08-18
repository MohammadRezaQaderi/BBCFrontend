import React from "react";
import styled from "styled-components";
import QuizOverall from "./QuizOverall";

const Quiz = () => {
  return (
    <QuizContainer className="container">
      <QuizOverall />
    </QuizContainer>
  );
};

export default Quiz;

const QuizContainer = styled.div`
  width: 75%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;
