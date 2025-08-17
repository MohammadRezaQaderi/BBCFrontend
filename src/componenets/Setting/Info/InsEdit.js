import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { SettingData } from "./SettingData";
import Images from "../../Typography/Image";
import { setLocalStorageLogin } from "../../../pages/localStorage";
import { GetButtonColor } from "../../../helper/buttonColor";

const Form = styled.form`
  width: ${({ width }) => "calc(" + width + " - 20px)"};
  height: auto;
  box-shadow: 0 5px 20px rgba(112, 112, 112, 0.3);
  background-color: #fff;
  padding: 10px;
  margin-bottom: 50px;
  margin-right: 20px;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const InsEdit = ({ userRole, userInfo }) => {
  const [image, setImage] = useState(userInfo?.data.pic);
  const [showPic, setShowPic] = useState(false);
  const [loading, setLoading] = useState(false);

  const update_user_file = async () => {
    const formData = new FormData();
    formData.append("token", JSON.parse(localStorage.getItem("token")));
    formData.append("name", formik.values.name);
    formData.append("pic", formik.values.pic);
    formData.append("last_pic", image);
    let response = await axios.post(
      "https://student.baazmoon.com/bbc_api/update_user_ins_file",
      formData,
      {
        headers: {
          "content-type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    if (response?.data?.tracking_code !== null) {
      let user = JSON.parse(localStorage.getItem("user-info"));
      user["data"]["name"] = response?.data?.response?.data.name;
      user["data"]["pic"] = response?.data?.response?.data.pic;
      setLocalStorageLogin("user-info", user, () => {});
      toast.success(response?.data?.response?.message);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      toast.error(response?.data?.error);
    }
  };

  const update_user = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/update_request",
        {
          table: "users",
          method_type: "update_user",
          data: {
            name: formik.values.name,
            pic: formik.values.pic,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        let user = JSON.parse(localStorage.getItem("user-info"));
        user["data"]["name"] = response?.data?.response?.data.name;
        setLocalStorageLogin("user-info", user, () => {});
        toast.success(response?.data?.response?.message);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    }
  };

  const formik = useFormik({
    initialValues: {
      name: userInfo?.data?.name,
      pic: userInfo?.data?.pic,
    },
    validationSchema: Yup.object({}),
    onSubmit: () => {
      setLoading(true);
      if (formik.values.pic instanceof File) {
        update_user_file().then(() => {
          setLoading(false);
        });
      } else {
        update_user().then(() => {
          setLoading(false);
        });
      }
    },
  });

  return (
    <Form
      onSubmit={formik.handleSubmit}
      width="50%"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "5px",
      }}
    >
      <Typography
        component="h4"
        variant="h6"
        color="mainText"
        style={{ marginBottom: "20px" }}
        fontWeight="bold"
      >
        {SettingData[userRole].InfoChangeName}
      </Typography>
      <Images formik={formik} pic={showPic} setPic={setShowPic} />
      <hr
        style={{
          borderTop: `2px solid ${GetButtonColor(userInfo?.data?.sex)}`,
          height: "2px",
          width: "80%",
          marginTop: "10px",
        }}
      ></hr>
      <TextField
        label={"نام موسسه"}
        value={formik.values.name}
        fullWidth
        onChange={(e) => formik.setFieldValue("name", e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        style={{ width: "80%" }}
      />
      <Button
        variant="contained"
        style={{
          width: "80%",
          marginTop: "20px",
          marginBottom: "20px",
          background: GetButtonColor(userInfo?.data?.sex),
        }}
        type="submit"
        disabled={loading}
      >
        تغییر اطلاعات
      </Button>
    </Form>
  );
};

export default InsEdit;
