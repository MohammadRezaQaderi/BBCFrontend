import styled from "styled-components";
import { Link as LinkR } from "react-router-dom";

export const Page = styled.div`
  width: 100%;
  background: #fff;
  margin-top: 50px;
  margin-right: 20px;
  margin-left: 20px;
  border-radius: 10px;
  @media screen and (max-width: 768px) {
    margin-top: 40px;
    margin-left: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
  }
  @media screen and (max-width: 480px) {
    margin-top: 40px;
    margin-left: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
  }
`;

export const Wrapper = styled(Page)`
  display: flex;
  direction: rtl;
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    overflow: auto;
  }
  @media screen and (max-width: 480px) {
    flex-wrap: wrap;
    overflow: auto;
  }
`;

export const InfoCard = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  margin: 20px;
  padding: 30px;
  min-width: 250px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
`;

export const PersonalInfo = styled.div``;
export const UserInfoData = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-around;
`;

export const PersonalH1 = styled.h1`
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 64px;
  text-align: center;
  @media screen and (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const PersonalP = styled.p`
  font-size: 1rem;
  tex-align: center;
  direction: rtl;
`;

export const PersonalIcon = styled.img`
  height: 160px;
  width: 160px;
  margin-bottom: 10px;
  @media screen and (max-width: 768px) {
    // display: none;
  }
  @media screen and (max-width: 480px) {
    // display: none;
  }
`;
export const DataCard = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  min-width: 730px;
  margin: 20px;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
`;
export const DataCardForCoWorker = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  min-width: 300px;
  margin: 20px;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
  @media screen and (max-width: 768px) {
    min-width: 300px;
  }
  @media screen and (max-width: 480px) {
    min-width: 300px;
  }
`;
export const DataFirstPart = styled.div`
  max-width: 700px;
`;
export const DataFirstPartCo = styled.div`
  max-width: 700px;
`;
export const DataSecondPart = styled.div`
  background: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 700px;
  max-width: 700px;
  @media screen and (max-width: 768px) {
    min-width: 200px;
  }
  @media screen and (max-width: 480px) {
    min-width: 200px;
  }
`;

export const DataInfo = styled.div`
  margin: 10px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  min-width: 680px;
  max-width: 680px;
  @media screen and (max-width: 768px) {
    min-width: 200px;
  }
  @media screen and (max-width: 480px) {
    min-width: 200px;
  }
`;
export const Payment = styled.div`
  margin: 10px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  min-width: 300px;
  @media screen and (max-width: 768px) {
    min-width: 320px;
  }
  @media screen and (max-width: 480px) {
    min-width: 320px;
  }
`;
export const Offer = styled.div`
  margin: 10px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  min-width: 300px;
`;
export const OfferConsultant = styled.div`
  margin: 10px;
  padding: 20px;
  min-width: 350px;
`;
export const DataH1 = styled.h1`
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 20px;
  @media screen and (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const DataP = styled.p`
  font-size: 1rem;
  tex-align: center;
  direction: rtl;
`;
export const FormInput = styled.input`
  padding: 16px 16px;
  margin-bottom: 0px;
  margin-top: 5px;
  width: 100px;
  height: 20px;
  border-radius: 5px;
`;

export const DataBtn1 = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
export const DataBtn2 = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const DataBtnUser = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DataBtnLink = styled(LinkR)`
  border-radius: 50px;
  white-space: nowarp;
  padding: 10px 22px;
  color: #fff;
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #6e3c6c;
  }
`;
