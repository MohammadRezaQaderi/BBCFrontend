import React from "react";
import {
  Box,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GetButtonColor } from "../../../helper/buttonColor";
import { ConvertField, ConvertQuota } from "../../../helper/FieldCheck";
import ErrorState from "../../FPList/NoUser";

const ShowInfoFP = ({ userDetails, open, onClose }) => {
  const theme = useTheme();
  const accentColor = GetButtonColor(userDetails?.sex);

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

  if (!userDetails) {
    return (
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
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography component="h4"
              variant="h5"
              color={accentColor}
              fontWeight={600}>اطلاعات کاربر</Typography>
            <Box>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <Grid item xs={12}>
          <hr
            style={{
              border: `1px solid ${accentColor}`,
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
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: theme.shadows[1],
                      height: '100%',
                      transition: 'all 0.3s ease',
                      borderLeft: `4px solid ${field.important ? accentColor : theme.palette.divider}`,
                      '&:hover': {
                        boxShadow: theme.shadows[4],
                        transform: 'translateY(-2px)'
                      }
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
    </>
  );
};

export default ShowInfoFP;
