import React, { useState } from "react";
import styled from "styled-components";
import { Grid } from "@mui/material";
import StuEdit from "./StuEdit";
import InsEdit from "./InsEdit";
import ConEdit from "./ConEdit";

const Container = styled.div`
  margin-top: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const StudentInfo = () => {
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [userRole] = useState(JSON.parse(localStorage.getItem("user-role")));

  return (
    <>
      <Container
        maxWidth="lg"
        style={{
          marginTop: "50px",
        }}
      >
        <Grid
          container
          spacing={2}
          mt={3}
          style={{
            marginTop: "100px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {["ins"].includes(userRole) ? (
            <>
              <InsEdit userInfo={userInfo} userRole={userRole} />
            </>
          ) : ["stu"].includes(userRole) ? (
            <>
              <StuEdit userInfo={userInfo} userRole={userRole} />
            </>
          ) : ["con"].includes(userRole) ? (
            <>
              <ConEdit userInfo={userInfo} userRole={userRole} />
            </>
          ) : (
            <></>
          )}

        </Grid>
      </Container>
    </>
  );
};
export default StudentInfo;
