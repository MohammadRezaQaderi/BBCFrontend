import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { sexOptions, provinces, fields, quotas } from "../../../Data/index";
import { GetButtonColor } from "../../../helper/buttonColor";

const validationSchema = Yup.object({
  birth_date: Yup.string()
    .matches(/^\d{4}$/, "سال تولد باید 4 رقمی باشد")
    .required("سال تولد الزامی است"),
  full_number: Yup.number()
    .min(2000, "تراز باید حداقل 2000 باشد")
    .required("تراز الزامی است"),
  rank_all: Yup.number()
    .min(Yup.ref('rank'), "رتبه کشوری باید بزرگ‌تر یا مساوی رتبه سهمیه باشد")
    .required("رتبه کشوری الزامی است"),
});

const EditInfoUser = ({ userData, final, setReload, reload }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [showZaban, setShowZaban] = useState(!!userData?.rank_zaban);
  const [showHonar, setShowHonar] = useState(!!userData?.rank_honar);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const accentColor = GetButtonColor(userInfo?.data?.sex);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formik = useFormik({
    initialValues: {
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      sex: sexOptions.find((opt) => opt.id === userData?.sex) || null,
      birth_date: userData?.birth_date || "",
      city: userData?.city
        ? {
          name: userData.city.split(",")[1],
          id: parseInt(userData.city.split(",")[1]),
        }
        : null,
      field: fields.find((opt) => opt.id === userData?.field) || null,
      quota: quotas.find((opt) => opt.id === userData?.quota) || null,
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
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload = {
          ...values,
          city: values.city ? `${values.city.name},${values.city.id}` : null,
          sex: values.sex?.id || null,
          field: values.field?.id || null,
          quota: values.quota?.id || null,
          full_number: parseInt(values.full_number, 10),
          rank: parseInt(values.rank, 10),
          rank_all: parseInt(values.rank_all, 10),
          last_rank: parseInt(values.last_rank, 10),
          rank_zaban: showZaban ? parseInt(values.rank_zaban, 10) : null,
          full_number_zaban: showZaban ? parseInt(values.full_number_zaban, 10) : null,
          rank_all_zaban: showZaban ? parseInt(values.rank_all_zaban, 10) : null,
          rank_honar: showHonar ? parseInt(values.rank_honar, 10) : null,
          full_number_honar: showHonar ? parseInt(values.full_number_honar, 10) : null,
          rank_all_honar: showHonar ? parseInt(values.rank_all_honar, 10) : null,
          token: JSON.parse(localStorage.getItem("token")),
        };

        const method = final === 0 ? "update_student_info" : "finalize_student_info";
        const response = await axios.post(
          "https://student.baazmoon.com/bbc_api/update_request",
          {
            table: "users",
            method_type: method,
            data: payload,
          }
        );

        if (response?.data?.tracking_code !== null) {
          setSnackbar({
            open: true,
            message: response?.data?.response?.message,
            severity: "success",
          });
          setReload(!reload);
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
          message: "خطا در ارسال اطلاعات",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleNumberInput = (e, fieldName) => {
    const englishDigits = e.target.value.replace(/[۰-۹]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 0x0030)
    );
    formik.setFieldValue(fieldName, englishDigits.replace(/[^0-9]/g, ""));
  };

  return (
    <Card sx={{
      borderRadius: 2,
      boxShadow: theme.shadows[3],
      p: { xs: 2, md: 4 },
      mx: { xs: 1, md: 3 },
      my: 2,
      bgcolor: 'background.paper',
      overflow: "auto"
    }}>
      <CardContent>
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
          {final === 0 ? "ثبت اطلاعات کاربر" : "ویرایش اطلاعات کاربر"}
        </Typography>

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

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="نام"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
                required
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="نام خانوادگی"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
                required
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Autocomplete
                fullWidth
                options={sexOptions}
                value={formik.values.sex}
                getOptionLabel={(option) => option?.name || ""}
                onChange={(event, newValue) => formik.setFieldValue("sex", newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="جنسیت"
                    error={formik.touched.sex && Boolean(formik.errors.sex)}
                    helperText={formik.touched.sex && formik.errors.sex}
                    required
                    variant="outlined"
                    size="small"
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
              <TextField
                fullWidth
                label="سال تولد"
                name="birth_date"
                value={formik.values.birth_date}
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
                fullWidth
                options={provinces}
                value={formik.values.city}
                getOptionLabel={(option) => option?.name || ""}
                onChange={(event, newValue) => formik.setFieldValue("city", newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="استان بومی"
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                    required
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Autocomplete
                fullWidth
                options={fields}
                value={formik.values.field}
                getOptionLabel={(option) => option?.name || ""}
                onChange={(event, newValue) => formik.setFieldValue("field", newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="گروه آموزشی"
                    error={formik.touched.field && Boolean(formik.errors.field)}
                    helperText={formik.touched.field && formik.errors.field}
                    required
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Autocomplete
                fullWidth
                options={quotas}
                value={formik.values.quota}
                getOptionLabel={(option) => option?.name || ""}
                onChange={(event, newValue) => formik.setFieldValue("quota", newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="سهمیه ثبت‌نامی"
                    error={formik.touched.quota && Boolean(formik.errors.quota)}
                    helperText={formik.touched.quota && formik.errors.quota}
                    required
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>

            {/* Exam Results Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{
                color: 'text.secondary',
                mb: 2,
                borderBottom: `2px solid ${theme.palette.divider}`,
                pb: 1
              }}>
                نتایج آزمون
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="نمره کل"
                name="full_number"
                value={formik.values.full_number}
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
                fullWidth
                label="رتبه در سهمیه"
                name="rank"
                value={formik.values.rank}
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
                fullWidth
                label="رتبه کشوری"
                name="rank_all"
                value={formik.values.rank_all}
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
                fullWidth
                label="آخرین رتبه مجاز سهمیه"
                name="last_rank"
                value={formik.values.last_rank}
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
                    fullWidth
                    label="رتبه منطقه زبان"
                    name="rank_zaban"
                    value={formik.values.rank_zaban}
                    onChange={(e) => handleNumberInput(e, "rank_zaban")}
                    error={formik.touched.rank_zaban && Boolean(formik.errors.rank_zaban)}
                    helperText={formik.touched.rank_zaban && formik.errors.rank_zaban}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="نمره کل زبان"
                    name="full_number_zaban"
                    value={formik.values.full_number_zaban}
                    onChange={(e) => handleNumberInput(e, "full_number_zaban")}
                    error={formik.touched.full_number_zaban && Boolean(formik.errors.full_number_zaban)}
                    helperText={formik.touched.full_number_zaban && formik.errors.full_number_zaban}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="رتبه کشوری زبان"
                    name="rank_all_zaban"
                    value={formik.values.rank_all_zaban}
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
                    fullWidth
                    label="رتبه منطقه هنر"
                    name="rank_honar"
                    value={formik.values.rank_honar}
                    onChange={(e) => handleNumberInput(e, "rank_honar")}
                    error={formik.touched.rank_honar && Boolean(formik.errors.rank_honar)}
                    helperText={formik.touched.rank_honar && formik.errors.rank_honar}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="نمره کل هنر"
                    name="full_number_honar"
                    value={formik.values.full_number_honar}
                    onChange={(e) => handleNumberInput(e, "full_number_honar")}
                    error={formik.touched.full_number_honar && Boolean(formik.errors.full_number_honar)}
                    helperText={formik.touched.full_number_honar && formik.errors.full_number_honar}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="رتبه کشوری هنر"
                    name="rank_all_honar"
                    value={formik.values.rank_all_honar}
                    onChange={(e) => handleNumberInput(e, "rank_all_honar")}
                    error={formik.touched.rank_all_honar && Boolean(formik.errors.rank_all_honar)}
                    helperText={formik.touched.rank_all_honar && formik.errors.rank_all_honar}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </>
            )}

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                  height: 48,
                  backgroundColor: accentColor,
                  '&:hover': {
                    backgroundColor: accentColor,
                    opacity: 0.9,
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  final === 0 ? "ثبت اطلاعات" : "ثبت نهایی"
                )}
              </Button>
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
      </CardContent>
    </Card>
  );
};

export default EditInfoUser;