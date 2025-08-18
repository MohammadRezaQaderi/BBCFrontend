import React, { useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Grid,
  Snackbar,
  TextField,
  Typography,
  useTheme,
  Box,
  Dialog,
  Divider,
} from "@mui/material";
import provinces from "../../Data/provinces.json";
import fields from "../../Data/fields.json";
import quotas from "../../Data/quotas.json";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { sexOptions } from "../../Data";
import { GetButtonColor } from "../../helper/buttonColor";

const EditInfoModal = ({
  setReload,
  openMo,
  userData,
  setOpenMo,
  setUserData,
  stu_id,
  onClose,
  handleCloseFinalize,
}) => {

  const theme = useTheme();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [loading, setLoading] = useState(false);
  const [showZaban, setShowZaban] = useState(!!userData?.rank_zaban);
  const [showHonar, setShowHonar] = useState(!!userData?.rank_honar);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const accentColor = GetButtonColor(userInfo?.data?.sex);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formik = useFormik({
    initialValues: {
      sex: userData?.sex || null,
      birth_date: userData?.birth_date || "",
      province: userData?.city || null,
      field: userData?.field || null,
      quota: userData?.quota || null,
      full_number: userData?.full_number || "",
      rank: userData?.rank || "",
      rank_all: userData?.rank_all || "",
      last_rank: userData?.last_rank || "",
      rank_zaban: userData?.rank_zaban || "",
      full_number_zaban: userData?.full_number_zaban || "",
      rank_all_zaban: userData?.rank_all_zaban || "",
      rank_honar: userData?.rank_honar || "",
      full_number_honar: userData?.full_number_honar || "",
      rank_all_honar: userData?.rank_all_honar || "",
      finalized: userData?.finalized || null,
      first_name: userData?.first_name || null,
      last_name: userData?.last_name || null,
    },
    validationSchema: Yup.object({
      birth_date: Yup.string()
        .matches(/^\d{4}$/, "سال تولد باید 4 رقمی باشد")
        .required("سال تولد الزامی است"),
      full_number: Yup.number()
        .min(2000, "تراز باید حداقل 2000 باشد")
        .required("تراز الزامی است"),
      rank_all: Yup.number()
        .min(Yup.ref('rank'), "رتبه کشوری باید بزرگ‌تر یا مساوی رتبه سهمیه باشد")
        .required("رتبه کشوری الزامی است"),
    }),
    onSubmit: () => {
      setLoading(true);
      update_student_info().then(() => {
        setLoading(false);
      });
    },
  });

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      handleCancel();
      formik.resetForm();
    }
  };

  const handleCancel = () => {
    setOpenMo(false);
    setUserData({});
    formik.resetForm();
  };

  const update_student_info = async () => {
    try {
      const payload = {
        ...formik.values,
        first_name: formik.values.first_name || null,
        last_name: formik.values.last_name || null,
        sex: formik.values.sex || null,
        city: formik.values.province || null,
        field: formik.values.field || null,
        quota: formik.values.quota || null,
        full_number: parseInt(formik.values.full_number, 10),
        rank: parseInt(formik.values.rank, 10),
        rank_all: parseInt(formik.values.rank_all, 10),
        last_rank: parseInt(formik.values.last_rank, 10),
        rank_zaban: showZaban ? parseInt(formik.values.rank_zaban, 10) : null,
        full_number_zaban: showZaban
          ? parseInt(formik.values.full_number_zaban, 10)
          : null,
        rank_all_zaban: showZaban
          ? parseInt(formik.values.rank_all_zaban, 10)
          : null,
        rank_honar: showHonar ? parseInt(formik.values.rank_honar, 10) : null,
        full_number_honar: showHonar
          ? parseInt(formik.values.full_number_honar, 10)
          : null,
        rank_all_honar: showHonar
          ? parseInt(formik.values.rank_all_honar, 10)
          : null,
        stu_id: stu_id,
        finalized: parseInt(formik.values.finalized),
        token: JSON.parse(localStorage.getItem("token")),
      };

      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/update_request",
        {
          table: "users",
          method_type: "update_student_info",
          data: payload,
        }
      );

      if (response.data.tracking_code !== null) {
        setSnackbar({
          open: true,
          message: response?.data?.response?.message,
          severity: "success",
        });
        if (response?.data?.response?.finalized === 1) {
          handleCloseFinalize(stu_id);
        } else {
          setReload((perv) => !perv);
          setOpenMo(false);
          formik.resetForm();
          setUserData({});
          onClose();
        }
      } else {
        setSnackbar({
          open: true,
          message: response?.data?.error,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت اطلاعات",
        severity: "error",
      });
    }
  };

  const handleNumberInput = (e, fieldName) => {
    const englishDigits = e.target.value.replace(
      /[۰-۹]/g,
      (char) => String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 0x0030)
    );
    formik.setFieldValue(fieldName, englishDigits.replace(/[^0-9]/g, ""));
  };

  if (!openMo) return null;

  return (
    <Dialog
      open={openMo}
      onClose={handleClose}
      fullWidth
      disableEscapeKeyDown
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[5],
          p: { xs: 2, md: 4 },
          overflow: "auto"
        }
      }}
    >
      <Typography variant="h4" gutterBottom sx={{
        fontWeight: 700,
        color: 'text.primary',
        mb: 3,
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: -8,
          left: 0,
          width: 80,
          height: 4,
          backgroundColor: accentColor,
          borderRadius: 2
        }
      }}>
        {userData.finalized === 0 ? "ثبت اطلاعات کارنامه‌ای دانش‌آموز" : "ویرایش اطلاعات کارنامه‌ای دانش‌آموز"}
      </Typography>

      <Divider sx={{
        borderColor: accentColor,
        mb: 3,
        borderWidth: 1
      }} />

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Personal Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{
              color: 'text.secondary',
              mb: 2,
              borderBottom: `2px solid ${theme.palette.divider}`,
              pb: 1
            }}>
              اطلاعات شخصی
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="نام"
              value={formik.values.first_name}
              fullWidth
              placeholder="1378"
              onChange={(e) => handleNumberInput(e, "first_name")}
              error={formik.touched.first_name && Boolean(formik.errors.first_name)}
              helperText={formik.touched.first_name && formik.errors.first_name}
              required
              variant="outlined"
              size="small"
              inputProps={{ maxLength: 4 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="نام خانوادگی"
              value={formik.values.last_name}
              fullWidth
              placeholder="1378"
              onChange={(e) => handleNumberInput(e, "last_name")}
              error={formik.touched.last_name && Boolean(formik.errors.last_name)}
              helperText={formik.touched.last_name && formik.errors.last_name}
              required
              variant="outlined"
              size="small"
              inputProps={{ maxLength: 4 }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Autocomplete
              options={sexOptions}
              value={sexOptions.find(opt => opt.id === formik.values.sex) || null}
              onChange={(event, newValue) => {
                formik.setFieldValue("sex", newValue?.id);
              }}
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="جنسیت"
                  required
                  error={formik.touched.sex && Boolean(formik.errors.sex)}
                  helperText={formik.touched.sex && formik.errors.sex}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="سال تولد"
              value={formik.values.birth_date}
              fullWidth
              placeholder="1378"
              onChange={(e) => handleNumberInput(e, "birth_date")}
              error={formik.touched.birth_date && Boolean(formik.errors.birth_date)}
              helperText={formik.touched.birth_date && formik.errors.birth_date}
              required
              variant="outlined"
              size="small"
              inputProps={{ maxLength: 4 }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Autocomplete
              options={provinces}
              value={provinces.find(
                (province) =>
                  province.id === parseInt(formik.values?.province?.split(",")[1]) ||
                  province.name === formik.values?.province?.split(",")[1]
              )}
              getOptionLabel={(option) => option.name || ""}
              onChange={(event, newValue) => {
                formik.setFieldValue(
                  "province",
                  newValue ? `${newValue.id},${newValue.name}` : ""
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="استان بومی"
                  required
                  error={formik.touched.province && Boolean(formik.errors.province)}
                  helperText={formik.touched.province && formik.errors.province}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Autocomplete
              options={fields}
              value={fields.find(opt => opt.id === formik.values.field) || null}
              getOptionLabel={(option) => option.name || ""}
              onChange={(event, newValue) => {
                formik.setFieldValue("field", newValue?.id);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="گروه آزمایشی"
                  required
                  error={formik.touched.field && Boolean(formik.errors.field)}
                  helperText={formik.touched.field && formik.errors.field}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Academic Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{
              color: 'text.secondary',
              mb: 2,
              borderBottom: `2px solid ${theme.palette.divider}`,
              pb: 1
            }}>
              اطلاعات تحصیلی
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Autocomplete
              options={quotas}
              value={quotas.find(opt => opt.id === formik.values.quota) || null}
              getOptionLabel={(option) => option.name || ""}
              onChange={(event, newValue) => {
                formik.setFieldValue("quota", newValue?.id);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="سهمیه ثبت‌نامی"
                  required
                  error={formik.touched.quota && Boolean(formik.errors.quota)}
                  helperText={formik.touched.quota && formik.errors.quota}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="نمره کل"
              value={formik.values.full_number}
              fullWidth
              placeholder="1000"
              onChange={(e) => handleNumberInput(e, "full_number")}
              error={formik.touched.full_number && Boolean(formik.errors.full_number)}
              helperText={formik.touched.full_number && formik.errors.full_number}
              required
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="رتبه در سهمیه"
              value={formik.values.rank}
              fullWidth
              placeholder="1300"
              onChange={(e) => handleNumberInput(e, "rank")}
              error={formik.touched.rank && Boolean(formik.errors.rank)}
              helperText={formik.touched.rank && formik.errors.rank}
              required
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="رتبه کشوری"
              value={formik.values.rank_all}
              fullWidth
              placeholder="5000"
              onChange={(e) => handleNumberInput(e, "rank_all")}
              error={formik.touched.rank_all && Boolean(formik.errors.rank_all)}
              helperText={formik.touched.rank_all && formik.errors.rank_all}
              required
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="آخرین رتبه مجاز سهمیه"
              value={formik.values.last_rank}
              fullWidth
              placeholder="69000"
              onChange={(e) => handleNumberInput(e, "last_rank")}
              error={formik.touched.last_rank && Boolean(formik.errors.last_rank)}
              helperText={formik.touched.last_rank && formik.errors.last_rank}
              variant="outlined"
              size="small"
            />
          </Grid>

          {/* Optional Sections */}
          <Grid item xs={12}>
            <Box sx={{
              display: 'flex',
              gap: 3,
              mb: 2,
              flexWrap: 'wrap'
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showZaban}
                    onChange={(e) => setShowZaban(e.target.checked)}
                    color="primary"
                  />
                }
                label="نمایش بخش زبان"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showHonar}
                    onChange={(e) => setShowHonar(e.target.checked)}
                    color="primary"
                  />
                }
                label="نمایش بخش هنر"
              />
            </Box>
          </Grid>

          {/* Language Results */}
          {showZaban && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  label="رتبه منطقه زبان"
                  value={formik.values.rank_zaban}
                  fullWidth
                  placeholder="27"
                  onChange={(e) => handleNumberInput(e, "rank_zaban")}
                  error={formik.touched.rank_zaban && Boolean(formik.errors.rank_zaban)}
                  helperText={formik.touched.rank_zaban && formik.errors.rank_zaban}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="نمره کل زبان"
                  value={formik.values.full_number_zaban}
                  fullWidth
                  placeholder="6000"
                  onChange={(e) => handleNumberInput(e, "full_number_zaban")}
                  error={formik.touched.full_number_zaban && Boolean(formik.errors.full_number_zaban)}
                  helperText={formik.touched.full_number_zaban && formik.errors.full_number_zaban}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="رتبه کشوری زبان"
                  value={formik.values.rank_all_zaban}
                  fullWidth
                  placeholder="1500"
                  onChange={(e) => handleNumberInput(e, "rank_all_zaban")}
                  error={formik.touched.rank_all_zaban && Boolean(formik.errors.rank_all_zaban)}
                  helperText={formik.touched.rank_all_zaban && formik.errors.rank_all_zaban}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </>
          )}

          {/* Art Results */}
          {showHonar && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  label="رتبه منطقه هنر"
                  value={formik.values.rank_honar}
                  fullWidth
                  placeholder="21"
                  onChange={(e) => handleNumberInput(e, "rank_honar")}
                  error={formik.touched.rank_honar && Boolean(formik.errors.rank_honar)}
                  helperText={formik.touched.rank_honar && formik.errors.rank_honar}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="نمره کل هنر"
                  value={formik.values.full_number_honar}
                  fullWidth
                  placeholder="8000"
                  onChange={(e) => handleNumberInput(e, "full_number_honar")}
                  error={formik.touched.full_number_honar && Boolean(formik.errors.full_number_honar)}
                  helperText={formik.touched.full_number_honar && formik.errors.full_number_honar}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="رتبه کشوری هنر"
                  value={formik.values.rank_all_honar}
                  fullWidth
                  placeholder="2500"
                  onChange={(e) => handleNumberInput(e, "rank_all_honar")}
                  error={formik.touched.rank_all_honar && Boolean(formik.errors.rank_all_honar)}
                  helperText={formik.touched.rank_all_honar && formik.errors.rank_all_honar}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </>
          )}

          {/* Submit Buttons */}
          <Grid item xs={12}>
            <Box sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'space-between'
            }}>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  height: 48,
                  backgroundColor: accentColor,
                  '&:hover': {
                    backgroundColor: accentColor,
                    opacity: 0.9,
                  },
                  flex: 1
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  userData?.finalized === 0 ? "ثبت اولیه اطلاعات" : "ثبت نهایی اطلاعات"
                )}
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{
                  height: 48,
                  flex: 1
                }}
                onClick={handleCancel}
              >
                انصراف
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

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
    </Dialog>
  );
};

export default EditInfoModal;