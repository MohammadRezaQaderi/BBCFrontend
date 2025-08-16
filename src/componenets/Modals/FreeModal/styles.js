import styled from "styled-components";
import { GetButtonColor } from "../../../helper/buttonColor";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  min-height: 50vh;
  padding: 20px 0;

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
  }
`;

export const SectionTitle = styled.span`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  width: 100%;
  padding: 10px 0;
  border-bottom: 2px solid;
  border-color: ${(props) => GetButtonColor(props.sex)};
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30%;
  text-align: center;
  margin: 10px 0;

  @media (max-width: 768px) {
    width: 80%;
  }

  @media (max-width: 480px) {
    width: 95%;
  }
`;
