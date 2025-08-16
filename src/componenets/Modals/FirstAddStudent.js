import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { provinces, quotas, fields, sexOptions } from "../../Data";
import { GetButtonColor } from "../../helper/buttonColor";

const FirstAddStudentForm = ({ setReload, consultants }) => {
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [userRole] = useState(JSON.parse(localStorage.getItem("user-role")));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      handleCancel("not");
      formik.resetForm();
    }
  };

  const handleCancel = (status) => {
    if (status === "after") {
      setReload((perv) => !perv);
    }
    setOpen(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      con_id: "",
      first_name: "",
      last_name: "",
      sex: null,
      birth_date: "",
      province: null,
      field: null,
      quota: null,
    },
    validationSchema: Yup.object({
      birth_date: Yup.string()
        .test(
          "checkBirthDate",
          "سال تولد به اشتباهی وارد شده",
          function check_national_id(code) {
            var str = code.toString();
            var strLen = str.length,
              strVal = parseInt(str);
            if (strLen < 4 || strLen > 4 || isNaN(strVal) || strVal == 0)
              return false;
            else return true;
          }
        )
        .required(""),
    }),
    onSubmit: (values) => {
      setLoading(true);
      insert_add_student(values).then(() => {
        setLoading(false);
      });
    },
  });

  const renderField = (field) => {
    if (field.type === "autocomplete") {
      return (
        <Autocomplete
          fullWidth
          options={field.options}
          value={formik.values[field.name]}
          getOptionLabel={(option) => option?.name || ""}
          onChange={(event, newValue) => {
            formik.setFieldValue(field.name, newValue);
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

  const handleSelectCons = (name, id) => {
    formik.setFieldValue("con_name", name);
    formik.setFieldValue("con_id", id);
  };

  const insert_add_student = async (values) => {
    try {
      const cleanedValues = {
        ...values,
        sex: values.sex?.id || null,
        province: values.province?.id + "," + values.province?.name || null,
        field: values.field?.id || null,
        quota: values.quota?.id || null,
      };

      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/insert_request",
        {
          table: "users",
          method_type: "insert_add_student",
          data: {
            ...cleanedValues,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        toast.success(response.data.response.message);
        setReload((perv) => !perv);
        setOpen(false);
        formik.resetForm();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        style={{
          background: GetButtonColor(userInfo?.data?.sex),
        }}
        sx={{ boxShadow: "none", borderRadius: "5px" }}
        onClick={() => setOpen(true)}
      >
        افزودن دانش‌آموز
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        disableEscapeKeyDown
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {"افزودن دانش‌آموز"}
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
              {
                label: "جنسیت",
                name: "sex",
                type: "autocomplete",
                options: sexOptions,
                required: true,
              },
              {
                label: "استان بومی",
                name: "province",
                type: "autocomplete",
                options: provinces,
                required: true,
              },
              {
                label: "گروه آموزشی",
                name: "field",
                type: "autocomplete",
                options: fields,
                required: true,
              },
              {
                label: "سهمیه ثبت‌نامی",
                name: "quota",
                type: "autocomplete",
                options: quotas,
                required: true,
              },
            ].map((field, index) => (
              <Grid item xs={12} md={6} key={index}>
                {renderField(field)}
              </Grid>
            ))}
            <Grid item md={6} xs={12}>
              <TextField
                label="سال تولد"
                value={formik.values.birth_date}
                fullWidth
                placeholder="1378"
                onChange={(event) => {
                  const englishDigits = event.target.value.replace(
                    /[۰-۹]/g,
                    (char) =>
                      String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 0x0030)
                  );
                  formik.setFieldValue(
                    "birth_date",
                    englishDigits.replace(/[^0-9]/g, "")
                  );
                }}
                type="text"
                required
              />
              {formik.touched.birth_date && formik.errors.birth_date ? (
                <div>
                  <p style={{ fontSize: 10, color: "red" }}>
                    {formik.errors.birth_date}
                  </p>
                </div>
              ) : null}
            </Grid>
            {!["con", "oCon"].includes(userRole) ? (
              <Grid item md={6} xs={12}>
                <Autocomplete
                  fullWidth
                  id="controllable-states-demo"
                  options={consultants}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handleSelectCons(newValue.name, newValue.con_id);
                    } else {
                      formik.setFieldValue("con_name", "");
                      formik.setFieldValue("con_id", "");
                    }
                  }}
                  getOptionLabel={(option) => option?.name || ""}
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
            ) : (
              <></>
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
                  style={{
                    background: GetButtonColor(userInfo?.data?.sex),
                  }}
                  sx={{
                    boxShadow: "none",
                    borderRadius: "5px",
                    padding: "12px 0",
                    marginRight: "10px",
                  }}
                  fullWidth
                  disabled={loading}
                >
                  ثبت
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
                  onClick={() => handleCancel("not")}
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

export default FirstAddStudentForm;
