import {
  Button,
  Dialog,
  DialogTitle,
  Grid,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { GetButtonColor } from "../../../helper/buttonColor";

const EditStuAccess = ({
  open,
  setOpen,
  stu_id,
  userInfo,
  kind,
  setReload,
  sex,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [hasNoAccess, setHasNoAccess] = useState(false);
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
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setHasNoAccess(false);
  };

  const update_student_access = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/update_request",
        {
          table: "users",
          method_type: "update_student_access",
          data: {
            stu_id: stu_id,
            kind: kind,
            limitation: hasNoAccess ? 0 : 1,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setSnackbar({
          open: true,
          message: response?.data?.response?.message,
          severity: "success",
        });
        setReload((perv) => !perv);
        setOpen(false);
        setHasNoAccess(false);
        onClose();
      } else {
        setSnackbar({
          open: true,
          message: response?.data?.error,
          severity: "error",
        });
        setReload((perv) => !perv);
        setOpen(false);
        setHasNoAccess(false);
        onClose();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت اطلاعات",
        severity: "error",
      });
    }
  };

  const submit = () => {
    setLoading(true);
    update_student_access().then(() => {
      setLoading(false);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      disableEscapeKeyDown
      maxWidth="sm"
    >
      <div style={{ padding: "20px" }}>
        <DialogTitle sx={{ textAlign: "center" }}>
          {"افزودن خدمت"}{" "}
          {kind === "hoshmand"
            ? "انتخاب رشته هوشمند"
            : kind === "FR"
              ? "انتخاب رشته آزاد"
              : "استعداد سنجی "}
          {" به دانش‌آموز"}
        </DialogTitle>
        <Grid item xs={12}>
          <hr
            style={{
              border: `1px solid ${GetButtonColor(userInfo?.data?.sex)}`,
            }}
          />
        </Grid>
        <p style={{ marginBottom: "30px" }}>
          از دادن این خدمت به دانش‌آموز اطمینان دارید؟
        </p>
        {(kind === "hoshmand" || kind === "FR") && (
          <FormControlLabel
            control={
              <Checkbox
                checked={hasNoAccess}
                onChange={(e) => setHasNoAccess(e.target.checked)}
                color="primary"
              />
            }
            label="دانش آموز در پنل خود امکان مشاهده این خدمت را نداشته باشد"
            style={{ marginBottom: "20px" }}
          />
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
                color: "white",
              }}
              sx={{
                boxShadow: "none",
                borderRadius: "5px",
                padding: "12px 0",
                marginRight: "10px",
              }}
              fullWidth
              disabled={loading}
              onClick={() => submit()}
            >
              بله
            </Button>
            <Button
              variant="outlined"
              color="error"
              style={{
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
      </div>
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

export default EditStuAccess;
