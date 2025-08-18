import React from "react";
import styled from "styled-components";
import { GetBackGroundColor, GetButtonColor } from "../../helper/buttonColor";

const FieldCardContainer = styled.div`
  display: flex;
  height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 200px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(112, 112, 112, 0.3);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid;
  border-color: ${(props) => GetButtonColor(props.background)};
  background: ${(props) => GetBackGroundColor(props.background)};
  // background: ${(props) => props.background || "transparent"};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(112, 112, 112, 0.4);
  }
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const FieldsIcon = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
`;

const FieldsP = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

const FieldCard = ({ iconSrc, title, onClick, color }) => {
  return (
    <FieldCardContainer background={color} onClick={onClick}>
      <FieldsIcon
        src={`https://student.baazmoon.com/bbc_api/nootbook_image/${iconSrc}`}
        alt={title}
      />
      <FieldsP>{title}</FieldsP>
    </FieldCardContainer>
  );
};

export default FieldCard;
