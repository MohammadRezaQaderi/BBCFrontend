import { Alert, Box, Snackbar } from "@mui/material";
import React, { useRef, useState } from "react";
import "./style.css";
import AvatarSVG from "../../../assets/images/logo.png";
import styled from "styled-components";
export default function Index({ formik, pic, setPic }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  let myRef = useRef();
  const openFile = (file) => {
    const input = file.target;
    const reader = new FileReader();
    if (file.target.value !== "") {
      reader.onload = function () {
        const dataURL = reader.result;
        let image = input.files[0].type;
        let data = {
          file: dataURL,
          file_type: image.split("/")[1],
          file_name: input.files[0].name,
          file_size: input.files[0].size,
        };
        if (
          !["image/apng", "image/jpeg", "image/png", "image/webp"].includes(
            image
          )
        ) {
          setSnackbar({
            open: true,
            message: "فرمت فایل انتخابی باید فرمت تصویر باشد.",
            severity: "error",
          });
        } else if (data.file_size >= 1000000) {
          setSnackbar({
            open: true,
            message: "اندازه فایل آپلودی بایستی کمتر از 1 MB باشد.",
            severity: "error",
          });
        } else {
          setPic(data.file);
          formik.setFieldValue("pic", file.target.files[0]);
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  };
  const handelclik = (type) => {
    myRef.current.click();
  };
  return (
    <Box>
      {formik.values.pic === null ? (
        <Container
          class="container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onClick={(event) => handelclik(event.currentTarget.value)}
        >
          <img
            src={AvatarSVG}
            style={{
              borderRadius: "100%",
              width: "75px",
              height: "75px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "10px",
              display: "block",
              objectFit: "cover",
              boxShadow:
                "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
            }}
          />
          <div class="overlay">
            <div class="text">افزودن تصویر</div>
          </div>
        </Container>
      ) : formik.values.pic instanceof File ? (
        <Container
          class="container"
          onClick={(event) => handelclik(event.currentTarget.value)}
        >
          <img
            src={pic}
            style={{
              borderRadius: "50%",
              width: "75px",
              height: "75px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "10px",
              display: "block",
              boxShadow:
                "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
            }}
          />
          <div class="overlay">
            <div class="text">تغییر تصویر</div>
          </div>
        </Container>
      ) : (
        <Container
          class="container"
          onClick={(event) => handelclik(event.currentTarget.value)}
        >
          <img
            src={
              formik.values.pic
                ? `https://entekhab.yejooredigeh.com/ERS/get_user_pic/${formik.values.pic}`
                : AvatarSVG
            }
            style={{
              borderRadius: "50%",
              width: "75px",
              height: "75px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "10px",
              display: "block",
              boxShadow:
                "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
            }}
          />
          <span style={{ textAlign: "center", fontSize: "8px" }}>
            (برای تغییر تصویر خود روی عکس بالا کیلک کنید)
          </span>
          <div class="overlay">
            <div class="text">تغییر تصویر</div>
          </div>
        </Container>
      )}
      <input
        type="file"
        style={{ display: "none" }}
        ref={myRef}
        onChange={(event) => openFile(event)}
      />
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
    </Box>
  );
}

export const Container = styled.div`
  cursor: pointer;
  @media screen and (max-width: 768px) {
    margin-left: 0px;
    margin-bottom: 20px;
  }
  @media screen and (max-width: 480px) {
    margin-left: 0px;
    margin-bottom: 20px;
  }
`;
