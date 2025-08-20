import React, { useEffect, useState } from "react";
import "./style.css";
import styled, { keyframes } from "styled-components";
import { MdOutlineQuiz } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import QuizKindCard from "./QuizKindCard";
import axios from "axios";
import ErrorState from "../../helper/ErrorState";
import Loader from "../../helper/Loader";
import { GetBackGroundColor, GetButtonColor } from "../../helper/buttonColor";
import {
  Alert,
  Box,
  Grid,
  Snackbar,
  Typography,
  Avatar,
  IconButton,
  Collapse,
  Divider,
  Fade,
  CircularProgress,
} from "@mui/material";
import { ConvertField, ConvertQuota } from "../../helper/FieldCheck";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  FaAward,
  FaBook,
  FaMapMarkerAlt,
  FaUser,
  FaVenusMars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  margin-top: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;


const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;


const ProgressOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(3px);
`;

const ProgressContainer = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  animation: ${pulse} 2s infinite;
`;

const ProgressBar = styled.div`
  height: 8px;
  border-radius: 4px;
  background: #f0f0f0;
  margin: 1rem 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ color }) => color};
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease-out;
  border-radius: 4px;
`;

const ProgressText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-top: 0.5rem;
`;


const CardContainer = styled.div`
  width: 100%;
  // margin-top: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;

// const ProgressFill = styled.div`
//   height: 100%;
//   background-color: ${({ color }) => (color === 2 ? "#ff6b6b" : "#4CAF50")};
//   width: ${({ progress }) => progress}%;
//   transition: width 0.3s ease;
// `;

const QuizKindShow = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const baseColor = GetButtonColor(userInfo?.data?.sex);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [lock, setLock] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [expanded, setExpanded] = useState(true);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const getStudentInfo = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_student_info_ag",
          data: {
            user_id: userInfo?.data?.user_id,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response?.data?.status === 200) {
        const lock = response?.data?.response?.data?.lock;
        const ag_access = response?.data?.response?.data?.ag_access;
        if (ag_access === 0) {
          setLock(true)
          // setSnackbar({
          //   open: true,
          //   message: "ابتدا اطلاعات خود را تکمیل نمایید.",
          //   severity: "warning",
          // });
          // setTimeout(() => {
          //   navigate("/dashboard");
          // }, 3000);
        } else {
          setData(response?.data?.response?.data);
        }
      } else if (response?.data?.status === 404) {
        setSnackbar({
          open: true,
          message: "نشست شما به پایان رسیده لطفا دوباره وارد شوید.",
          severity: "error",
        });
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user-info");
          localStorage.removeItem("user-role");
          window.location.reload();
        }, 3000);
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
        message: "خطا در دریافت اطلاعات کاربر",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (!userInfo?.data?.user_id) {
      navigate("/signin");
    } else {
      setLoading(true);
      getStudentInfo().finally(() => setLoading(false));
    }
  }, [userInfo]);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const response = await fetch(
        `https://student.baazmoon.com/bbc_quiz_api/get_report_student/${userInfo?.data?.phone}`
      );

      if (!response.ok) {
        handleDownloadError(response.status);
        setIsDownloading(false);
        return;
      }

      const contentLength = +response.headers.get("Content-Length");
      const reader = response.body.getReader();
      let receivedLength = 0;
      let chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;
        const progress = Math.floor((receivedLength / contentLength) * 100);
        setDownloadProgress(progress);
      }

      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "استعدادسنجی.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up
      window.URL.revokeObjectURL(url);
      setIsDownloading(false);
      setDownloadProgress(0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "مشکلی در سامانه پیش‌آمده لحظاتی دیگر مراجعه نمایید",
        severity: "error",
      });
      setIsDownloading(false);
    }
  };

  const handleDownloadError = (status) => {
    switch (status) {
      case 321:
        setSnackbar({
          open: true,
          message: "در حال حاضر آزمون‌های شما به پایان نرسیده است.",
          severity: "error",
        });
        break;
      case 322:
        setSnackbar({
          open: true,
          message: "کارنامه‌ها درحال آماده سازی می‌باشد.",
          severity: "error",
        });
        break;
      case 323:
        setSnackbar({
          open: true,
          message:
            "شما به کارنامه‌ی خود دسترسی ندارید موضوع را از مشاور خود پیگیری نمایید.",
          severity: "error",
        });
        break;
      case 404:
        setSnackbar({
          open: true,
          message: "فایل مورد نظر شما یافت نشد.",
          severity: "error",
        });
        break;
      default:
        setSnackbar({
          open: true,
          message: "مشکلی در سامانه پیش‌آمده لحظاتی دیگر مراجعه نمایید",
          severity: "error",
        });
        break;
    }
  };

  const InfoItem = ({ icon, label, value, color }) => (
    <Grid item xs={6} sm={4} md={3}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1.5,
            borderRadius: "8px",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: color ? `${color}20` : "#f0f0f0",
              color: color || "#555",
              mr: 1.5,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="caption" color="textSecondary" noWrap>
              {label}
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color={color || "textPrimary"}
              noWrap
            >
              {value}
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Grid>
  );

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Loader color={GetButtonColor(userInfo?.data?.sex)} />
        </Box>
      </Container>
    );
  }
  if (lock) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <ErrorState
            action={"⚠️"}
            title={"شما هنوز بسته رو دریافت نکرده‌‌اید"}
            description={"برای اینکه بتونی استعدادسنجی کنی باید اول بسته ال‌پروفسور رو تهیه کنی"}
            needHeight={false}
            path={"/payments"}
            path_name="پرداخت"
          />
        </Box>
      </Container>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <ErrorState
            action={"⚠️"}
            title={"اطلاعات شما به درستی دریافت نشد"}
            description={""}
            needHeight={false}
          />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: "100%", maxWidth: "800px" }}
          >
            <Box
              sx={{
                position: "relative",
                border: `1px solid ${GetBackGroundColor(userInfo?.data?.sex)}`,
                borderRadius: "12px",
                backgroundColor: "#f8f9fa",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  cursor: "pointer",
                  backgroundColor: expanded
                    ? "rgba(0,0,0,0.02)"
                    : "transparent",
                }}
                onClick={toggleExpand}
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    // backgroundColor: `${GetBackGroundColor(userInfo?.data?.sex)}20`,
                    color: GetBackGroundColor(userInfo?.data?.sex),
                    fontSize: "1rem",
                    fontWeight: "bold",
                    mr: 2,
                  }}
                >
                  {data?.first_name?.charAt(0)}.{data?.last_name?.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {`${data?.first_name} ${data?.last_name}`}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {`${ConvertField(data?.field)} • رتبه ${data?.rank}`}
                  </Typography>
                </Box>
                <IconButton size="small">
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              <Collapse in={expanded}>
                <Divider />
                <Grid container spacing={1} sx={{ p: 1.5 }}>
                  <InfoItem
                    icon={<FaVenusMars size={14} />}
                    label="جنسیت"
                    value={userInfo?.data?.sex === 1 ? "مرد" : "زن"}
                    color={GetButtonColor(userInfo?.data?.sex)}
                  />
                  <InfoItem
                    icon={<FaBook size={14} />}
                    label="رشته"
                    value={ConvertField(data?.field)}
                  />
                  <InfoItem
                    icon={<FaAward size={14} />}
                    label="سهمیه"
                    value={ConvertQuota(data?.quota)}
                  />
                  <InfoItem
                    icon={<FaAward size={14} />}
                    label="رتبه"
                    value={data?.rank}
                  />
                  <InfoItem
                    icon={<FaMapMarkerAlt size={14} />}
                    label="استان"
                    value={data?.city?.split(",")[0]}
                  />
                  <InfoItem
                    icon={<FaUser size={14} />}
                    label="سن"
                    value={1404 - parseInt(data?.birth_date) + " سال"}
                  />
                </Grid>
              </Collapse>
            </Box>
          </motion.div>
        </Box>
        <CardContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <QuizKindCard
              icon={<MdOutlineQuiz size={30} />}
              title={"آزمون‌ها"}
              isFemale={userInfo?.data?.sex === 2}
              onClick={() => navigate("/quiz")}
              noPath={false}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <QuizKindCard
              icon={<TbReportSearch size={30} />}
              title={"کارنامه استعدادسنجی"}
              isFemale={userInfo?.data?.sex === 2}
              path={""}
              noPath={true}
              onClick={handleDownload}
              disabled={isDownloading}
            />
          </motion.div>
        </CardContainer>

        <Fade in={isDownloading} timeout={300}>
          <ProgressOverlay>
            <ProgressContainer>
              <CircularProgress
                size={60}
                thickness={4}
                style={{ color: baseColor }}
              />
              <ProgressText>در حال آماده‌سازی فایل PDF</ProgressText>
              <ProgressBar>
                <ProgressFill progress={pdfProgress} color={baseColor} />
              </ProgressBar>
              <ProgressText>{Math.min(100, Math.round(pdfProgress))}%</ProgressText>
            </ProgressContainer>
          </ProgressOverlay>
        </Fade>
      </Container>
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

export default QuizKindShow;
