import React from "react";
import { Divider, Typography } from "@mui/material";

const FieldsCategoryContainer = ({ title, children }) => {
  return (
    <div
      style={{
        boxShadow: "0 5px 20px rgba(112,112,112,0.3)",
        borderRadius: "5px",
        padding: 2,
        width: "100%",
        marginBottom: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom style={{ marginTop: "50px" }}>
        {title}
      </Typography>
      <Divider
        color="#000"
        style={{ marginTop: "10px", marginBottom: "10px", width: "50%" }}
      />
      <div
        style={{
          margin: "30px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          // height: "200px",
          // overflow: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FieldsCategoryContainer;
