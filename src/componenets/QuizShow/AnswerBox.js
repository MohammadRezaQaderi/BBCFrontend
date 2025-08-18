import React from "react";
import { Box, Typography, Radio, styled } from "@mui/material";
import { GetButtonColor } from "../../helper/buttonColor";

const TextAnswerBox = styled(Box)(({ theme, selected, color }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  border: `2px solid ${selected ? color : "transparent"}`,
  transition: "all 0.2s ease",
  "&:hover": {
    border: `2px solid ${color}`,
    boxShadow: theme.shadows[3],
  },
}));

const ImageAnswerBox = styled(Box)(({ theme, selected, color }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  cursor: "pointer",
  overflow: "hidden",
  border: `2px solid ${selected ? color : "transparent"}`,
  transition: "all 0.2s ease",
  "&:hover": {
    border: `2px solid ${color}`,
    boxShadow: theme.shadows[3],
  },
}));

const AnswerImage = styled("img")({
  width: "100%",
  height: "auto",
  display: "block",
});

const AnswerBox = ({
  answer,
  isSelected,
  onSelect,
  answer_type,
  canSelect,
  userInfo,
}) => {
  const color = GetButtonColor(userInfo?.data?.sex);

  return (
    <>
      {answer_type === "text" ? (
        <TextAnswerBox
          selected={isSelected}
          color={color}
          onClick={() => canSelect && onSelect(answer.answer_id)}
        >
          <Radio
            checked={isSelected}
            sx={{ color, "&.Mui-checked": { color } }}
          />
          <Typography variant="body1" sx={{ mr: 1 }}>
            {answer.answer_text}
          </Typography>
        </TextAnswerBox>
      ) : (
        <ImageAnswerBox
          selected={isSelected}
          color={color}
          onClick={() => canSelect && onSelect(answer.answer_id)}
        >
          <AnswerImage
            src={`https://student.baazmoon.com/bbc_quiz_api/get_quiz_pic/${answer.answer_text}.JPG`}
            alt={answer.answer_text}
          />
        </ImageAnswerBox>
      )}
    </>
  );
};

export default AnswerBox;
