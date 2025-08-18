import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import Loader from "../../helper/Loader";
import {
  GetButtonColor,
  GetLightColor,
} from "../../helper/buttonColor";
import ShowInfoUser from "./ShowInofUser";

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

// Styled components
const AnimatedSection = styled(Box)(({ delay }) => ({
  animation: `${fadeIn} 0.8s ease-out ${delay || "0s"} forwards`,
  opacity: 0,
}));

const Student = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const baseColor = GetButtonColor(userInfo?.data?.sex);
  const lightColor = GetLightColor(userInfo?.data?.sex);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getStudentInfo = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_student_info",
          data: {
            user_id: userInfo?.data?.user_id,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response?.data?.status === 200) {
        setUserData(response?.data?.response?.data);
      } else if (response?.data?.status === 404) {
        setSnackbar({
          open: true,
          message: "نشست شما به پایان رسیده  لطفا دوباره وارد شوید.",
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
    setLoading(true);
    getStudentInfo().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader color={baseColor} />;
  }
  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
      {/* Welcome Section */}
      <AnimatedSection delay="0.1s" sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: 4,
            p: 3,
            backgroundColor: lightColor,
            borderRadius: 3,
            borderLeft: `4px solid ${baseColor}`,
          }}
        >
          <Avatar
            sx={{
              width: isMobile ? 80 : 120,
              height: isMobile ? 80 : 120,
              bgcolor: baseColor,
              fontSize: isMobile ? "2rem" : "3rem",
            }}
          >
            {userInfo?.data?.first_name?.[0] || "U"}
          </Avatar>

          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              سلام {userInfo?.data?.first_name || "کاربر"} عزیز!
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: isMobile ? "1rem" : "1.1rem" }}
            >
              به پنل مدیریت کنکور خود خوش آمدید. از اینجا می‌توانید تمام اطلاعات
              مورد نیاز را مشاهده و مدیریت کنید.
            </Typography>
          </Box>
        </Box>
      </AnimatedSection>
      <ShowInfoUser userDetails={userData} userInfo={userInfo} />
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
    </Container>
  );
};

export default Student;
