import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Grid,
  Snackbar,
  Typography,
  Paper,
  Fade,
  Grow,
  useMediaQuery,
  useTheme,
  Box
} from "@mui/material";
import SoundPlayer from "./SoundPlayer";
import QuizSection from "./QuizSection";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GetButtonColor } from "../../helper/buttonColor";
import Loader from "../../helper/Loader";
import { styled } from "@mui/system";

const quiz_name = (quizName) => {
  switch (quizName) {
    case "Cattel": return "کتل";
    case "Gardner": return "گاردنر";
    case "NEO": return "نئو";
    case "Clifton": return "کلیفتون";
    case "Holland": return "هالند";
    case "Student Engagement": return "تعهد";
    case "Self Report Inventory": return "پرسشنامه";
    default: return quizName;
  }
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const ActionButton = styled(Button)(({ theme, color }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 2,
  fontWeight: 600,
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.down('sm')]: {
    width: '100% !important',
    marginBottom: theme.spacing(1),
  },
}));

const QuizPage = ({ quiz_id }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [openSection, setOpenSection] = useState(false);
  const [quizData, setQuizData] = useState({});
  const [userAnswer, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const select_quiz_info = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_quiz_api/select_request",
        {
          table: "users",
          method_type: "select_quiz_info",
          data: {
            quiz_id: parseInt(quiz_id),
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setQuizData(response?.data?.response?.data);
        setUserAnswers(response?.data?.response?.quizAnswers);
      } else {        
        setSnackbar({
          open: true,
          message: response?.data?.error,
          severity: "error",
        });
        navigate("/quiz");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت اطلاعات",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (userInfo?.data.user_id === undefined) {
      navigate("/signin");
    } else {
      select_quiz_info().then(() => {
        setLoading(false);
      });
    }
  }, [userInfo]);

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <Fade in={!loading} timeout={500}>
      <Grid container justifyContent="center" sx={{ px: isMobile ? 1 : 4, py: 4 }}>
        {!openSection ? (
          <Grid item xs={12} md={8} lg={6}>
            <Grow in={!openSection} timeout={800}>
              <StyledPaper elevation={3}>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  fontWeight={800}
                  color={GetButtonColor(userInfo?.data?.sex)}
                  gutterBottom
                  textAlign="center"
                  sx={{ mb: 3 }}
                >
                  {"آزمون " + quiz_name(quizData.name)}
                </Typography>

                <Typography
                  variant={isMobile ? "body2" : "body1"}
                  color="text.secondary"
                  paragraph
                  textAlign="justify"
                  sx={{ lineHeight: 1.8, mb: 3 }}
                >
                  {quizData.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <SoundPlayer voice={quizData.voice} userInfo={userInfo} />
                </Box>

                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={6}>
                    <ActionButton
                      fullWidth
                      variant="contained"
                      style={{
                        background: GetButtonColor(userInfo?.data?.sex),
                        color: "white",
                      }}
                      onClick={() => setOpenSection(true)}
                    >
                      شروع آزمون
                    </ActionButton>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ActionButton
                      fullWidth
                      variant="contained"
                      style={{
                        background: "#ef4056",
                        color: "white",
                      }}
                      onClick={() => navigate("/quiz")}
                    >
                      بازگشت
                    </ActionButton>
                  </Grid>
                </Grid>
              </StyledPaper>
            </Grow>
          </Grid>
        ) : (
          <QuizSection
            sections={quizData.sections}
            setOpenSection={setOpenSection}
            userInfo={userInfo}
            quiz_id={quiz_id}
            userPreviousAnswers={userAnswer}
            section_num={quizData.section_num}
            last_question_id={
              quizData.sections[quizData.sections.length - 1].questions[
                quizData.sections[quizData.sections.length - 1].questions.length - 1
              ].question_id
            }
          />
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={Fade}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%", boxShadow: theme.shadows[6] }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Grid>
    </Fade>
  );
};

export default QuizPage;