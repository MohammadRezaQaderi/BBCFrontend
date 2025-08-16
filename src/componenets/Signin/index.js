import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { setLocalStorageLogin } from "../../pages/localStorage";
import {
  Button,
  LinearProgress,
  TextField,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { LogoIcon } from "../Navbar/NavbarElements";
import logo from "../../assets/images/logo.png";
import { animateScroll as scroll } from "react-scroll";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styled from "@emotion/styled";

// Validation schema
const validationSchema = Yup.object({
  phone: Yup.string()
    .required("شماره تلفن الزامی است")
    .matches(/^[0-9]{11}$/, "شماره تلفن باید 11 رقمی باشد"),
  password: Yup.string()
    .required("رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد"),
});

// Styled components
const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 20px;
`;

const AuthForm = styled.form`
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Signin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handlers
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/signin",
        {
          table: "users",
          method_type: "signin",
          data: {
            phone: values.phone,
            password: values.password,
          },
        }
      );

      handleSigninResponse(response);
    } catch (error) {
      showError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleSigninResponse = (response) => {
    if (response.data.tracking_code !== null) {
      const data = {
        authenticated: true,
        value: response.data.response.data,
        timestamp: 1000 * 60 * 60 * 12,
        data: response.data.response,
      };

      setLocalStorageLogin("user-info", data, () => {});
      setLocalStorageLogin("user-role", data.data.role, () => {});
      setLocalStorageLogin("token", response.data.tracking_code, () => {});

      navigate("/dashboard");
      window.location.reload();
    } else {
      showError(response?.data?.error || "خطا در ورود");
    }
  };

  const showError = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: "error",
    });
  };

  const toggleHome = () => {
    navigate("/");
    scroll.scrollToTop();
  };

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleSignin,
  });

  // Format phone number input to English digits
  const handlePhoneChange = (e) => {
    const englishDigits = e.target.value.replace(/[۰-۹]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 0x0030)
    );
    formik.setFieldValue("phone", englishDigits.replace(/[^0-9]/g, ""));
  };

  return (
    <AuthContainer>
      <AuthForm onSubmit={formik.handleSubmit}>
        {loading && (
          <LinearProgress
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              borderRadius: "8px 8px 0 0",
            }}
          />
        )}

        <Box display="flex" justifyContent="center" mb={3}>
          <LogoIcon src={logo} to="/" onClick={toggleHome} />
        </Box>

        <Typography variant="h5" align="center" gutterBottom>
          ورود به حساب کاربری
        </Typography>

        <Typography variant="body2" color="textSecondary" align="center" mb={3}>
          برای ورود اطلاعات خود را وارد کنید
        </Typography>

        <Divider sx={{ my: 2, borderColor: "#36ae7c", borderWidth: 2 }} />

        <TextField
          fullWidth
          label="شماره تلفن"
          name="phone"
          value={formik.values.phone}
          onChange={handlePhoneChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          margin="normal"
          inputProps={{ maxLength: 11 }}
        />

        <TextField
          fullWidth
          label="رمز عبور"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
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

        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          sx={{
            mt: 2,
            mb: 2,
            backgroundColor: "#36ae7c",
            "&:hover": {
              backgroundColor: "#2d9968",
            },
            height: "48px",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "ورود"}
        </Button>
      </AuthForm>

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
    </AuthContainer>
  );
};

export default Signin;
