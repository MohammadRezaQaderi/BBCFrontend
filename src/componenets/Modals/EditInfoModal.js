import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import provinces from "../../Data/provinces.json";
import fields from "../../Data/fields.json";
import quotas from "../../Data/quotas.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [loading, setLoading] = useState(false);
  const [showZaban, setShowZaban] = useState(false);
  const [showHonar, setShowHonar] = useState(false);
  const formik = useFormik({
    initialValues: {
      sex: userData?.sex,
      birth_date: userData?.birth_date,
      province: userData?.city,
      field: userData?.field,
      quota: userData?.quota,
      full_number: userData?.full_number,
      rank: userData?.rank,
      rank_all: userData?.rank_all,
      last_rank: userData?.last_rank,
      rank_zaban: userData?.rank_zaban,
      full_number_zaban: userData?.full_number_zaban,
      rank_all_zaban: userData?.rank_all_zaban,
      rank_honar: userData?.rank_honar,
      full_number_honar: userData?.full_number_honar,
      rank_all_honar: userData?.rank_all_honar,
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
            if (strLen < 4 || strLen > 4 || isNaN(strVal) || strVal === 0)
              return false;
            else return true;
          }
        )
        .required(""),
      full_number: Yup.number()
        .min(2000, "تراز وارد شده صحیح نمی‌باشد.")
        .required("تراز الزامی است"),
      rank_all: Yup.number()
        .test(
          "check-rank-all",
          "رتبه کشوری شما کمتر از رتبه در سهمیه است!",
          function (value) {
            const { rank } = this.parent;
            return value >= rank;
          }
        )
        .required("رتبه کشوری الزامی است"),
    }),
    onSubmit: () => {
      setLoading(true);
      update_stu_info().then(() => {
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

  const update_stu_info = async () => {
    try {
      const payload = {
        ...formik.values,
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
        token: JSON.parse(localStorage.getItem("token")),
      };

      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/update_request",
        {
          table: "users",
          method_type: "update_stu_info",
          data: payload,
        }
      );

      if (response.data.tracking_code !== null) {
        toast.success(response?.data?.response?.message);
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
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    }
  };

  const getOptionById = (options, id) => {
    return options.find((option) => option.id === id) || null;
  };

  if (!openMo) return <></>;

  return (
    <Dialog
      open={openMo}
      onClose={handleClose}
      fullWidth
      disableEscapeKeyDown
      maxWidth="lg"
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        {"ثبت اطلاعات کارنامه‌ای دانش‌آموز"}
      </DialogTitle>
      <Grid item xs={12}>
        <hr
          style={{
            border: `1px solid ${GetButtonColor(userData.sex)}`,
          }}
        />
      </Grid>
      <form onSubmit={formik.handleSubmit} style={{ padding: "20px" }}>
        <Grid container spacing={3} padding={2}>
          <Grid item md={3} xs={12}>
            <Autocomplete
              fullWidth
              options={sexOptions}
              value={getOptionById(sexOptions, formik.values.sex)}
              onChange={(event, newValue) => {
                formik.setFieldValue("sex", newValue?.id);
              }}
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField fullWidth {...params} label="جنسیت" required />
              )}
            />
          </Grid>
          <Grid item md={3} xs={12}>
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
          <Grid item md={3} xs={12}>
            <Autocomplete
              fullWidth
              options={provinces}
              value={provinces.find(
                (province) =>
                  province.id ===
                    parseInt(formik.values?.province?.split(",")[0]) ||
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
                <TextField fullWidth {...params} label="استان بومی" required />
              )}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <Autocomplete
              fullWidth
              options={fields}
              value={getOptionById(fields, formik.values.field)}
              getOptionLabel={(option) => option.name || ""}
              onChange={(event, newValue) => {
                formik.setFieldValue("field", newValue?.id);
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  {...params}
                  label="گروه آزمایشی"
                  required
                />
              )}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <Autocomplete
              fullWidth
              options={quotas}
              value={getOptionById(quotas, formik.values.quota)}
              getOptionLabel={(option) => option.name || ""}
              onChange={(event, newValue) => {
                formik.setFieldValue("quota", newValue?.id);
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  {...params}
                  label="سهمیه ثبت‌نامی"
                  required
                />
              )}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              label="نمره کل"
              value={formik.values.full_number}
              fullWidth
              placeholder="1000"
              onChange={(event) => {
                const englishDigits = event.target.value.replace(
                  /[۰-۹]/g,
                  (char) =>
                    String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 0x0030)
                );
                formik.setFieldValue(
                  "full_number",
                  englishDigits.replace(/[^0-9]/g, "")
                );
              }}
              type="text"
              required
            />
            {formik.touched.full_number && formik.errors.full_number ? (
              <div>
                <p style={{ fontSize: 10, color: "red" }}>
                  {formik.errors.full_number}
                </p>
              </div>
            ) : null}
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              label="رتبه در سهمیه"
              value={formik.values.rank}
              fullWidth
              placeholder="1300"
              onChange={(event) => {
                const englishDigits = event.target.value.replace(
                  /[۰-۹]/g,
                  (char) =>
                    String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 0x0030)
                );
                formik.setFieldValue(
                  "rank",
                  englishDigits.replace(/[^0-9]/g, "")
                );
              }}
              type="text"
              required
            />
            {formik.touched.rank && formik.errors.rank ? (
              <div>
                <p style={{ fontSize: 10, color: "red" }}>
                  {formik.errors.rank}
                </p>
              </div>
            ) : null}
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              label="رتبه کشوری"
              value={formik.values.rank_all}
              fullWidth
              placeholder="5000"
              onChange={(event) => {
                const englishDigits = event.target.value.replace(
                  /[۰-۹]/g,
                  (char) =>
                    String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 0x0030)
                );
                formik.setFieldValue(
                  "rank_all",
                  englishDigits.replace(/[^0-9]/g, "")
                );
              }}
              type="text"
              required
            />
            {formik.touched.rank_all && formik.errors.rank_all ? (
              <div>
                <p style={{ fontSize: 10, color: "red" }}>
                  {formik.errors.rank_all}
                </p>
              </div>
            ) : null}
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              label="آخرین رتبه مجاز سهمیه"
              value={formik.values.last_rank}
              fullWidth
              placeholder="69000"
              onChange={(event) => {
                const englishDigits = event.target.value.replace(
                  /[۰-۹]/g,
                  (char) =>
                    String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 0x0030)
                );
                formik.setFieldValue(
                  "last_rank",
                  englishDigits.replace(/[^0-9]/g, "")
                );
              }}
              type="text"
              required
            />
            {formik.touched.last_rank && formik.errors.last_rank ? (
              <div>
                <p style={{ fontSize: 10, color: "red" }}>
                  {formik.errors.last_rank}
                </p>
              </div>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showZaban}
                  onChange={(e) => setShowZaban(e.target.checked)}
                />
              }
              label="افزودن اطلاعات زبان"
            />
          </Grid>
          {showZaban && (
            <>
              <Grid item md={3} xs={12}>
                <TextField
                  label="رتبه منطقه زبان"
                  value={formik.values.rank_zaban}
                  fullWidth
                  placeholder="27"
                  onChange={(event) => {
                    const englishDigits = event.target.value.replace(
                      /[۰-۹]/g,
                      (char) =>
                        String.fromCharCode(
                          char.charCodeAt(0) - 0x06f0 + 0x0030
                        )
                    );
                    formik.setFieldValue(
                      "rank_zaban",
                      englishDigits.replace(/[^0-9]/g, "")
                    );
                  }}
                  type="text"
                />
                {formik.touched.rank_zaban && formik.errors.rank_zaban ? (
                  <div>
                    <p style={{ fontSize: 10, color: "red" }}>
                      {formik.errors.rank_zaban}
                    </p>
                  </div>
                ) : null}
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  label="نمره کل زبان"
                  value={formik.values.full_number_zaban}
                  fullWidth
                  placeholder="6000"
                  onChange={(event) => {
                    const englishDigits = event.target.value.replace(
                      /[۰-۹]/g,
                      (char) =>
                        String.fromCharCode(
                          char.charCodeAt(0) - 0x06f0 + 0x0030
                        )
                    );
                    formik.setFieldValue(
                      "full_number_zaban",
                      englishDigits.replace(/[^0-9]/g, "")
                    );
                  }}
                  type="text"
                />
                {formik.touched.full_number_zaban &&
                formik.errors.full_number_zaban ? (
                  <div>
                    <p style={{ fontSize: 10, color: "red" }}>
                      {formik.errors.full_number_zaban}
                    </p>
                  </div>
                ) : null}
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  label="رتبه کشوری زبان"
                  value={formik.values.rank_all_zaban}
                  fullWidth
                  placeholder="1500"
                  onChange={(event) => {
                    const englishDigits = event.target.value.replace(
                      /[۰-۹]/g,
                      (char) =>
                        String.fromCharCode(
                          char.charCodeAt(0) - 0x06f0 + 0x0030
                        )
                    );
                    formik.setFieldValue(
                      "rank_all_zaban",
                      englishDigits.replace(/[^0-9]/g, "")
                    );
                  }}
                  type="text"
                />
                {formik.touched.rank_all_zaban &&
                formik.errors.rank_all_zaban ? (
                  <div>
                    <p style={{ fontSize: 10, color: "red" }}>
                      {formik.errors.rank_all_zaban}
                    </p>
                  </div>
                ) : null}
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showHonar}
                  onChange={(e) => setShowHonar(e.target.checked)}
                />
              }
              label="افزودن اطلاعات هنر"
            />
          </Grid>
          {showHonar && (
            <>
              <Grid item md={3} xs={12}>
                <TextField
                  label="رتبه منطقه هنر"
                  value={formik.values.rank_honar}
                  fullWidth
                  placeholder="21"
                  onChange={(event) => {
                    const englishDigits = event.target.value.replace(
                      /[۰-۹]/g,
                      (char) =>
                        String.fromCharCode(
                          char.charCodeAt(0) - 0x06f0 + 0x0030
                        )
                    );
                    formik.setFieldValue(
                      "rank_honar",
                      englishDigits.replace(/[^0-9]/g, "")
                    );
                  }}
                  type="text"
                />
                {formik.touched.rank_honar && formik.errors.rank_honar ? (
                  <div>
                    <p style={{ fontSize: 10, color: "red" }}>
                      {formik.errors.rank_honar}
                    </p>
                  </div>
                ) : null}
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  label="نمره کل هنر"
                  value={formik.values.full_number_honar}
                  fullWidth
                  placeholder="8000"
                  onChange={(event) => {
                    const englishDigits = event.target.value.replace(
                      /[۰-۹]/g,
                      (char) =>
                        String.fromCharCode(
                          char.charCodeAt(0) - 0x06f0 + 0x0030
                        )
                    );
                    formik.setFieldValue(
                      "full_number_honar",
                      englishDigits.replace(/[^0-9]/g, "")
                    );
                  }}
                  type="text"
                />
                {formik.touched.full_number_honar &&
                formik.errors.full_number_honar ? (
                  <div>
                    <p style={{ fontSize: 10, color: "red" }}>
                      {formik.errors.full_number_honar}
                    </p>
                  </div>
                ) : null}
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  label="رتبه کشوری هنر"
                  value={formik.values.rank_all_honar}
                  fullWidth
                  placeholder="2500"
                  onChange={(event) => {
                    const englishDigits = event.target.value.replace(
                      /[۰-۹]/g,
                      (char) =>
                        String.fromCharCode(
                          char.charCodeAt(0) - 0x06f0 + 0x0030
                        )
                    );
                    formik.setFieldValue(
                      "rank_all_honar",
                      englishDigits.replace(/[^0-9]/g, "")
                    );
                  }}
                  type="text"
                />
                {formik.touched.rank_all_honar &&
                formik.errors.rank_all_honar ? (
                  <div>
                    <p style={{ fontSize: 10, color: "red" }}>
                      {formik.errors.rank_all_honar}
                    </p>
                  </div>
                ) : null}
              </Grid>
            </>
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
                {userData?.finalized === 0
                  ? "ثبت اولیه اطلاعات"
                  : "ثبت نهایی اطلاعات"}
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
  );
};

export default EditInfoModal;
