import styled from "styled-components";


export const Container = styled.div`
  margin-top: 50px;
  width: 100%;
  display: flex;
  flex-direction: column;
  // align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

export const HeaderContainer = styled.div`
  width: 100%;
  // max-width: 1200px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  flex-wrap: wrap;
  @media (max-width: 768px) {
  }

  @media (max-width: 480px) {
  }
`;

export const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: right;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    align-items: center;
  }

  @media (max-width: 480px) {
    align-items: center;
  }
`;

export const PickContainer = styled.div`
  width: 100%;
  // max-width: 1200px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  // margin-top: 20px;
`;

export const FrContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  height: 50vh;
  width: 100%;
`;

export const FrCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20%;

  @media (max-width: 768px) {
    margin-top: 50px;
    width: 70%;
  }

  @media (max-width: 480px) {
    margin-top: 50px;
    width: 80%;
  }
`;

export const SectionTitle = styled.span`
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  width: 100%;
  padding: 10px 0;
  border-bottom: 2px solid #ddd;
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


export const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-around",
  alignItems: "center",
  height: "50vh",
  width: "100%",
};

export const colStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "20%",
  textAlign: "center",
};

export const sectionTitleStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  marginBottom: "5px",
  width: "100%",
  padding: "10px 0",
  borderBottom: "2px solid #ddd",
};
