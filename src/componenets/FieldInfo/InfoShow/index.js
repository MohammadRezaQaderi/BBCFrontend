import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { fields_detail } from "./data";
import styled, { keyframes } from "styled-components";
import {
  GetBackGroundColor,
  GetButtonColor,
} from "../../../helper/buttonColor";
import { motion } from "framer-motion";
import { new_fields } from "../Fields/data";

// Styled Components
const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0 40px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media screen and (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
`;

const FieldName = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 70%;
  
  @media screen and (max-width: 768px) {
    max-width: 100%;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
  animation: ${fadeIn} 0.8s ease-in-out;
`;

const Title = styled.h1`
  font-weight: 800;
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 5px;
  
  @media screen and (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h6`
  font-weight: 600;
  color: #7f8c8d;
  margin-bottom: 0;
  font-size: 1.2rem;
  
  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Section = styled.div`
  background: ${(props) => props.backgroundColor || "#ffffff"};
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.8s ease-in-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const SectionTitle = styled.h4`
  font-weight: 700;
  color: ${(props) => props.theme.primary || "#2980b9"};
  margin-bottom: 20px;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 25px;
    background: ${(props) => props.theme.primary || "#2980b9"};
    border-radius: 4px;
  }
`;

const BoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 20px;
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Box = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  }
`;

const BoxTitle = styled.h4`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: #ecf0f1;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 10px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: ${(props) => props.color};
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Text = styled.p`
  color: #34495e;
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 15px;
  text-align: justify;
`;

const List = styled.ul`
  padding: 0;
  list-style-type: none;
`;

const ListItem = styled.li`
  color: #34495e;
  margin-bottom: 12px;
  font-size: 1.1rem;
  line-height: 1.6;
  padding: 10px 15px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:before {
    content: "•";
    color: ${(props) => props.theme.primary || "#2980b9"};
    font-weight: bold;
    font-size: 1.5rem;
    margin-left: 10px;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    transform: translateX(5px);
  }
`;

const Image = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  object-fit: cover;
  border: 4px solid white;
  
  @media screen and (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const PercentageText = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${(props) => props.color || "#2c3e50"};
  background: rgba(0, 0, 0, 0.03);
  padding: 3px 8px;
  border-radius: 10px;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    ${(props) => GetButtonColor(props.sex)},
    transparent
  );
  margin: 30px 0;
`;

// Helper functions
const getProgressBarColor = (value) => {
  const percentage = value * 20;
  if (percentage > 70) return "#2ecc71"; // Green
  if (percentage > 40) return "#f39c12"; // Orange
  return "#e74c3c"; // Red
};

const getPercentageColor = (value) => {
  const percentage = value * 20;
  if (percentage > 70) return "#27ae60";
  if (percentage > 40) return "#d35400";
  return "#c0392b";
};

const SectionComponent = ({ title, sectionData, type, backgroundColor }) => {
  if (!title) return null;

  const renderText = (sectionData) => {
    return sectionData
      .split("\n")
      .map((para, index) => para.trim() && <Text key={index}>{para}</Text>);
  };

  return (
    <Section backgroundColor={backgroundColor}>
      <SectionTitle>{title}</SectionTitle>
      {type === "list" ? (
        <List>
          {sectionData[0]?.split(",").map((item, index) => (
            <ListItem key={index}>{item.trim()}</ListItem>
          ))}
        </List>
      ) : (
        renderText(sectionData)
      )}
    </Section>
  );
};

const InfoShow = () => {
  const { id } = useParams();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const data = fields_detail.find((item) => item.id === parseInt(id));
  const field_info = new_fields.find((item) => item.id === parseInt(id));

  if (!data) {
    return (
      <Container>
        <NoDataMessage>رشته مورد نظر موجود نمی‌باشد.</NoDataMessage>
      </Container>
    );
  }

  const values = {
    a1: field_info?.a1 || 0,
    a2: field_info?.a2 || 0,
    a3: field_info?.a3 || 0,
    a4: field_info?.a4 || 0,
    a5: field_info?.a5 || 0,
    a6: field_info?.a6 || 0,
  };

  const criteriaLabels = {
    a1: "رضایت فارغ‌التحصیلان",
    a2: "میزان درآمد",
    a3: "سختی رشته",
    a4: "رقابت در کنکور",
    a5: "مهاجرت",
    a6: "زودبازدهی",
  };

  return (
    <Container>
      <HeaderContainer>
        <FieldName>
          <Title>{data.name}</Title>
          <Subtitle>{`از رشته‌ی ${data.major}`}</Subtitle>
        </FieldName>
        {data.picture && (
          <Image
            src={`https://student.baazmoon.com/bbc_api/get_pic_info/field/${data.picture}`}
            alt={data.name}
          />
        )}
      </HeaderContainer>

      <Divider sex={userInfo?.data?.sex} />

      {field_info && (
        <Section backgroundColor={GetBackGroundColor(userInfo?.data?.sex)}>
          <SectionTitle>معیارهای کلی رشته</SectionTitle>
          <BoxContainer>
            {Object.entries(values).map(([key, value]) => {
              const percentage = value * 20;
              return (
                <Box key={key}>
                  <BoxTitle>
                    {criteriaLabels[key]}
                    <PercentageText color={getPercentageColor(value)}>
                      {`${value} از 5`}
                    </PercentageText>
                  </BoxTitle>
                  <ProgressBarContainer>
                    <ProgressBar
                      initial={{ width: "0%" }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      color={getProgressBarColor(value)}
                    />
                  </ProgressBarContainer>
                </Box>
              );
            })}
          </BoxContainer>
        </Section>
      )}

      <SectionComponent
        title={data.title1}
        sectionData={data.section1}
        type={data.type1}
        backgroundColor={GetBackGroundColor(userInfo?.data?.sex)}
      />
      <SectionComponent
        title={data.title2}
        sectionData={data.section2}
        type={data.type2}
        backgroundColor={GetBackGroundColor(userInfo?.data?.sex)}
      />
      <SectionComponent
        title={data.title3}
        sectionData={data.section3}
        type={data.type3}
        backgroundColor={GetBackGroundColor(userInfo?.data?.sex)}
      />
      <SectionComponent
        title={data.title4}
        sectionData={data.section4}
        type={data.type4}
        backgroundColor={GetBackGroundColor(userInfo?.data?.sex)}
      />
      {data.title5 && (
        <SectionComponent
          title={data.title5}
          sectionData={data.section5}
          type={data.type5}
          backgroundColor={GetBackGroundColor(userInfo?.data?.sex)}
        />
      )}
      {data.title6 && (
        <SectionComponent
          title={data.title6}
          sectionData={data.section6}
          type={data.type6}
          backgroundColor={GetBackGroundColor(userInfo?.data?.sex)}
        />
      )}
    </Container>
  );
};

export default InfoShow;