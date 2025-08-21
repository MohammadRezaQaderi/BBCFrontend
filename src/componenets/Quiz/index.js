import React, { useState } from "react";
import styled from "styled-components";
import QuizOverall from "./QuizOverall";
import { Alert, Snackbar, Grow, useTheme } from "@mui/material";

const Quiz = () => {
  const theme = useTheme();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  return (
    <QuizContainer className="container">
      <QuizOverall />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Grow}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: "100%", boxShadow: theme.shadows[3] }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </QuizContainer>
  );
};

export default Quiz;

const QuizContainer = styled.div`
  width: 75%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;
