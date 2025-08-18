import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
  Divider,
  CircularProgress,
  Box
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styled from "@emotion/styled";
import { GetButtonColor } from "../../../helper/buttonColor";

// Styled components
const FormContainer = styled.form`
  width: 100%;
  max-width: 600px;
  height: auto;
  box-shadow: 0 5px 20px rgba(112, 112, 112, 0.3);
  background-color: #fff;
  padding: 24px;
  margin: 0 auto 50px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 30px;
  }
`;

// Validation schema
const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
    .required("رمز عبور الزامی است"),
  re_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "رمز عبور و تکرار آن باید یکسان باشد")
    .required("تکرار رمز عبور الزامی است"),
});

const ChangePassword = ({ userInfo }) => {
  // State management
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handlers
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRePasswordVisibility = () => setShowRePassword(!showRePassword);

  const updatePassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/update_request",
        {
          table: "users",
          method_type: "update_password",
          data: {
            password: formik.values.password,
            re_password: formik.values.re_password,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );

      handlePasswordUpdateResponse(response);
    } catch (error) {
      showError("خطا در تغییر رمز عبور");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdateResponse = (response) => {
    if (response.data.tracking_code !== null) {
      showSuccess(response.data.response.message);
      formik.resetForm();
    } else {
      showError(response?.data?.error || "خطا در تغییر رمز عبور");
    }
  };

  const showSuccess = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: "success",
    });
  };

  const showError = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: "error",
    });
  };

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      password: "",
      re_password: "",
    },
    validationSchema,
    onSubmit: updatePassword,
  });

  return (
    <>
      <FormContainer onSubmit={formik.handleSubmit}>
        <Typography variant="h6" component="h2" fontWeight="bold" textAlign="center">
          تغییر رمز عبور
        </Typography>

        <Divider
          sx={{
            borderColor: GetButtonColor(userInfo?.data?.sex),
            borderWidth: 2,
            width: '80%',
            mx: 'auto'
          }}
        />

        <TextField
          label="رمز عبور"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="تکرار رمز عبور"
          name="re_password"
          type={showRePassword ? "text" : "password"}
          value={formik.values.re_password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.re_password && Boolean(formik.errors.re_password)}
          helperText={formik.touched.re_password && formik.errors.re_password}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={toggleRePasswordVisibility}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showRePassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            mt: 2,
            backgroundColor: GetButtonColor(userInfo?.data?.sex),
            '&:hover': {
              backgroundColor: GetButtonColor(userInfo?.data?.sex),
              opacity: 0.9,
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "تغییر رمز عبور"
          )}
        </Button>
      </FormContainer>

      <SnackbarNotification
        snackbar={snackbar}
        onClose={handleCloseSnackbar}
      />
    </>
  );
};

// Reusable Snackbar component
const SnackbarNotification = ({ snackbar, onClose }) => (
  <Snackbar
    open={snackbar.open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert
      onClose={onClose}
      severity={snackbar.severity}
      sx={{ width: "100%" }}
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
);

export default ChangePassword;