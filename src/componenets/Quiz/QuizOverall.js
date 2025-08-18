import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Grid,
  Snackbar,
  Typography,
  Box,
  Grow,
  useTheme
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GetButtonColor } from "../../helper/buttonColor";
import { motion } from "framer-motion";
import Loader from "../../helper/Loader";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const GetUserQuizStatus = (status) => {
  const statusMap = {
    0: "انجام نشده",
    1: "در حال اجرا",
    2: "انجام شده"
  };
  return statusMap[status] || "نامشخص";
};

const QuizOverall = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")) || {});
  const [userRole] = useState(JSON.parse(localStorage.getItem("user-role")) || "stu");
  const [tableData, setTableData] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const selectQuizTableInfo = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.post(
        "https://student.baazmoon.com/bbc_quiz_api/select_request",
        {
          table: "users",
          method_type: "select_quiz_table_info",
          data: { token }
        }
      );

      if (response.data.tracking_code !== null) {
        setTableData(response?.data?.response?.data || []);
      } else if (response?.data?.status === 404) {
        setSnackbar({
          open: true,
          message: "نشست شما به پایان رسیده  لطفا دوباره وارد شوید",
          severity: "error",
        });
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user-info");
          localStorage.removeItem("user-role");
          window.location.reload();
        }, 5000);
      } else {
        setSnackbar({
          open: true,
          message: response?.data?.error || "خطا در دریافت اطلاعات",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "در ارتباط با سامانه به مشکل برخوردیم.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const goToQuizPage = (id) => {
    navigate(`/quiz/${id}`);
    setTableData([]);
  };

  useEffect(() => {
    if (!userInfo?.data?.user_id) {
      navigate("/signin");
    } else {
      setLoading(true);
      selectQuizTableInfo();
    }
  }, [userInfo]);

  const tableColumns = useMemo(() => [
    {
      accessorKey: "ImageURL",
      header: "",
      size: 10,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      muiTableHeadCellFilterTextFieldProps: { placeholder: "" },
      Cell: ({ cell }) => {
        const { ImageURL, lock } = cell.row.original;
        return (
          <motion.div whileHover={{ scale: 1.1 }}>
            <img
              src={`https://student.baazmoon.com/bbc_quiz_api/get_pic_info/quiz/${ImageURL}`}
              alt="quiz"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                filter: lock === 1 ? "blur(2px)" : "none",
              }}
            />
          </motion.div>
        );
      },
    },
    {
      accessorKey: "quizName",
      header: "نام آزمون",
      size: 100,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      muiTableHeadCellFilterTextFieldProps: { placeholder: "نام" },
      Cell: ({ cell }) => (
        <Typography style={{ filter: cell.row.original.lock === 1 ? "blur(2px)" : "none" }}>
          {cell.getValue()}
        </Typography>
      ),
    },
    {
      accessorKey: "status",
      header: "وضعیت",
      size: 100,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ cell }) => (
        <Typography style={{ filter: cell.row.original.lock === 1 ? "blur(2px)" : "none" }}>
          {GetUserQuizStatus(cell.getValue())}
        </Typography>
      ),
    },
    {
      accessorKey: "start",
      header: "عملیات",
      size: 100,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ cell }) => {
        const { status, can_start, id, lock } = cell.row.original;
        const isDisabled = can_start === 0 || lock === 1;
        const buttonText = status === 2 ? "پایان یافته" : status === 1 ? "در حال آزمون" : "شروع آزمون";
        const buttonColor = GetButtonColor(userInfo?.data?.sex);

        return (
          <motion.div
            whileHover={{ scale: isDisabled ? 1 : 1.05 }}
            whileTap={{ scale: isDisabled ? 1 : 0.95 }}
          >
            <Button
              variant="contained"
              disabled={isDisabled}
              onClick={() => goToQuizPage(id)}
              sx={{
                borderRadius: 2,
                boxShadow: "none",
                backgroundColor: isDisabled ? "action.disabled" : buttonColor,
                "&:hover": {
                  backgroundColor: isDisabled ? "action.disabled" : `${buttonColor}CC`,
                },
                filter: isDisabled ? "blur(2px)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              {buttonText}
            </Button>
          </motion.div>
        );
      },
    },
  ], [userInfo]);

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                توضیحات کلی
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                p: 3,
                boxShadow: theme.shadows[1],
                mb: 4
              }}>
                <Typography paragraph>
                  کاربر گرامی با سلام؛ آزمون های پیش رو، با هدف ارزیابی و خودشناسی و ارائه پیشنهادهایی برای رشته، شغل و شاخه تحصیلی آینده شما است. این 7 آزمون، به سنجش وضعیت و توانایی های ذهنی و ارزیابی جنبه های مختلفی از شخصیت، هوش و استعداد شما می پردازد.
                </Typography>
                <Typography paragraph>
                  در طول آزمون اگر به هر دلیلی از سامانه خارج شوید، گزینه هایی که وارد کرده اید ذخیره خواهند شد. بعد از پایان آزمون، امکان ویرایش گزینه‌ها وجود ندارد بنابراین گزینه هایی را انتخاب کنید که بهترین توصیف از شماست.
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          {["stu"].includes(userRole) && (
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <ThemeProvider theme={createTheme({ direction: "rtl" })}>
                  <MaterialReactTable
                    columns={tableColumns}
                    data={tableData}
                    enableSorting={false}
                    enableColumnActions={false}
                    initialState={{
                      density: "compact",
                      pagination: { pageSize: 50 },
                    }}
                    enableDensityToggle={false}
                    enablePagination={false}
                    localization={MRT_Localization_FA}
                    muiTableContainerProps={{
                      sx: {
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[1]
                      }
                    }}
                    muiTablePaperProps={{
                      elevation: 0,
                      sx: {
                        boxShadow: "none",
                        background: "transparent"
                      }
                    }}
                    muiTableHeadCellProps={{
                      sx: {
                        fontWeight: "bold",
                        backgroundColor: theme.palette.grey[100]
                      }
                    }}
                  />
                </ThemeProvider>
              </motion.div>
            </Grid>
          )}
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Grow}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: "100%", boxShadow: theme.shadows[3] }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default QuizOverall;