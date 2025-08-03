import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { GetButtonColor } from "../../helper/buttonColor";

const PickFieldCardContainer = styled(motion.div)`
  display: flex;
  height: ${props => props.compact ? '120px' : '150px'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.compact ? '12px' : '20px'};
  width: ${props => props.compact ? '160px' : '200px'};
  border-radius: 12px;
  border: 1px solid;
  border-color: ${(props) => GetButtonColor(props.$background)};
  box-shadow: 0 4px 12px rgba(112, 112, 112, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 10px;
  background: ${(props) =>
    props.$isFemale
      ? "rgba(255, 240, 246, 0.7)"
      : "rgba(240, 248, 255, 0.7)"};
  backdrop-filter: blur(4px);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(112, 112, 112, 0.25);
    background: ${(props) =>
    props.$isFemale
      ? "rgba(255, 240, 246, 0.9)"
      : "rgba(240, 248, 255, 0.9)"};
  }

  @media screen and (max-width: 768px) {
    width: ${props => props.compact ? '140px' : '180px'};
    height: ${props => props.compact ? '110px' : '140px'};
    margin: 8px;
  }

  @media screen and (max-width: 480px) {
    width: 160px;
    height: 120px;
    margin: 6px;
  }
`;

const IconWrapper = styled.div`
  margin-bottom: ${props => props.compact ? '8px' : '16px'};
  
  & > svg {
    width: ${props => props.compact ? '28px' : '36px'};
    height: ${props => props.compact ? '28px' : '36px'};
    color: ${props => GetButtonColor(props.$background)};
  }
`;

const Title = styled.p`
  font-size: ${props => props.compact ? '16px' : '18px'};
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 0;
`;

const PickFieldCard = ({ icon, title, isFemale, onClick, compact = false }) => {
  return (
    <PickFieldCardContainer
      $background={isFemale ? 2 : 1}
      $isFemale={isFemale}
      onClick={onClick}
      compact={compact}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <IconWrapper $background={isFemale ? 2 : 1} compact={compact}>
        {icon}
      </IconWrapper>
      <Title compact={compact}>{title}</Title>
    </PickFieldCardContainer>
  );
};

export default PickFieldCard;