import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { ConvertField, ConvertQuota } from "../../helper/FieldCheck";
import { GetButtonColor } from "../../helper/buttonColor";
import ErrorState from "../../helper/ErrorState";

const ShowInfoUser = ({ userDetails, userInfo }) => {
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
      value: `${userInfo?.data?.first_name || ""} ${userInfo?.data?.last_name || ""}`.trim(),
      highlight: true,
    },
    {
      label: "سال تولد",
      value: userDetails?.birth_date,
    },
    {
      label: "استان بومی",
      value: userDetails?.city?.split(",")[1],
      highlight: true,
    },
    {
      label: "گروه آموزشی",
      value: ConvertField(userDetails?.field),
    },
    {
      label: "سهمیه",
      value: ConvertQuota(userDetails?.quota),
      highlight: true,
    },
    {
      label: "نمره کل",
      value: userDetails?.full_number,
    },
    {
      label: "رتبه در سهمیه",
      value: userDetails?.rank,
      highlight: true,
    },
    {
      label: "رتبه کشوری",
      value: userDetails?.rank_all,
    },
    {
      label: "آخرین رتبه مجاز",
      value: userDetails?.last_rank,
      highlight: true,
    },
  ];

  const additionalFields = [
    ...(userDetails?.rank_zaban || userDetails?.full_number_zaban || userDetails?.rank_all_zaban
      ? [
        { label: "رتبه زبان", value: userDetails?.rank_zaban },
        {
          label: "رتبه کشوری زبان",
          value: userDetails?.rank_all_zaban,
          highlight: true
        },
        { label: "نمره زبان", value: userDetails?.full_number_zaban },
      ]
      : []),
    ...(userDetails?.rank_honar || userDetails?.full_number_honar || userDetails?.rank_all_honar
      ? [
        { label: "رتبه هنر", value: userDetails?.rank_honar },
        {
          label: "رتبه کشوری هنر",
          value: userDetails?.rank_all_honar,
          highlight: true
        },
        { label: "نمره هنر", value: userDetails?.full_number_honar },
      ]
      : []),
  ];

  if (!userDetails) {
    return (
      <Box sx={{ p: 3, mx: "auto" }}>
        <ErrorState
          action={"⚠️"}
          title={"دانش‌آموز عزیز اطلاعات شما یافت نشد"}
          description={
            "این موضوع رو با پشتیبانی در میان بگذارید تا پیگیری انجام دهند."
          }
        />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: { xs: 2, md: 4 },
      maxWidth: 1400,
      mx: 'auto',
      bgcolor: 'background.default',
      borderRadius: 2
    }}>
      {/* Header Section */}
      <Box sx={{
        mb: 4,
        textAlign: 'center',
        position: 'relative'
      }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 4,
              backgroundColor: accentColor,
              borderRadius: 2
            }
          }}
        >
          اطلاعات من
        </Typography>
      </Box>

      {/* Info Cards Grid */}
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
                borderLeft: `4px solid ${field.highlight ? accentColor : theme.palette.divider}`,
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
                sx={{
                  fontWeight: field.highlight ? 600 : 500,
                  fontSize: '0.875rem'
                }}
              >
                {field.label}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: field.highlight ? 700 : 500,
                  color: field.highlight ? 'text.primary' : 'text.secondary'
                }}
              >
                {formatValue(field.value)}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ShowInfoUser;