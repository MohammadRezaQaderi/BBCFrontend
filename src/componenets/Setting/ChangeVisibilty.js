import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Tooltip,
  IconButton,
  Container,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import styled from "styled-components";
import { setLocalStorageLogin } from "../../pages/localStorage";
import { GetButtonColor } from "../../helper/buttonColor";

const FormContainer = styled.form`
  width: ${({ width }) => "calc(" + width + " - 20px)"};
  height: auto;
  box-shadow: 0 5px 20px rgba(112, 112, 112, 0.3);
  background-color: #fff;
  padding: 20px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Divider = styled.hr`
  border-top: 2px solid ${({ color }) => color};
  width: 80%;
  margin: 20px 0;
`;

const ChangeVisibilty = () => {
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [loading, setLoading] = useState(false);
  const update_permission = async (permission) => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/update_request",
        {
          table: "users",
          method_type: "update_permission",
          data: {
            permission: permission,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );

      if (response.data.tracking_code !== null) {
        let user = JSON.parse(localStorage.getItem("user-info"));
        user["data"]["permission"] = response?.data?.response?.data.permission;
        setLocalStorageLogin("user-info", user, () => {});
        toast.success(response?.data?.response?.message);
        setTimeout(() => window.location.reload(), 3000);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      permission: userInfo?.data?.permission || 0,
    },
    validationSchema: Yup.object({}),
    onSubmit: () => {
      setLoading(true);
      update_permission(formik.values.permission);
    },
  });

  const handleToggleChange = (event) => {
    formik.setFieldValue("permission", event.target.checked ? 1 : 0);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "50px" }}>
      <Grid
        container
        spacing={2}
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormContainer onSubmit={formik.handleSubmit}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight="bold" color="textPrimary">
              تغییر نمایش احتمال قبولی
            </Typography>
            <Tooltip title="در صورت تغییر دسترسی، دانش‌آموزان شما قابلیت دیدن احتمال قبولی را نخواهند داشت.">
              <IconButton size="small" style={{ marginLeft: "8px" }}>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider color={GetButtonColor(userInfo?.data?.sex)} />
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.permission === 1}
                onChange={handleToggleChange}
                color="primary"
                disabled={loading}
              />
            }
            label={
              formik.values.permission === 1
                ? "دانش‌آموزان دسترسی دیدن احتمال قبولی را دارند."
                : "دانش‌آموزان دسترسی دیدن احتمال قبولی را ندارند."
            }
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              background: GetButtonColor(userInfo?.data?.sex),
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "تغییر دسترسی"
            )}
          </Button>
        </FormContainer>
      </Grid>
    </Container>
  );
};

export default ChangeVisibilty;
