import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { sexOptions } from "../../Data";
import { GetButtonColor } from "../../helper/buttonColor";

const EditConsultantForm = ({
  type,
  data,
  setReload,
  headConsultants,
  userInfo,
  userRole,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
      formik.resetForm();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    formik.resetForm();
  };

  const renderField = (field) => {
    if (field.type === "autocomplete") {
      return (
        <Autocomplete
          fullWidth
          options={field.options}
          value={field.value}
          getOptionLabel={(option) => option?.name || ""}
          onChange={(event, newValue) => {
            formik.setFieldValue(field.name, newValue?.value || "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={field.label}
              error={
                formik.touched[field.name] && Boolean(formik.errors[field.name])
              }
              helperText={
                formik.touched[field.name] && formik.errors[field.name]
              }
              required={field.required}
            />
          )}
        />
      );
    }
    return (
      <TextField
        fullWidth
        label={field.label}
        name={field.name}
        value={formik.values[field.name]}
        onChange={formik.handleChange}
        error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
        helperText={formik.touched[field.name] && formik.errors[field.name]}
        required={field.required}
      />
    );
  };

  const update_consultant = async () => {
    try {
      if (formik.values.hCon_id === "") {
        toast.warning("لطفا مشاور انتخاب نمایید.");
        return;
      }
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/update_request",
        {
          table: "users",
          method_type: "update_consultant",
          data: {
            first_name: formik.values.first_name,
            last_name: formik.values.last_name,
            sex: formik.values.sex,
            hCon_id: formik.values.hCon_id,
            consultant_id: formik.values.consultant_id,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        toast.success(response?.data?.response.message);
        setReload((perv) => !perv);
        setOpen(false);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سامانه");
    }
  };

  const formik = useFormik({
    initialValues: {
      first_name: data ? data.first_name : "",
      last_name: data ? data.last_name : "",
      phone: data ? data.phone : "",
      consultant_id: data ? data.user_id : "",
      hCon_id: data ? data.hCon_id : "",
      sex: data ? data.sex : "",
    },
    validationSchema: Yup.object({}),
    onSubmit: () => {
      setLoading(true);
      update_consultant().then(() => {
        setLoading(false);
      });
    },
  });

  useEffect(() => {
    if (data) {
      formik.setValues({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        consultant_id: data.user_id,
        hCon_id: data.hCon_id,
        sex: data.sex,
      });
    }
  }, [data]);

  return (
    <div>
      <Tooltip title="ویرایش">
        <Button onClick={() => setOpen(true)}>
          <EditIcon />
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: "center" }}>{"ویرایش مشاور"}</DialogTitle>
        <form onSubmit={formik.handleSubmit} style={{ padding: "20px" }}>
          <Grid container spacing={3} padding={2}>
            {[
              {
                label: "نام",
                name: "first_name",
                type: "text",
                required: true,
              },
              {
                label: "نام‌خانوادگی",
                name: "last_name",
                type: "text",
                required: true,
              },
            ].map((field, index) => (
              <Grid item xs={12} md={6} key={index}>
                {renderField(field)}
              </Grid>
            ))}
            <Grid item md={6} xs={12}>
              <TextField
                label="شماره تلفن"
                value={formik.values.phone}
                fullWidth
                onChange={(event) => {
                  const englishDigits = event.target.value.replace(
                    /[۰-۹]/g,
                    (char) =>
                      String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 0x0030)
                  );
                  formik.setFieldValue(
                    "phone",
                    englishDigits.replace(/[^0-9]/g, "")
                  );
                }}
                required
                disabled
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.phone}
                  </p>
                </div>
              ) : null}
            </Grid>
            <Grid item md={6} xs={12}>
              <Autocomplete
                fullWidth
                id="controllable-states-demo"
                options={sexOptions}
                onChange={(event, newValue) => {
                  formik.setFieldValue("sex", newValue?.id || "");
                }}
                value={sexOptions.find((s) => s.id === data.sex) || null}
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    label="جنسیت"
                    required
                    error={formik.touched.sex && Boolean(formik.errors.sex)}
                    helperText={formik.touched.sex && formik.errors.sex}
                  />
                )}
              />
            </Grid>
            {["ins"].includes(userRole) && (
              <Grid item md={6} xs={12}>
                <Autocomplete
                  fullWidth
                  id="controllable-states-demo"
                  options={headConsultants ? headConsultants : []}
                  onChange={(event, newValue) => {
                    if (newValue?.user_id) {
                      formik.setFieldValue("hCon_id", newValue.user_id);
                    } else {
                      formik.setFieldValue("hCon_id", "");
                    }
                  }}
                  getOptionLabel={(option) =>
                    option.first_name + " " + option.last_name || ""
                  }
                  value={
                    headConsultants.find((h) => h.user_id === data.hCon_id) || {
                      first_name: "",
                      last_name: "",
                      user_id: null,
                    }
                  }
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      value={formik.values.con_name}
                      {...params}
                      label={"مشاور"}
                      required
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
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

export default EditConsultantForm;
