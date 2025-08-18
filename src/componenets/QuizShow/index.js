import React from "react";
import styled from "styled-components";
import QuizPage from "./QuizPage";
const QuizShow = ({ id }) => {
  return (
    <QuizContainer className="container">
      <QuizPage quiz_id={id} />
    </QuizContainer>
  );
};

export default QuizShow;

const QuizContainer = styled.div`
  width: 75%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;
