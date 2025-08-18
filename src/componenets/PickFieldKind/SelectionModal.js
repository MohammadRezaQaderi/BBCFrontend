import { Button, Dialog, DialogTitle, useMediaQuery, useTheme, IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { GetButtonColor } from "../../helper/buttonColor";
import styled from "styled-components";
import CloseIcon from '@mui/icons-material/Close';

const Container = styled.div`
  display: flex;
  flex-direction: ${({ $isMobile }) => ($isMobile ? "column" : "row")};
  justify-content: space-around;
  padding: ${({ $isMobile }) => ($isMobile ? "8px" : "20px")};
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "0")};
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({ $isMobile }) => ($isMobile ? "100%" : "33%")};
  padding: ${({ $isMobile }) => ($isMobile ? "8px" : "15px")};
`;

const SectionTitle = styled.h3`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "8px" : "15px")};
  text-align: center;
  width: 100%;
`;

const CloseButtonWrapper = styled.div`
  position: absolute;
  right: ${({ $isMobile }) => ($isMobile ? "8px" : "16px")};
  top: ${({ $isMobile }) => ($isMobile ? "8px" : "16px")};
`;

const SelectionModal = ({ open, userInfo, onClose, userField }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fieldOptions = [
    { field: 1, label: "علوم تجربی" },
    { field: 2, label: "ریاضی و فیزیک" },
    { field: 3, label: "علوم انسانی" },
    { field: 4, label: "زبان" },
    { field: 5, label: "هنر" },
  ];

  const buttonStyles = {
    background: GetButtonColor(userInfo?.data?.sex),
    margin: isMobile ? "6px 0" : "10px 0",
    width: isMobile ? "95%" : "90%",
    color: "white",
    fontWeight: "bold",
    fontSize: isMobile ? "13px" : "14px",
    padding: isMobile ? "10px 0" : "12px 0",
    height: "auto",
    minHeight: "44px",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      background: userInfo?.data?.sex === 2 ? "#d88aa5" : "#4a9ae6",
      transform: "translateY(-2px) scale(1.02)",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    },
  };

  const RenderButton = ({ user_id, field, label, pagename, isPartTime = false }) => (
    <Button
      key={field}
      variant="contained"
      onClick={() => {
        onClose();
        pagename === "pffrb"
          ? navigate(`/${pagename}/${user_id}/${field}/${isPartTime ? 1 : 0}`)
          : navigate(`/${pagename}/${user_id}/${field}`);
      }}
      sx={buttonStyles}
    >
      {label}
    </Button>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      fullScreen={isMobile}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: isMobile ? 0 : "8px",
          maxHeight: isMobile ? "100%" : "80vh",
          position: "relative",
        },
      }}
    >
      <CloseButtonWrapper $isMobile={isMobile}>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.palette.grey[500],
            "&:hover": {
              color: theme.palette.grey[700],
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </CloseButtonWrapper>

      <DialogTitle
        sx={{
          textAlign: "center",
          fontSize: isMobile ? "18px" : "21px",
          fontWeight: "bold",
          padding: isMobile ? "16px 16px 8px" : "24px",
          paddingTop: isMobile ? "40px" : "24px",
        }}
      >
        انتخاب رشته آزاد
      </DialogTitle>

      <Container $isMobile={isMobile}>
        <Col $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile} sex={userInfo?.data?.sex}>با آزمون</SectionTitle>
          {fieldOptions
            .filter(({ field }) => field === userField)
            .map(({ field, label }) => (
              <RenderButton
                key={field}
                field={field}
                label={label}
                user_id={userInfo?.data?.user_id}
                pagename="pffr"
              />
            ))}
        </Col>

        <Col $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile} sex={userInfo?.data?.sex}>
            تمام‌وقت با سوابق تحصیلی
          </SectionTitle>
          {fieldOptions.map(({ field, label }) => (
            <RenderButton
              key={field}
              field={field}
              user_id={userInfo?.data?.user_id}
              label={label}
              pagename="pffrb"
            />
          ))}
        </Col>

        <Col $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile} sex={userInfo?.data?.sex}>
            پاره‌وقت با سوابق تحصیلی
          </SectionTitle>
          {fieldOptions.map(({ field, label }) => (
            <RenderButton
              key={field}
              field={field}
              user_id={userInfo?.data?.user_id}
              label={label}
              pagename="pffrb"
              isPartTime
            />
          ))}
        </Col>
      </Container>
    </Dialog>
  );
};

export default SelectionModal;