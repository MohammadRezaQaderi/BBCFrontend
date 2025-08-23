import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { GetButtonColor } from "../../helper/buttonColor";

const validationSchema = Yup.object({});

const EditStudentForm = ({ InputData, setReload, consultants }) => {
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      handleCancel();
      formik.resetForm();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    formik.resetForm();
  };

  const handleSelectCons = (id) => {
    formik.setFieldValue("con_id", id);
  };

  const update_student_consult = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/update_request",
        {
          table: "users",
          method_type: "update_student_consult",
          data: {
            con_id: parseInt(formik.values.con_id),
            stu_id: InputData?.user_id,
            hoshmand_limit: formik.values.hoshmand_limit ? 0 : 1,
            fr_limit: formik.values.fr_limit ? 0 : 1,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setSnackbar({
          open: true,
          message: response?.data?.response.message,
          severity: "success",
        });
        setLoading(false);
        setOpen(false);
        formik.resetForm();
        setReload((perv) => !perv);
      } else {
        setSnackbar({
          open: true,
          message: response?.data?.error,
          severity: "error",
        });
        setLoading(false);
        setOpen(false);
        formik.resetForm();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت اطلاعات کاربر",
        severity: "error",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      con_id: InputData ? InputData.con_id : "",
      hoshmand_limit: InputData ? InputData.hoshmand_limit === 0 : false,
      fr_limit: InputData ? InputData.fr_limit === 0 : false,
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      setLoading(true);
      update_student_consult().then(() => { });
    },
  });

  useEffect(() => {
    if (InputData) {
      formik.setValues({
        con_id: InputData.con_id,
        hoshmand_limit: InputData.hoshmand_limit === 0,
        fr_limit: InputData.fr_limit === 0,
      });
    }
  }, [InputData]);

  return (
    <div>
      <Tooltip title="ویرایش">
        <Button onClick={() => setOpen(true)}>
          <EditIcon />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        disableEscapeKeyDown
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {"ویرایش دسترسی دانش‌آموز"}
        </DialogTitle>
        <Grid item xs={12}>
          <hr
            style={{
              border: `1px solid ${GetButtonColor(userInfo?.data?.sex)}`,
            }}
          />
        </Grid>
        <form onSubmit={formik.handleSubmit} style={{ padding: "20px" }}>
          <Grid container spacing={3} padding={2}>
            {["ins"].includes(userInfo?.data?.role) && (
              <Grid item md={12} xs={12}>
                <Autocomplete
                  fullWidth
                  value={
                    InputData
                      ? consultants.find(
                        (item) => item.con_id === formik.values.con_id
                      )
                      : null
                  }
                  id="controllable-states-demo"
                  options={consultants}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handleSelectCons(newValue.con_id);
                    } else {
                      formik.setFieldValue("con_id", "");
                    }
                  }}
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      value={formik.values.con_id}
                      {...params}
                      label={"مشاور"}
                      required
                    />
                  )}
                />
              </Grid>
            )}

            {InputData?.hoshmand === 1 && (
              <Grid item md={12} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.hoshmand_limit}
                      onChange={formik.handleChange}
                      name="hoshmand_limit"
                      color="primary"
                    />
                  }
                  label="مسدود کردن دسترسی دانش‌آموز به قسمت انتخاب رشته هوشمند"
                />
              </Grid>
            )}

            {InputData?.FR === 1 && (
              <Grid item md={12} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.fr_limit}
                      onChange={formik.handleChange}
                      name="fr_limit"
                      color="primary"
                    />
                  }
                  label="مسدود کردن دسترسی دانش‌آموز به قسمت انتخاب رشته آزاد"
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    boxShadow: "none",
                    borderRadius: "5px",
                    padding: "12px 0",
                    marginRight: "10px",
                  }}
                  style={{
                    background: GetButtonColor(userInfo?.data?.sex),
                  }}
                  fullWidth
                  disabled={loading}
                >
                  ویرایش
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    boxShadow: "none",
                    borderRadius: "5px",
                    padding: "12px 0",
                  }}
                  fullWidth
                  onClick={() => handleCancel()}
                >
                  انصراف
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </Dialog>
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
    </div>
  );
};
export default EditStudentForm;