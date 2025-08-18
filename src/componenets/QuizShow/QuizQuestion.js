import React, { useEffect, useState } from "react";
import {
  Alert,
  Dialog,
  DialogTitle,
  Snackbar,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  styled,
} from "@mui/material";
import AnswerBox from "./AnswerBox";
import axios from "axios";
import { GetButtonColor } from "../../helper/buttonColor";

// Optimized pic_layout configuration
const pic_layout = {
  ...Array.from({ length: 16 }, (_, i) => ({
    [i + 1]: { width: "463px", height: "90px" },
  })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
  ...Array.from({ length: 29 }, (_, i) => ({
    [i + 33]: { width: "180px", height: "180px" },
  })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
};

const pic_layout_md = {
  ...Array.from({ length: 16 }, (_, i) => ({
    [i + 1]: { width: "375px", height: "75px" },
  })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
  ...Array.from({ length: 29 }, (_, i) => ({
    [i + 33]: { width: "180px", height: "180px" },
  })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const StyledQuestionContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  margin: theme.spacing(3, 0),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    // padding: theme.spacing(2),
  },
}));

const QuestionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginBottom: theme.spacing(3),
}));

const QuestionBadge = styled(Box)(({ theme, type }) => ({
  backgroundColor:
    type === "number"
      ? theme.palette.success.light
      : theme.palette.warning.light,
  color:
    type === "number" ? theme.palette.success.dark : theme.palette.warning.dark,
  padding: theme.spacing(0.5, 2),
  borderRadius: "20px",
  fontWeight: 600,
  fontSize: "0.75rem",
}));

const QuestionText = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: 600,
  margin: theme.spacing(2, 0),
  lineHeight: 1.6,
}));

const AnswerGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  gap: theme.spacing(2),
  width: "100%",
  margin: theme.spacing(3, 0),
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
}));

const AnswerList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  width: "100%",
  margin: theme.spacing(3, 0),
}));

const NavigationButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
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
    width: "100%",
  },
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: theme.zIndex.modal,
  borderRadius: theme.shape.borderRadius * 2,
}));

const QuizQuestion = ({
  questions,
  quizAnswer,
  addQuizAnswer,
  lastSection,
  setSectionFinish,
  userInfo,
  quiz_id,
  last_question_id,
  section_time,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const questionNum = questions?.length;
  const firstQuestionNumber = parseInt(questions[0]?.question_id);
  const [timeLeft, setTimeLeft] = useState(section_time);
  const [qNumber, setQNumber] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(
    questions[qNumber - 1].question_answer === ""
      ? []
      : questions[qNumber - 1].question_answer
  );
  const [selectingAnswer, setSelectingAnswer] = useState(
    questions[qNumber - 1].question_answer === ""
      ? []
      : questions[qNumber - 1].question_answer
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (quizAnswer && Object.keys(quizAnswer).length > 0) {
      const lastAnsweredQuestionId = Math.max(
        ...Object.keys(quizAnswer).map(Number)
      );

      const lastAnsweredIndex = questions.findIndex(
        (q) => q.question_id === lastAnsweredQuestionId
      );

      if (lastAnsweredIndex !== -1) {
        setQNumber(lastAnsweredIndex + 1);
      }
    }
  }, [questions]);

  const EndTheSections = () => {
    setOpenModal(false);
    setSectionFinish(true);
  };

  const submit_quiz = async (questionNumbder, questionAnswer, state) => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_quiz_api/update_request",
        {
          table: "quizzes",
          method_type: "update_quiz_answer",
          data: {
            quiz_id: parseInt(quiz_id),
            question_Answer: questionAnswer,
            question_Number: questionNumbder,
            last_question_id: last_question_id,
            state: state,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        if (response?.data?.response?.message != "")
          setSnackbar({
            open: true,
            message: response?.data?.response?.message,
            severity: "success",
          });
      } else {
        setSnackbar({
          open: true,
          message: response?.data?.error,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت اطلاعات",
        severity: "error",
      });
    }
  };

  const handleGoNext = () => {
    let q_num = qNumber + firstQuestionNumber;
    if (qNumber === questionNum) {
      if (selectingAnswer?.length < questions[qNumber - 1].min_answer_select) {
        setSnackbar({
          open: true,
          message: "لطفا ابتدا به سوال پاسخ دهید.",
          severity: "warning",
        });
      } else {
        console.log("finish section by hand");
        setLoadingAPI(true);
        submit_quiz(
          questions[qNumber - 1].question_id,
          selectingAnswer,
          ""
        ).then(() => {
          setSelectingAnswer([]);
          setLoadingAPI(false);
        });
        setSectionFinish(true);
      }
    } else {
      let selecte_selecting = selectingAnswer;
      if (questions[qNumber - 1].min_answer_select === 0) {
        if (selectingAnswer?.length === 0) {
          selecte_selecting = quizAnswer[q_num - 1];
        } else {
          selecte_selecting = selecte_selecting.concat(quizAnswer[q_num - 1]);
          selecte_selecting = [...new Set(selecte_selecting)];
        }
      }
      if (selectingAnswer?.length >= questions[qNumber - 1].min_answer_select) {
        setLoadingAPI(true);
        addQuizAnswer(
          questions[qNumber - 1].question_id,
          selecte_selecting ? selecte_selecting : selectingAnswer
        );
        submit_quiz(
          questions[qNumber - 1].question_id,
          selecte_selecting ? selecte_selecting : selectingAnswer,
          ""
        ).then(() => {
          if (q_num in quizAnswer) {
            setSelectedAnswer(quizAnswer[q_num]);
          }
          setSelectingAnswer(
            questions[qNumber].question_answer === ""
              ? []
              : questions[qNumber].question_answer
          );
          setQNumber(qNumber + 1);
          setLoadingAPI(false);
        });
      } else if (quizAnswer[q_num - 1]?.length > 0) {
        setSelectedAnswer(quizAnswer[q_num]);
        setQNumber(qNumber + 1);
      } else {
        setSnackbar({
          open: true,
          message: "لطفا ابتدا به سوال پاسخ دهید.",
          severity: "warning",
        });
      }
    }
  };

  const handleGoPrevious = () => {
    let q_num = qNumber + firstQuestionNumber;
    if (qNumber === 1) {
      setSnackbar({
        open: true,
        message: "امکان قبل نیست",
        severity: "error",
      });
    } else {
      if (questions[qNumber - 1].question_answer === "") {
        setSelectedAnswer(quizAnswer[q_num - 2]);
        setQNumber(qNumber - 1);
      } else {
        setSelectedAnswer(questions[qNumber - 1].question_answer);
        setSelectingAnswer(questions[qNumber - 1].question_answer);
        setQNumber(qNumber - 1);
      }
    }
  };

  const check_state = () => {
    sleep(75).then(() => {
      setLoadingAPI(true);
      addQuizAnswer(questions[qNumber - 1].question_id, selectingAnswer);
      submit_quiz(questions[qNumber - 1].question_id, selectingAnswer, "").then(
        () => {
          let q_num = qNumber + firstQuestionNumber + 1;
          if (q_num in quizAnswer) {
            setSelectedAnswer(quizAnswer[q_num]);
          }
          setSelectingAnswer(
            questions[qNumber].question_answer === ""
              ? []
              : questions[qNumber].question_answer
          );
          setQNumber(qNumber + 1);
          setLoadingAPI(false);
        }
      );
    });
  };

  useEffect(() => {
    if (
      questions[qNumber - 1].question_answer === "" &&
      questions[qNumber - 1].max_answer_select === selectingAnswer.length
    ) {
      if (qNumber !== questionNum) {
        check_state();
      } else {
        setLoadingAPI(true);
        console.log("finish section with auto control forwarding questions");
        submit_quiz(
          questions[qNumber - 1].question_id,
          selectingAnswer,
          ""
        ).then(() => {
          setSelectingAnswer([]);
          setLoadingAPI(false);
        });
        setSectionFinish(true);
      }
    }
  }, [selectingAnswer, qNumber]);

  useEffect(() => {
    if (section_time > 0) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setOpenModal(true);
      }
    }
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };


  return (
    <Box position="relative" sx={{ width: "100%" }}>
      <StyledQuestionContainer elevation={3} sx={{ position: 'relative' }}>
        {loadingAPI && (
          <LoadingOverlay>
            <CircularProgress sx={{ color: GetButtonColor(userInfo?.data?.sex) }} size={60} />
          </LoadingOverlay>
        )}
        <QuestionHeader>
          <QuestionBadge type="number">
            {questions[qNumber - 1].question_answer !== ""
              ? `مثال ${qNumber}`
              : `سوال ${qNumber} از ${questionNum}`}
          </QuestionBadge>
          {section_time !== 0 && (
            <QuestionBadge type="timer">
              {formatTime(timeLeft)}
            </QuestionBadge>
          )}
        </QuestionHeader>

        {questions[qNumber - 1].first_q_type === "text" ? (
          <>
            <QuestionText variant={isMobile ? "body1" : "h6"}>
              {questions[qNumber - 1].first_question}
            </QuestionText>

            <AnswerList>
              {questions[qNumber - 1].answers.map((answer) => (
                <AnswerBox
                  key={answer.answer_id}
                  answer={answer}
                  canSelect={questions[qNumber - 1].question_answer === ""}
                  answer_type={questions[qNumber - 1].answers_type}
                  onSelect={(id) => {
                    setSelectingAnswer((prevSelected) => {
                      if (prevSelected.includes(id)) {
                        return prevSelected.filter(selectedId => selectedId !== id);
                      } else {
                        return [...prevSelected, id];
                      }
                    });
                  }}
                  isSelected={
                    selectingAnswer?.includes(answer.answer_id) ||
                    quizAnswer?.[qNumber + firstQuestionNumber - 1]?.includes(answer.answer_id) ||
                    false
                  }
                  userInfo={userInfo}
                />
              ))}
            </AnswerList>
          </>
        ) : (
          <>
            {questions[qNumber - 1].first_question !== "" && (
              <Box display="flex" justifyContent="center" my={3}>
                <Box
                  component="img"
                  src={`https://student.baazmoon.com/bbc_quiz_api/get_quiz_pic/${questions[qNumber - 1].first_question}.JPG`}
                  alt={questions[qNumber - 1].first_question}
                  sx={{
                    width: isMobile ? pic_layout_md[qNumber + firstQuestionNumber - 1].width : pic_layout[qNumber + firstQuestionNumber - 1].width,
                    height: isMobile ? pic_layout_md[qNumber + firstQuestionNumber - 1].height : pic_layout[qNumber + firstQuestionNumber - 1].height,
                    objectFit: 'contain',
                    borderRadius: 1,
                  }}
                />
              </Box>
            )}

            <AnswerGrid>
              {questions[qNumber - 1].answers.map((answer) => (
                <AnswerBox
                  key={answer.answer_id}
                  answer={answer}
                  canSelect={questions[qNumber - 1].question_answer === ""}
                  answer_type={questions[qNumber - 1].answers_type}
                  onSelect={(id) => {
                    setSelectingAnswer((prevSelected) => {
                      if (prevSelected.includes(id)) {
                        return prevSelected.filter(selectedId => selectedId !== id);
                      } else {
                        return [...prevSelected, id];
                      }
                    });
                  }}
                  isSelected={
                    selectingAnswer?.includes(answer.answer_id) ||
                    quizAnswer?.[qNumber + firstQuestionNumber - 1]?.includes(answer.answer_id) ||
                    false
                  }
                  userInfo={userInfo}
                />
              ))}
            </AnswerGrid>
          </>
        )}

        <QuestionText variant={isMobile ? "body1" : "h6"}>
          {questions[qNumber - 1].second_question}
        </QuestionText>

        <NavigationButtons>
          <ActionButton
            variant="contained"
            disabled={qNumber === 1 || loadingAPI}
            onClick={handleGoPrevious}
            sx={{
              bgcolor: 'grey.300',
              color: 'text.primary',
              '&:hover': { bgcolor: 'grey.400' }
            }}
          >
            سوال قبلی
          </ActionButton>
          <ActionButton
            variant="contained"
            disabled={loadingAPI}
            onClick={handleGoNext}
            sx={{
              bgcolor: GetButtonColor(userInfo?.data?.sex),
              color: 'white',
            }}
          >
            {lastSection
              ? "پایان آزمون"
              : qNumber === questionNum
                ? "اتمام قسمت"
                : "سوال بعدی"}
          </ActionButton>
        </NavigationButtons>
        <Dialog
          open={openModal}
          onClose={() => EndTheSections()}
          fullWidth
          disableEscapeKeyDown
          maxWidth="sm"
        >
          <DialogTitle sx={{ textAlign: "center" }}>
            {
              "این قسمت از آزمون را شما به دلیل اتمام زمان آن نمی‌توانید ادامه دهید."
            }
          </DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              className="btn"
              sx={{
                color: "#fff",
                background: "red",
                boxShadow: "none",
                borderRadius: "5px",
                padding: "12px 0",
              }}
              fullWidth
              onClick={() => EndTheSections()}
            >
              متوجه شدم
            </Button>
          </div>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </StyledQuestionContainer>
    </Box>
  );
};

export default QuizQuestion;
