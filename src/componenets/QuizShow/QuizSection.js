import React, { useEffect, useState } from "react";
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
  styled,
} from "@mui/material";
import QuizQuestion from "./QuizQuestion";
import { useNavigate } from "react-router-dom";
import { GetButtonColor } from "../../helper/buttonColor";

const QuizSectionContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  margin: theme.spacing(3, 0),
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.warning.dark,
  display: "inline-block",
  padding: theme.spacing(0.5, 4),
  borderRadius: "30px",
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  fontSize: "0.875rem",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 2,
  fontWeight: 600,
  letterSpacing: "0.5px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.down("sm")]: {
    width: "100% !important",
    marginBottom: theme.spacing(1),
  },
}));

const QuizSection = ({
  sections,
  setOpenSection,
  userInfo,
  quiz_id,
  userPreviousAnswers,
  section_num,
  last_question_id,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [openQuestion, setOpenQuestion] = useState(false);
  const [sectionNum, setSectionsNum] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(userPreviousAnswers);
  const [sectionFinish, setSectionFinish] = useState(false);
  const [quizFinish, setQuizFinish] = useState(false);
  const [startFromLastQuestion, setStartFromLastQuestion] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const addQuizAnswer = (questionId, answerId) => {
    setQuizAnswer({ ...quizAnswer, [questionId]: answerId });
  };

  useEffect(() => {
    if (userPreviousAnswers && Object.keys(userPreviousAnswers).length > 0) {
      const lastAnsweredQuestionId = Math.max(
        ...Object.keys(userPreviousAnswers).map(Number)
      );
      const sectionIndex = sections.findIndex((section) =>
        section.questions.some(
          (question) => question.question_id === lastAnsweredQuestionId
        )
      );

      if (sectionIndex !== -1) {
        setSectionsNum(sectionIndex);
        const questionIndex = sections[sectionIndex].questions.findIndex(
          (question) => question.question_id === lastAnsweredQuestionId
        );

        if (questionIndex !== -1) {
          setStartFromLastQuestion(true);
        }
      }
    }
  }, [userPreviousAnswers, sections]);

  useEffect(() => {
    if (sectionFinish) {
      if (sectionNum + 1 === section_num) {
        setSnackbar({
          open: true,
          message: "آزمون شما با موفقیت به اتمام رسید.",
          severity: "success",
        });
        navigate("/quiz");
        setQuizAnswer({});
        setSectionFinish(true);
        setQuizFinish(true);
      } else {
        setSectionsNum(sectionNum + 1);
        setSectionFinish(false);
        setOpenQuestion(false);
        setStartFromLastQuestion(false);
      }
    }
  }, [sectionFinish]);

  const handleStartQuiz = () => {
    setOpenQuestion(true);
  };

  return (
    <Fade in timeout={500}>
      <Grid container justifyContent="center">
        {!openQuestion ? (
          sections.length !== 1 ? (
            <Grid item xs={12} md={8} lg={6}>
              <Grow in={!openQuestion} timeout={800}>
                <QuizSectionContainer elevation={3}>
                  <SectionTitle variant="subtitle2">توضیحات</SectionTitle>

                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    color="text.secondary"
                    paragraph
                    sx={{
                      lineHeight: 1.8,
                      textAlign: "justify",
                      mb: 3,
                    }}
                  >
                    {sections[sectionNum].description}
                  </Typography>

                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                      <ActionButton
                        fullWidth
                        variant="contained"
                        sx={{
                          background: GetButtonColor(userInfo?.data?.sex),
                          color: "white",
                        }}
                        onClick={() => setOpenQuestion(true)}
                      >
                        متوجه شدم
                      </ActionButton>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ActionButton
                        fullWidth
                        variant="contained"
                        sx={{
                          background: "#ef4056",
                          color: "white",
                        }}
                        onClick={() => setOpenSection(false)}
                      >
                        بازگشت
                      </ActionButton>
                    </Grid>
                  </Grid>
                </QuizSectionContainer>
              </Grow>
            </Grid>
          ) : (
            handleStartQuiz()
          )
        ) : (
          <QuizQuestion
            questions={sections[sectionNum].questions}
            quizAnswer={quizAnswer}
            addQuizAnswer={addQuizAnswer}
            lastSection={false}
            setSectionFinish={setSectionFinish}
            userInfo={userInfo}
            quiz_id={quiz_id}
            last_question_id={last_question_id}
            section_time={
              sections[sectionNum].time === "" ? 0 : sections[sectionNum].time
            }
            startFromLastQuestion={startFromLastQuestion}
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

export default QuizSection;
