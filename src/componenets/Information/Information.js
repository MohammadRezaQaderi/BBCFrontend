import React, { useState } from "react";
import styled from "styled-components";
import InformationCard from "./InformationCard";
import { BiCategoryAlt } from "react-icons/bi";
import { SlNotebook } from "react-icons/sl";

const Container = styled.div`
  margin-top: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const CardContainer = styled.div`
  width: 100%;
  margin-top: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Information = () => {
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));

  const fields = [
    {
      title: "دفتر‌چه‌های کنکور",
      icon: <SlNotebook size={30} color="black" />,
      color: userInfo?.data?.sex,
      path: "/notebookInfo",
    },
    {
      title: "معرفی رشته‌ها",
      icon: <BiCategoryAlt size={30} color="black" />,
      color: userInfo?.data?.sex,
      path: "/majors",
    },
  ];

  return (
    <Container>
      <CardContainer>
        {fields.map((field, index) => (
          <InformationCard
            iconSrc={field.icon}
            title={field.title}
            color={field.color}
            path={field.path}
          />
        ))}
      </CardContainer>
    </Container>
  );
};

export default Information;
