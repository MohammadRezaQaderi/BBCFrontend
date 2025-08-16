import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { 
  Alert, 
  Button, 
  Snackbar, 
  TextField, 
  Typography,
  Box,
  CircularProgress,
  Divider
} from "@mui/material";
import styled from "@emotion/styled";
import { SettingData } from "../SettingData";
import { setLocalStorageLogin } from "../../../pages/localStorage";
import { GetButtonColor } from "../../../helper/buttonColor";
import Images from "../../Typography/Image";

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
    padding: 10px;
    margin: 10px 50px;
    // margin-right: 10px;
    // margin-left: 10px;
  }
`;

const validationSchema = Yup.object({
  first_name: Yup.string().required("نام الزامی است"),
  last_name: Yup.string().required("نام خانوادگی الزامی است"),
});

const StuEdit = ({ userRole, userInfo }) => {
  // State management
  const [image, setImage] = useState(userInfo?.data.pic);
  const [showPic, setShowPic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handlers
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const updateUserProfile = async (values) => {
    setLoading(true);
    try {
      if (values.pic instanceof File) {
        await updateUserWithFile(values);
      } else {
        await updateUserWithoutFile(values);
      }
    } catch (error) {
      showError("خطا در بروزرسانی اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const updateUserWithFile = async (values) => {
    const formData = new FormData();
    formData.append("user_id", userInfo?.data.user_id);
    formData.append("phone", userInfo?.data.phone);
    formData.append("role", userRole);
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    formData.append("pic", values.pic);
    formData.append("last_pic", image);

    const response = await axios.post(
      "https://student.baazmoon.com/ERS/update_user_info_file",
      formData,
      {
        headers: {
          "content-type": "multipart/form-data",
        },
      }
    );

    handleUpdateResponse(response);
  };

  const updateUserWithoutFile = async (values) => {
    const response = await axios.post(
      "https://student.baazmoon.com/ERS/update_request",
      {
        table: "users",
        method_type: "update_user",
        data: {
          user_id: userInfo?.data.user_id,
          phone: userInfo?.data.phone,
          role: "stu",
          first_name: values.first_name,
          last_name: values.last_name,
          pic: values.pic,
          token: JSON.parse(localStorage.getItem("token")),
        },
      }
    );

    handleUpdateResponse(response);
  };

  const handleUpdateResponse = (response) => {
    if (response?.data?.tracking_code !== null) {
      updateLocalUserData(response.data.response.data);
      showSuccess(response.data.response.message);
      window.location.reload();
    } else {
      showError(response.data.error || "خطا در بروزرسانی اطلاعات");
    }
  };

  const updateLocalUserData = (newData) => {
    const user = JSON.parse(localStorage.getItem("user-info"));
    user.data = { ...user.data, ...newData };
    setLocalStorageLogin("user-info", user, () => {});
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
      first_name: userInfo?.data?.first_name || "",
      last_name: userInfo?.data?.last_name || "",
      pic: userInfo?.data?.pic || null,
    },
    validationSchema,
    onSubmit: updateUserProfile,
  });

  return (
    <>
      <FormContainer onSubmit={formik.handleSubmit}>
        <Typography variant="h6" component="h2" fontWeight="bold" textAlign="center">
          {SettingData[userRole]?.InfoChangeName || "ویرایش اطلاعات"}
        </Typography>

        <Images 
          formik={formik} 
          pic={showPic} 
          setPic={setShowPic} 
        />

        <Divider 
          sx={{ 
            borderColor: GetButtonColor(userInfo?.data?.sex),
            borderWidth: 2,
            width: '80%',
            mx: 'auto'
          }} 
        />

        <TextField
          label="نام"
          name="first_name"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.first_name && Boolean(formik.errors.first_name)}
          helperText={formik.touched.first_name && formik.errors.first_name}
          fullWidth
          margin="normal"
        />

        <TextField
          label="نام خانوادگی"
          name="last_name"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.last_name && Boolean(formik.errors.last_name)}
          helperText={formik.touched.last_name && formik.errors.last_name}
          fullWidth
          margin="normal"
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
            "تغییر اطلاعات"
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

// Snackbar component for better reusability
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

export default StuEdit;