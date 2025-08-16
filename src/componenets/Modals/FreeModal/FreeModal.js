import { Button } from "@mui/material";
import React from "react";
import { Dialog, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Container, SectionTitle, Col } from "./styles";
import { GetButtonColor } from "../../../helper/buttonColor";

const FreeModal = ({
  openModal,
  userInfo,
  handleCloseModal,
  userId,
  userField,
}) => {
  const navigate = useNavigate();

  const fieldOptions = [
    { field: 1, label: "علوم تجربی" },
    { field: 2, label: "ریاضی و فیزیک" },
    { field: 3, label: "علوم انسانی" },
    { field: 4, label: "زبان" },
    { field: 5, label: "هنر" },
  ];

  const RenderButton = ({ field, label, pagename, isPartTime = false }) => (
    <Button
      key={field}
      type="submit"
      onClick={() => {
        handleCloseModal();
        pagename === "pffrb"
          ? navigate(`/${pagename}/${userId}/${field}/${isPartTime ? 1 : 0}`)
          : navigate(`/${pagename}/${userId}/${field}`);
      }}
      style={{
        background: GetButtonColor(userInfo?.data?.sex),
        marginTop: "20px",
        width: "calc(80%)",
        color: "white",
        marginBottom: "10px",
      }}
      sx={{
        background: GetButtonColor(userInfo?.data?.sex),
        boxShadow: "none",
        borderRadius: "5px",
        padding: "12px 0",
        width: "80%",
        color: "white",
        fontWeight: "bold",
        fontSize: "14px",
        height: "40px",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          background: userInfo?.data?.sex === 2 ? "#d88aa5" : "#4a9ae6",
          transform: "translateY(-3px) scale(1.05)",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="lg">
      <DialogTitle
        sx={{ textAlign: "center", fontSize: "21px", fontWeight: "bold" }}
      >
        انتخاب رشته آزاد
      </DialogTitle>

      <Container>
        <Col>
          <SectionTitle sex={userInfo?.data?.sex}>با آزمون</SectionTitle>
          {fieldOptions
            .filter(({ field }) => field === userField)
            .map(({ field, label }) => (
              <RenderButton
                key={field}
                field={field}
                label={label}
                pagename="pffr"
              />
            ))}
        </Col>

        <Col>
          <SectionTitle sex={userInfo?.data?.sex}>
            تمام‌وقت با سوابق تحصیلی
          </SectionTitle>
          {fieldOptions.map(({ field, label }) => (
            <RenderButton
              key={field}
              field={field}
              label={label}
              pagename="pffrb"
            />
          ))}
        </Col>

        <Col>
          <SectionTitle sex={userInfo?.data?.sex}>
            پاره‌وقت با سوابق تحصیلی
          </SectionTitle>
          {fieldOptions.map(({ field, label }) => (
            <RenderButton
              key={field}
              field={field}
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

export default FreeModal;
