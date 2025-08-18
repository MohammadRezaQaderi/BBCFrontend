import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GetButtonColor } from "../../../helper/buttonColor";
import { ConvertField, ConvertQuota } from "../../../helper/FieldCheck";
import EditInfoModal from "../../Modals/EditInfoModal";
import EditStuAccess from "./EditStuAccess";
import ErrorState from "../../FPList/NoUser";

const CheckCanHaveAccessEdit = (kind, userDetails, userInfo) => {
  if (!["ins"].includes(userInfo.data?.role)) {
    return false;
  }
  if (kind == "hoshmand") {
    if (userDetails?.hoshmand == 1) {
      return false;
    }
    return true;
  }
  if (kind == "FR") {
    if (userDetails?.FR == 1) {
      return false;
    }
    return true;
  }
  if (kind == "AG") {
    if (userDetails?.AG == 1) {
      return false;
    }
    return true;
  }
};

const EditInfoAccess = ({
  userDetails,
  open,
  onClose,
  finalized,
  setReload,
  userInfo,
  kind,
  handleCloseFinalize,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const formatValue = (value) => {
    if (value === null || value === undefined) return "---";
    if (typeof value === "number") return value.toLocaleString("fa-IR");
    return value;
  };

  const userFields = [
    {
      label: "نام و نام خانوادگی",
      value: userDetails?.name,
      important: true,
    },
    {
      label: "سال تولد",
      value: userDetails?.birth_date,
    },
    {
      label: "استان بومی",
      value: userDetails?.city?.split(",")[1],
      important: true,
    },
    {
      label: "گروه آموزشی",
      value: ConvertField(userDetails?.field),
    },
    {
      label: "سهمیه",
      value: ConvertQuota(userDetails?.quota),
      important: true,
    },
    {
      label: "نمره کل",
      value: userDetails?.full_number,
    },
    {
      label: "رتبه در سهمیه",
      value: userDetails?.rank,
      important: true,
    },
    {
      label: "رتبه کشوری",
      value: userDetails?.rank_all,
    },
    {
      label: "آخرین رتبه مجاز",
      value: userDetails?.last_rank,
      important: true,
    },
  ];

  const additionalFields = [];
  if (
    userDetails?.rank_zaban ||
    userDetails?.full_number_zaban ||
    userDetails?.rank_all_zaban
  ) {
    additionalFields.push(
      { label: "رتبه زبان", value: userDetails?.rank_zaban },
      {
        label: "رتبه کشوری زبان",
        value: userDetails?.rank_all_zaban,
        important: true,
      },
      { label: "نمره زبان", value: userDetails?.full_number_zaban }
    );
  }
  if (
    userDetails?.rank_honar ||
    userDetails?.full_number_honar ||
    userDetails?.rank_all_honar
  ) {
    additionalFields.push(
      { label: "رتبه هنر", value: userDetails?.rank_honar },
      {
        label: "رتبه کشوری هنر",
        value: userDetails?.rank_all_honar,
        important: true,
      },
      { label: "نمره هنر", value: userDetails?.full_number_honar }
    );
  }

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleAccessClick = () => {
    setAccessModalOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      onClose();
    }
  };

  if (!userDetails) {
    return (
      // <Dialog
      //   open={open}
      //   onClose={handleClose}
      //   disableEscapeKeyDown
      //   maxWidth="md"
      //   fullWidth
      // >
      //   <DialogTitle>اطلاعات کاربر</DialogTitle>
      //   <DialogContent>
      //     <Box sx={{ p: 3, textAlign: "center" }}>
      //       <Typography variant="h6">اطلاعات کاربری یافت نشد</Typography>
      //     </Box>
      //   </DialogContent>
      // </Dialog>
      <Box sx={{ p: 3, mx: "auto" }}>
        <ErrorState
          action={"⚠️"}
          title={"دانش‌آموز عزیز اطلاعات شما یافت نشد"}
          description={
            "این موضوع رو با مشاور و موسسه خودتان در میان بگذارید تا پیگیری انجام دهند."
          }
        />
      </Box>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography component="h4"
              variant="h5"
              color={GetButtonColor(userInfo?.data?.sex)}
              fontWeight={600}
            >
              اطلاعات کاربر
            </Typography>
            <Box>
              {finalized != 2 && ["hoshmand", "FR"].includes(kind) && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    boxShadow: "none",
                    borderRadius: "5px",
                    padding: "12px 10px",
                    marginRight: "10px",
                    mr: 2,
                  }}
                  style={{
                    color: "white",
                    background: GetButtonColor(userInfo?.data?.sex),
                  }}
                  onClick={handleEditClick}
                >
                  ثبت نهایی اطلاعات کارنامه
                </Button>
              )}
              {CheckCanHaveAccessEdit(kind, userDetails, userInfo) && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    boxShadow: "none",
                    borderRadius: "5px",
                    padding: "12px 10px",
                    marginRight: "10px",
                    mr: 2,
                  }}
                  style={{
                    color: "white",
                    background: GetButtonColor(userInfo?.data?.sex),
                  }}
                  onClick={handleAccessClick}
                >
                  افزودن خدمت
                </Button>
              )}
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <Grid item xs={12}>
          <hr
            style={{
              border: `1px solid ${GetButtonColor(userInfo?.data?.sex)}`,
            }}
          />
        </Grid>
        <DialogContent>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {[...userFields, ...additionalFields].map((field, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      boxShadow: 1,
                      height: "100%",
                      borderLeft: (theme) =>
                        `4px solid ${field.important
                          ? GetButtonColor(userInfo?.data?.sex)
                          : theme.palette.divider
                        }`,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      color={"textSecondary"}
                      gutterBottom
                      sx={{ fontWeight: field.important ? 600 : 500 }}
                    >
                      {field.label}
                    </Typography>
                    <Typography
                      variant={"body1"}
                      sx={{ fontWeight: field.important ? 700 : 400 }}
                    >
                      {formatValue(field.value)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      {editModalOpen && (
        <EditInfoModal
          openMo={editModalOpen}
          setOpenMo={setEditModalOpen}
          userData={userDetails}
          setReload={setReload}
          setUserData={() => { }}
          stu_id={userDetails?.user_id}
          kind={kind}
          onClose={onClose}
          handleCloseFinalize={handleCloseFinalize}
        />
      )}
      {accessModalOpen && (
        <EditStuAccess
          open={accessModalOpen}
          setOpen={setAccessModalOpen}
          stu_id={userDetails?.user_id}
          userInfo={userInfo}
          kind={kind}
          setReload={setReload}
          sex={userDetails?.sex}
          onClose={onClose}
        />
      )}
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
    </>
  );
};

export default EditInfoAccess;
