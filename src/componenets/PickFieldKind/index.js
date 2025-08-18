import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Typography,
  Box,
  Snackbar,
  Alert,
  Avatar,
  Divider,
  IconButton,
  Collapse,
} from "@mui/material";
import PickFieldCard from "./Card";
import Loader from "../../helper/Loader";
import { ConvertField, ConvertQuota } from "../../helper/FieldCheck";
import SelectionModal from "./SelectionModal";
import {
  FaUniversity,
  FaBuilding,
  FaUser,
  FaVenusMars,
  FaBook,
  FaAward,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Container, PickContainer } from "./styles";
import { GetBackGroundColor, GetButtonColor } from "../../helper/buttonColor";
import ErrorState from "../../helper/ErrorState";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const PickFieldKind = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(
    JSON.parse(localStorage.getItem("user-info")) || {}
  );
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
          method_type: "select_student_info",
          data: {
            user_id: userInfo?.data?.user_id,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response?.data?.status === 200) {
        const finalized = response?.data?.response?.data?.finalized;
        if (finalized != 2) {
          setSnackbar({
            open: true,
            message: "ابتدا اطلاعات خود را تکمیل نمایید.",
            severity: "warning",
          });
          navigate("/dashboard");
        } else {
          setData(response?.data?.response?.data);
        }
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
    if (!userInfo?.data?.user_id) {
      navigate("/signin");
    } else {
      setLoading(true);
      getStudentInfo().finally(() => setLoading(false));
    }
  }, [userInfo]);

  const hasAccess = () => {
    return (
      data?.gl_access === 1 ||
      data?.fr_access === 1 ||
      data?.glf_access === 1 ||
      data?.sp_access === 1
    );
  };

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  if (Object.keys(data).length === 0) {
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
                  {data?.first_name?.charAt(0)}
                  {data?.last_name?.charAt(0)}
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
                    value={data?.city?.split(",")[1]}
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

        {/* Rest of your component remains the same */}
        {!hasAccess() ? (
          <ErrorState
            action={"⚠️"}
            title={"دسترسی محدود"}
            description={
              "برای انجام خرید روی دکمه خرید محصول بزنید تا تمامی محصولات موجود در یه‌جوردیگه رو مشاهده کنید و انتخاب خود را برای خرید انجام دهید."
            }
            path={"/payments"}
            path_name="محصولات"
            needHeight={false}
          />
        ) : (
          <>
            <PickContainer>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <PickFieldCard
                  title="هوشمند"
                  onClick={() => navigate("/hoshmand/" + userInfo?.data?.user_id)}
                  isFemale={userInfo?.data?.sex === 2}
                  icon={<FaUniversity size={24} />}
                  compact
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <PickFieldCard
                  title="آزاد"
                  onClick={() => setModalOpen(true)}
                  isFemale={userInfo?.data?.sex === 2}
                  icon={<FaBuilding size={24} />}
                  compact
                />
              </motion.div>
            </PickContainer>
          </>
        )}
      </Container>
      <SelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        userInfo={userInfo}
        userField={data?.field}
      />
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

export default PickFieldKind;
