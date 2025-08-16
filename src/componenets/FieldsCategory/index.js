import React, { useState } from "react";
import FieldsCategoryContainer from "./FieldsCategoryContainer";
import { Button, Container } from "@mui/material";
import { fields } from "./data";
import { useNavigate } from "react-router-dom";

function groupByNumber(data) {
  const result = {};
  data.forEach((item) => {
    if (!result[item.number]) {
      result[item.number] = [];
    }
    result[item.number].push(item);
  });
  return Object.values(result);
}

const FieldsCategory = () => {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user-info"))
  );
  const navigate = useNavigate();
  const groupedFields = groupByNumber(fields);

  return (
    <Container
      maxWidth="lg"
      style={{
        marginTop: "100px",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        flexDirection: "row",
        overflow: "auto",
      }}
    >
      {groupedFields.map((fields, index) => (
        <FieldsCategoryContainer key={index} title={fields[0].major}>
          {fields.map((info, i) => (
            <Button
              variant="contained"
              style={{
                background: GetButtonColor(userInfo?.data?.sex),
              }}
              sx={{
                boxShadow: "none",
                borderRadius: "5px",
                padding: "10px",
                margin: "10px",
              }}
              onClick={() => navigate("/fieldsInfo/" + info.id)}
              key={i}
            >
              {info.name}
            </Button>
          ))}
        </FieldsCategoryContainer>
      ))}
    </Container>
  );
};

export default FieldsCategory;
