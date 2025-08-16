import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  School,
  Assignment,
  TrendingUp,
  Info,
  ExpandMore,
  CheckCircle,
  Payment,
  Person,
  Book,
  Star,
  Help,
  Videocam,
  PlayCircle,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import ReactPlayer from "react-player";
import Loader from "../../helper/Loader";
import {
  GetBackGroundColor,
  GetButtonColor,
  GetLightColor,
} from "../../helper/buttonColor";

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

const FeatureCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  borderRadius: 12,
  borderLeft: `4px solid ${color}`,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const PulseButton = styled(Button)({
  animation: `${pulse} 2s infinite`,
  "&:hover": {
    animation: "none",
  },
});

const VideoCard = styled(Paper)(({ theme }) => ({
  position: "relative",
  borderRadius: 12,
  overflow: "hidden",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
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
  const [activeTab, setActiveTab] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Sample data - replace with actual API calls
  const [konkurInfo, setKonkurInfo] = useState({
    rankEstimate: "1500",
    lastYearCutoff: "1200",
    targetFields: ["مهندسی کامپیوتر", "مهندسی برق"],
    notes: "تمرکز روی سوالات ریاضی و فیزیک را افزایش دهید",
  });

  const popularMajors = [
    {
      name: "مهندسی کامپیوتر",
      description: "شامل گرایش‌های نرم‌افزار، هوش مصنوعی و شبکه‌های کامپیوتری",
      jobMarket: "عالی",
    },
    {
      name: "پزشکی",
      description: "پزشکی عمومی و تخصص‌های مختلف پزشکی",
      jobMarket: "بسیار عالی",
    },
    {
      name: "مهندسی برق",
      description: "الکترونیک، قدرت، کنترل و مخابرات",
      jobMarket: "خوب",
    },
    {
      name: "حقوق",
      description: "حقوق خصوصی، حقوق عمومی و حقوق بین‌الملل",
      jobMarket: "متوسط",
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const response = await axios.get("/api/user/dashboard");
        setUserData(response.data);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "خطا در دریافت اطلاعات کاربری",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    // fetchUserData();
  }, []);

  const handleCompleteInfo = () => navigate("/changeReportInfo");
  const handlePayment = () => navigate("/payments");
  const handleFieldSelection = () => navigate("/field-selection");
  const handleRankEstimation = () => navigate("/rank-estimation");
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleVideoPlay = (videoId) => {
    setPlayingVideo(playingVideo === videoId ? null : videoId);
  };
  if (loading) {
    return <Loader color={baseColor} />;
  }
  const tutorialVideos = [
    {
      id: 1,
      title: "آموزش ثبت نام و ورود به سیستم",
      url: "https://www.aparat.com/v/mvh94",
      duration: "4:32",
      thumbnail: "https://via.placeholder.com/300x170?text=Video+Thumbnail+1",
    },
    {
      id: 2,
      title: "آموزش انتخاب رشته",
      url: "https://www.aparat.com/v/kL9xP",
      duration: "6:15",
      thumbnail: "https://via.placeholder.com/300x170?text=Video+Thumbnail+2",
    },
    {
      id: 3,
      title: "نحوه تخمین رتبه کنکور",
      url: "https://www.aparat.com/v/zX5qW",
      duration: "5:48",
      thumbnail: "https://via.placeholder.com/300x170?text=Video+Thumbnail+3",
    },
    {
      id: 4,
      title: "مدیریت پروفایل کاربری",
      url: "https://www.aparat.com/v/rT2sN",
      duration: "3:56",
      thumbnail: "https://via.placeholder.com/300x170?text=Video+Thumbnail+4",
    },
  ];
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

      {/* Quick Stats Section */}
      <AnimatedSection delay="0.2s" sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard color={baseColor}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TrendingUp fontSize="large" color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    رتبه تخمینی
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {konkurInfo.rankEstimate}
                  </Typography>
                </Box>
              </Box>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard color={baseColor}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <School fontSize="large" color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    رشته‌های هدف
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {konkurInfo.targetFields.length}
                  </Typography>
                </Box>
              </Box>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard color={baseColor}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Assignment fontSize="large" color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    آخرین آزمون
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    85%
                  </Typography>
                </Box>
              </Box>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard color={baseColor}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Star fontSize="large" color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    وضعیت حساب
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {userData?.isActive ? "فعال" : "غیرفعال"}
                  </Typography>
                </Box>
              </Box>
            </FeatureCard>
          </Grid>
        </Grid>
      </AnimatedSection>

      {/* Konkur Info Section */}
      <AnimatedSection delay="0.3s" sx={{ mb: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 3 }}
          >
            اطلاعات کنکور
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <TrendingUp /> رتبه تخمینی شما
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Chip
                    label={konkurInfo.rankEstimate}
                    color="primary"
                    sx={{ fontSize: "1.2rem", p: 2 }}
                  />
                  <Typography>رتبه کشوری تخمینی بر اساس آخرین آزمون</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  آخرین رتبه قبولی سال گذشته: {konkurInfo.lastYearCutoff}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Info /> یادداشت‌های مشاور
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: lightColor }}>
                  <Typography>{konkurInfo.notes}</Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </AnimatedSection>
      <AnimatedSection delay="0.2s" sx={{ mb: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
            <Videocam fontSize="large" color="primary" />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              ویدیوهای آموزشی
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            <Tab label="همه ویدیوها" icon={<PlayCircle />} />
            <Tab label="آموزش ثبت نام" icon={<Person />} />
            <Tab label="انتخاب رشته" icon={<Book />} />
            <Tab label="تخمین رتبه" icon={<TrendingUp />} />
          </Tabs>

          <Grid container spacing={3}>
            {tutorialVideos.map((video) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                <VideoCard elevation={3}>
                  <Box
                    sx={{
                      position: "relative",
                      pt: "56.25%", // 16:9 aspect ratio
                      cursor: "pointer",
                    }}
                    onClick={() => handleVideoPlay(video.id)}
                  >
                    {playingVideo === video.id ? (
                      <ReactPlayer
                        url={video.url}
                        width="100%"
                        height="100%"
                        style={{ position: "absolute", top: 0, left: 0 }}
                        controls
                        playing
                      />
                    ) : (
                      <>
                        <Box
                          component="img"
                          src={video.thumbnail}
                          alt={video.title}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(0,0,0,0.3)",
                          }}
                        >
                          <PlayCircle sx={{ fontSize: 60, color: "white" }} />
                        </Box>
                        <Chip
                          label={video.duration}
                          size="small"
                          sx={{
                            position: "absolute",
                            bottom: 10,
                            left: 10,
                            backgroundColor: "rgba(0,0,0,0.7)",
                            color: "white",
                          }}
                        />
                      </>
                    )}
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {video.title}
                    </Typography>
                  </Box>
                </VideoCard>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </AnimatedSection>
      {/* Majors Information Section */}
      <AnimatedSection delay="0.4s" sx={{ mb: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 3 }}
          >
            معرفی رشته‌های پرطرفدار
          </Typography>

          <Grid container spacing={3}>
            {popularMajors.map((major, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard color={baseColor}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 700 }}
                  >
                    {major.name}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {major.description}
                  </Typography>
                  <Chip
                    label={`بازار کار: ${major.jobMarket}`}
                    size="small"
                    color={
                      major.jobMarket === "بسیار عالی"
                        ? "success"
                        : major.jobMarket === "عالی"
                        ? "primary"
                        : major.jobMarket === "خوب"
                        ? "secondary"
                        : "default"
                    }
                  />
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </AnimatedSection>

      {/* Quick Actions Section */}
      <AnimatedSection delay="0.5s" sx={{ mb: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 3 }}
          >
            اقدامات سریع
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Person />}
                onClick={handleCompleteInfo}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  background: baseColor,
                  "&:hover": { background: baseColor, opacity: 0.9 },
                }}
              >
                تکمیل اطلاعات
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Payment />}
                onClick={handlePayment}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  background: baseColor,
                  "&:hover": { background: baseColor, opacity: 0.9 },
                }}
              >
                پرداخت و فعالسازی
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Book />}
                onClick={handleFieldSelection}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  background: baseColor,
                  "&:hover": { background: baseColor, opacity: 0.9 },
                }}
              >
                انتخاب رشته
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<TrendingUp />}
                onClick={handleRankEstimation}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  background: baseColor,
                  "&:hover": { background: baseColor, opacity: 0.9 },
                }}
              >
                تخمین رتبه
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection delay="0.6s">
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 3 }}
          >
            سوالات متداول
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>چگونه می‌توانم رتبه خود را تخمین بزنم؟</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                با استفاده از بخش "تخمین رتبه" و وارد کردن درصدهای آزمون‌های
                آزمایشی، می‌توانید رتبه احتمالی خود را تخمین بزنید.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>چگونه رشته‌های مناسب خود را انتخاب کنم؟</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                در بخش "انتخاب رشته" می‌توانید با توجه به علایق، توانایی‌ها و
                رتبه تخمینی خود، رشته‌های مناسب را انتخاب و اولویت‌بندی کنید.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>آیا می‌توانم اطلاعات خود را ویرایش کنم؟</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                بله، در بخش "تکمیل اطلاعات" می‌توانید اطلاعات شخصی و تحصیلی خود
                را ویرایش کنید.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </AnimatedSection>
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
