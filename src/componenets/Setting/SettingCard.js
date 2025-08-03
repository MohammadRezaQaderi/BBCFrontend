import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GetBackGroundColor, GetButtonColor } from "../../helper/buttonColor";

const SettingCardContainer = styled.div`
  display: flex;
  height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 200px;
  border-radius: 10px;
  border: 1px solid;
  border-color:  ${(props) => GetButtonColor(props.background)};
  box-shadow: 0 5px 20px rgba(112, 112, 112, 0.3);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin: 0px 20px;
  background: ${(props) =>  GetBackGroundColor(props.background) || "transparent"};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(112, 112, 112, 0.4);
  }

  @media screen and (max-width: 768px) {
    width: 200px;
    margin: 10px 20px;
  }

  @media screen and (max-width: 480px) {
    width: 200px;
    margin: 10px 20px;
  }
`;

const FieldsP = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-top: 20px;
`;

const SettingCard = ({ iconSrc, title, color, path }) => {  
  const navigate = useNavigate();
  return (
    <SettingCardContainer background={color} onClick={() => navigate(path)}>
      {iconSrc}
      <FieldsP>{title}</FieldsP>
    </SettingCardContainer>
  );
};

export default SettingCard;
