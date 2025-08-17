import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  School as SchoolIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  Notifications as NotificationsIcon,
  Assessment as ReportIcon,
  EmojiEvents as TrophyIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import OverView from "./OverView";
import { GetButtonColor } from "../../helper/buttonColor";
import Loader from "../../helper/Loader";

const Consultant = ({ userInfo }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: "POST",
        url: "https://student.baazmoon.com/bbc_api/select_request",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          table: "users",
          method_type: "select_dashboard_info",
          data: {
            user_id: userInfo?.data.user_id,
            token: JSON.parse(localStorage.getItem("token")),
          },
        },
      });

      if (response?.data?.status === 200) {
        setData(response?.data?.response?.data);
      } else if (response?.data?.status === 404) {
        toast.error("نشست شما به پایان رسیده لطفا دوباره وارد شوید.");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user-info");
          localStorage.removeItem("user-role");
          window.location.reload();
        }, 5000);
      } else {
        toast.error(response?.data?.error);
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات کاربر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const reportData = {
    activeStudents: 42,
    completedTests: 128,
    inProgressTests: 36,
    upcomingTests: 5,
    notifications: [
      { id: 1, message: "3 آزمون جدید اضافه شد", time: "2 ساعت پیش", read: false },
      { id: 1, message: "3 آزمون جدید اضافه شد", time: "2 ساعت پیش", read: false },
      { id: 1, message: "3 آزمون جدید اضافه شد", time: "2 ساعت پیش", read: false },
      { id: 2, message: "ظرفیت آزاد شما در حال اتمام است", time: "1 روز پیش", read: true },
    ]
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <SchoolIcon fontSize="large" color="primary" />
          داشبورد مشاور
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          خلاصه وضعیت ظرفیت‌ها و فعالیت‌های آموزشی
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6"
            sx={{
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 600,
              color: theme.palette.primary.dark
            }}>
            <PeopleIcon color="primary" />
            وضعیت ظرفیت‌ها
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <OverView
                type="student"
                count={data ? data.HU + data.HA : "-"}
                title="کل خرید هوشمند"
                sex={userInfo?.data?.sex}
                icon="🌐"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <OverView
                type="student"
                count={data ? data.HA : "-"}
                title="باقی مانده هوشمند"
                sex={userInfo?.data?.sex}
                icon="📊"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <OverView
                type="student"
                count={data ? data.FRU + data.FRA : "-"}
                title="کل خرید آزاد"
                sex={userInfo?.data?.sex}
                icon="🎓"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <OverView
                type="student"
                count={data ? data.FRA : "-"}
                title="باقی مانده آزاد"
                sex={userInfo?.data?.sex}
                icon="⏳"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <OverView
                type="student"
                count={data ? data.AGU + data.AGA : "-"}
                title="کل خرید استعداد"
                sex={userInfo?.data?.sex}
                icon="🧠"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <OverView
                type="student"
                count={data ? data.AGA : "-"}
                title="باقی مانده استعداد"
                sex={userInfo?.data?.sex}
                icon="🏆"
              />
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Paper elevation={2} sx={{
              p: 3,
              borderRadius: 3,
              height: '100%',
              background: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(245,245,245,0.9))',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 600,
                  color: theme.palette.primary.dark
                }}
              >
                <ReportIcon color="primary" />
                گزارش فعالیت‌ها
              </Typography>

              <Grid container spacing={2}>
                {/* User Roles Count */}
                <Grid item xs={12} sm={8} md={4}>
                  <Box sx={{
                    p: 3,
                    backgroundColor: 'rgba(66, 165, 245, 0.1)',
                    borderRadius: 2,
                    borderLeft: `4px solid ${theme.palette.info.main}`,
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.dark }}>
                        {data?.con_count + data?.stu_count || 0}
                      </Typography>
                      <PeopleIcon sx={{
                        fontSize: 40,
                        color: theme.palette.info.main,
                        opacity: 0.2
                      }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>
                      کاربران سیستم
                    </Typography>
                    <Box sx={{ mt: 2, borderTop: `1px dashed ${theme.palette.divider}`, pt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2">مشاوران:</Typography>
                        <Typography variant="body2" fontWeight={600}>{data?.con_count || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2">دانش‌آموزان:</Typography>
                        <Typography variant="body2" fontWeight={600}>{data?.stu_count || 0}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                {/* Finalized Field Selections */}
                {/* <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{
                    p: 3,
                    backgroundColor: 'rgba(102, 187, 106, 0.1)',
                    borderRadius: 2,
                    borderLeft: `4px solid ${theme.palette.success.main}`,
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.dark }}>
                        {data?.hcon_finalized + data?.con_finalized || 0}
                      </Typography>
                      <CheckCircleIcon sx={{
                        fontSize: 40,
                        color: theme.palette.success.main,
                        opacity: 0.2
                      }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>
                      رشته‌های نهایی
                    </Typography>
                    <Box sx={{ mt: 2, borderTop: `1px dashed ${theme.palette.divider}`, pt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2">توسط مشاور:</Typography>
                        <Typography variant="body2" fontWeight={600}>{data?.con_finalized || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2">درصد تکمیل:</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {Math.round(((data?.con_finalized) / data?.stu_count) * 100) || 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid> */}

                {/* Talent Info - Completed */}
                <Grid item xs={12} sm={8} md={4}>
                  <Box sx={{
                    p: 3,
                    backgroundColor: 'rgba(255, 183, 77, 0.1)',
                    borderRadius: 2,
                    borderLeft: `4px solid ${theme.palette.warning.main}`,
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.dark }}>
                        {data?.finish_quiz || 0}
                      </Typography>
                      <TrophyIcon sx={{
                        fontSize: 40,
                        color: theme.palette.warning.main,
                        opacity: 0.2
                      }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>
                      آزمون‌های تکمیل شده
                    </Typography>
                    <Box sx={{ mt: 2, borderTop: `1px dashed ${theme.palette.divider}`, pt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2">در حال انجام:</Typography>
                        <Typography variant="body2" fontWeight={600}>{data?.started_quiz || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2">کل قابل انجام:</Typography>
                        <Typography variant="body2" fontWeight={600}>{data?.all_can_quiz || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2">پیشرفت:</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {Math.round((data?.finish_quiz / data?.all_can_quiz) * 100) || 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                {/* Talent Info - Progress */}
                <Grid item xs={12} sm={8} md={4}>
                  <Box sx={{
                    p: 3,
                    backgroundColor: 'rgba(171, 71, 188, 0.1)',
                    borderRadius: 2,
                    borderLeft: `4px solid ${theme.palette.secondary.main}`,
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.secondary.dark }}>
                        {data?.started_quiz || 0}
                      </Typography>
                      <HourglassIcon sx={{
                        fontSize: 40,
                        color: theme.palette.secondary.main,
                        opacity: 0.2
                      }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>
                      آزمون‌های در حال انجام
                    </Typography>
                    <Box sx={{ mt: 2, borderTop: `1px dashed ${theme.palette.divider}`, pt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2">تکمیل شده:</Typography>
                        <Typography variant="body2" fontWeight={600}>{data?.finish_quiz || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2">باقی مانده:</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {data?.all_can_quiz - data?.finish_quiz || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2">میانگین پیشرفت:</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {Math.round((data?.started_quiz / data?.all_can_quiz) * 100) || 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={12}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon color="primary" />
                اطلاعیه‌ها
              </Typography>

              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {reportData.notifications.length > 0 ? (
                  reportData.notifications.map((notification) => (
                    <Box
                      key={notification.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: notification.read ? 'action.hover' : 'primary.light',
                        borderRadius: 2,
                        borderLeft: `4px solid ${notification.read ? theme.palette.grey[400] : theme.palette.primary.main}`
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {notification.time}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      هیچ اطلاعیه جدیدی وجود ندارد
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      <ToastContainer
        position="bottom-center"
        rtl={true}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
};

export default Consultant;