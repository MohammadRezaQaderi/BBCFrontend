import React, { useState } from "react";
import styled from "styled-components";
import { Grid } from "@mui/material";
import StuEdit from "./StuEdit";

const Container = styled.div`
  margin-top: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const StudentInfo = () => {
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={3} mt={3}>
          <StuEdit userInfo={userInfo} userRole={"stu"} />
        </Grid>
      </Container>
    </>
  );
};
export default StudentInfo;
