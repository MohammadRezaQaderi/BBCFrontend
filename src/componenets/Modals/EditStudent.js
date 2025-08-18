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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { GetButtonColor } from "../../helper/buttonColor";

const validationSchema = Yup.object({});

const EditStudentForm = ({ InputData, setReload, consultants }) => {
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
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
            gl_limit: formik.values.gl_limit ? 0 : 1,
            fr_limit: formik.values.fr_limit ? 0 : 1,
            glf_limit: formik.values.glf_limit ? 0 : 1,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        toast.success(response?.data?.response.message);
        setLoading(false);
        setOpen(false);
        formik.resetForm();
        setReload((perv) => !perv);
      } else {
        toast.error(response.data.error);
        setLoading(false);
        setOpen(false);
        formik.resetForm();
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    }
  };

  const formik = useFormik({
    initialValues: {
      con_id: InputData ? InputData.con_id : "",
      gl_limit: InputData ? InputData.gl_limit === 0 : false,
      fr_limit: InputData ? InputData.fr_limit === 0 : false,
      glf_limit: InputData ? InputData.glf_limit === 0 : false,
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      setLoading(true);
      update_student_consult().then(() => {});
    },
  });

  useEffect(() => {
    if (InputData) {
      formik.setValues({
        con_id: InputData.con_id,
        gl_limit: InputData.gl_limit === 0,
        fr_limit: InputData.fr_limit === 0,
        glf_limit: InputData.glf_limit === 0,
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

            {InputData?.GL === 1 && (
              <Grid item md={12} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.gl_limit}
                      onChange={formik.handleChange}
                      name="gl_limit"
                      color="primary"
                    />
                  }
                  label="مسدود کردن دسترسی دانش‌آموز به قسمت انتخاب رشته سراسری"
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

            {InputData?.GLF === 1 && (
              <Grid item md={12} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.glf_limit}
                      onChange={formik.handleChange}
                      name="glf_limit"
                      color="primary"
                    />
                  }
                  label="مسدود کردن دسترسی دانش‌آموز به قسمت انتخاب رشته فرهنگیان"
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
    </div>
  );
};
export default EditStudentForm;