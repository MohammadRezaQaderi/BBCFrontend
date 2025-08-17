import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { SettingData } from "./SettingData";
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

const ConEdit = ({ userRole, userInfo }) => {
  const [loading, setLoading] = useState(false);

  const update_user = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/update_request",
        {
          table: "users",
          method_type: "update_user",
          data: {
            first_name: formik.values.first_name,
            last_name: formik.values.last_name,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        let user = JSON.parse(localStorage.getItem("user-info"));
        user["data"]["first_name"] = response?.data?.response?.data.first_name;
        user["data"]["last_name"] = response?.data?.response?.data.last_name;
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
      first_name: userInfo?.data?.first_name,
      last_name: userInfo?.data?.last_name,
    },
    validationSchema: Yup.object({}),
    onSubmit: () => {
      setLoading(true);
      update_user().then(() => {
        setLoading(false);
      });
    },
  });

  return (
    <Form
      onSubmit={formik.handleSubmit}
      width="50%"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
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
      <hr
        style={{
          borderTop: `2px solid ${GetButtonColor(userInfo?.data?.sex)}`,
          height: "2px",
          width: "80%",
          marginTop: "10px",
        }}
      ></hr>
      <TextField
        label="نام"
        value={formik.values.first_name}
        fullWidth
        onChange={(e) => formik.setFieldValue("first_name", e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        style={{ marginBottom: "20px", width: "80%" }}
      />
      <TextField
        label="نام‌خانوادگی"
        value={formik.values.last_name}
        fullWidth
        onChange={(e) => formik.setFieldValue("last_name", e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        style={{ marginBottom: "20px", width: "80%" }}
      />

      <Button
        variant="contained"
        type="submit"
        disabled={loading}
        style={{
          width: "80%",
          marginTop: "20px",
          marginBottom: "20px",
          background: GetButtonColor(userInfo?.data?.sex),
        }}
      >
        تغییر اطلاعات
      </Button>
    </Form>
  );
};

export default ConEdit;
