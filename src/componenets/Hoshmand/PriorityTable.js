import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Modal,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  keyframes,
  Dialog,
  DialogTitle,
  DialogActions,
  useTheme,
  useMediaQuery,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { GetButtonColor, GetLightColor } from "../../helper/buttonColor";
import axios from "axios";
import Loader from "../../helper/Loader";
import HelperInfo from "./HelperInfo";
import { sha256 } from 'js-sha256';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1); }
  70% { box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
`;

const PriorityTable = ({ userInfo, nextStep }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const baseColor = GetButtonColor(userInfo?.data?.sex);
  const lightColor = GetLightColor(userInfo?.data?.sex);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tableData, setTableData] = useState({
    skills: [],
    universities: [],
    priorities: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [initialHash, setInitialHash] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const generateHash = (data) => {
    return sha256(JSON.stringify(data));
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://entekhab.yejooredigeh.com/hoshmand/select_request",
          {
            table: "users",
            method_type: "get_hoshmand_tables",
            data: {
              user_id: userInfo?.data.user_id,
              token: JSON.parse(localStorage.getItem("token")),
            },
          }
        );
        if (response.data && response.data.status === 200) {
          setTimeout(() => {
            setInitialHash(generateHash({
              skills: response.data.response.skills || [],
              universities: response.data.response.universities || [],
            }));
          }, 0);
          setTableData({
            skills: response.data.response.skills || [],
            universities: response.data.response.universities || [],
            priorities: response.data.response.priorities || [
              "دوره1",
              "دوره2",
              "دوره3",
              "دوره4",
              "دوره5",
              "دوره6",
            ],
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "خطا در دریافت اطلاعات زنجیره‌ها",
          severity: "error",
        });
        setTableData({
          skills: [],
          universities: [],
          priorities: ["دوره1", "دوره2", "دوره3", "دوره4", "دوره5", "دوره6"],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCellClick = (tableType, rowIndex, colIndex) => {
    setTableData((prev) => {
      const updatedTable = [...prev[tableType]];
      const currentValue = updatedTable[rowIndex].values[colIndex];

      if (currentValue === 0) return prev;

      updatedTable[rowIndex].values[colIndex] = currentValue === 1 ? 2 : 1;

      return {
        ...prev,
        [tableType]: updatedTable,
      };
    });
  };

  const handleRowNameClick = (row, tableType) => {
    if (row.data) {
      setModalContent({
        title: tableType === "skills" ? "جزئیات رشته" : "جزئیات دانشگاه",
        items: row.data.split(",").map(item => item.trim()),
      });
      setModalOpen(true);
    }
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      const response = await axios.post(
        "https://entekhab.yejooredigeh.com/hoshmand/update_request",
        {
          table: "users",
          method_type: "update_hoshmand_tables",
          data: {
            user_id: userInfo?.data.user_id,
            token: JSON.parse(localStorage.getItem("token")),
            skills: tableData["skills"],
            universities: tableData["universities"],
          },
        }
      );

      if (response.data && response.data.status === 200) {
        setSnackbar({
          open: true,
          message: "تغییرات با موفقیت ذخیره شد",
          severity: "success",
        });
        nextStep()
      } else {
        setSnackbar({
          open: true,
          message: "خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید.",
          severity: "warning",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در ذخیره تغییرات",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    try {

      const currentHash = generateHash({
        skills: tableData["skills"],
        universities: tableData["universities"],
      });
      if (currentHash !== initialHash) {
        setShowConfirmation(true);
        return
      }
      else {
        nextStep()
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در ذخیره تغییرات",
        severity: "error",
      });
    }
  };

  const getCellStyle = (value) => {
    switch (value) {
      case 0:
        return {
          backgroundColor: "#f5f5f5",
          cursor: "default",
          "&:hover": { backgroundColor: "#f5f5f5" },
        };
      case 1:
        return {
          backgroundColor: "#e8f5e9",
          cursor: "pointer",
          "&:hover": { backgroundColor: "#c8e6c9" },
        };
      case 2:
        return {
          backgroundColor: "#ffebee",
          cursor: "pointer",
          "&:hover": { backgroundColor: "#ffcdd2" },
        };
      default:
        return {};
    }
  };

  const renderCellContent = (value) => {
    switch (value) {
      case 0:
        return "-";
      case 1:
        return <CheckIcon color="success" />;
      case 2:
        return <CloseIcon color="error" />;
      default:
        return null;
    }
  };

  const renderTable = (data, tableType, title) => (
    <TableContainer component={Paper} elevation={3} sx={{ mb: 4 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: lightColor }}>
            <TableCell sx={{ borderRight: `2px solid ${baseColor}` }}>
              <Typography fontWeight="bold">{title}</Typography>
            </TableCell>
            {tableData.priorities.map((priority, index) => (
              <TableCell
                key={index}
                align="center"
                sx={{
                  fontWeight: "bold",
                  borderLeft: index === 0 ? `2px solid ${baseColor}` : "none",
                }}
              >
                {priority}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell
                component="th"
                scope="row"
                sx={{
                  fontWeight: "bold",
                  borderRight: `2px solid ${baseColor}`,
                  cursor: row.data ? "pointer" : "default",
                  "&:hover": {
                    backgroundColor: row.data ? lightColor : "inherit",
                  },
                }}
                onClick={() => row.data && handleRowNameClick(row, tableType)}
              >
                {row.name}
              </TableCell>
              {row.values.map((value, colIndex) => (
                <TableCell
                  key={colIndex}
                  align="center"
                  sx={[
                    getCellStyle(value),
                    {
                      borderLeft:
                        colIndex === 0 ? `2px solid ${baseColor}` : "none",
                      fontSize: "1.2rem",
                    },
                  ]}
                  onClick={() => handleCellClick(tableType, rowIndex, colIndex)}
                >
                  {renderCellContent(value)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  const descriptionContent = (
    <HelperInfo
      userInfo={userInfo}
      title="راهنمای جداول"
      secondTitle={"نکات مهم مشاوره‌ای:"}
      content={["دانش آموز عزیز، در این قسمت با توجه به مراحل گذشته و اولویت‌های شما دو جدول آماده شده و در اختیارتان قرار گرفته است. جدول اول مربوط به رشته‌ها و دوره‌های انتخابی شماست و جدول دوم بر اساس محل تحصیل شما(دانشگاه و استان محل تحصیل) و دوره‌های تحصیلی انتخابی شما ساخته شده است. در این جداول تیک سبز به معنای وجود و تمایل شما به تحصیل در آن (رشته-دوره و یا دوره-محل) می‌باشد که شما می‌توانید این تیک را ضربدر کنید تا در لیست نهایی کدرشته مدنظرتان حذف گردد. لازم به ذکر است علامت خط تیره به معنای عدم وجود هیچ کدرشته‌ای می‌باشد و امکان تغییر نخواهد داشت."]}
      additionalTips={[
        "پیشنهاد می‌شود برای دریافت خروجی بهتر از انتخاب رشته سامانه، (رشته-دوره و یا دوره-محل)‌هایی که تمایل به تحصیل در آن‌ها ندارید را با کلیک بر روی تیک آن‌ها حذفشان کنید تا در خروجی نهایی شما وجود نداشته باشند.",
        "ضمنا با کلیک بر روی عنوان هر دسته امکان مشاهده داخل آن دسته وجود خواهد داشت.",
      ]}
    />
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: lightColor,
          borderLeft: `4px solid ${baseColor}`,
        }}
      >
        {descriptionContent}
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ mt: 2, color: baseColor }}>
        جدول رشته‌‌ها
      </Typography>
      {renderTable(tableData.skills, "skills", "رشته‌ / دوره")}

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: baseColor }}>
        جدول دانشگاه‌ها
      </Typography>
      {renderTable(tableData.universities, "universities", "دانشگاه / دوره")}

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={
            saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          onClick={handleNext}
          disabled={saving}
          sx={{
            mt: 2,
            backgroundColor: baseColor,
            "&:hover": { backgroundColor: baseColor, opacity: 0.9 },
            "&:disabled": { opacity: 0.7 },
          }}
        >
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </Button>
      </Box>

      {/* Modal for showing details */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="detail-modal"
        aria-describedby="detail-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "60%" },
            maxWidth: 600,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            outline: "none",
          }}
        >
          <Box
            sx={{
              p: 3,
              maxHeight: "70vh",
              overflow: "auto",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: baseColor,
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
              }}
            >
              {modalContent?.title.includes("رشته") ? (
                <MenuBookIcon />
              ) : (
                <AccountBalanceIcon />
              )}
              {modalContent?.title}
            </Typography>

            <List
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
                overflow: "hidden",
              }}
            >
              {modalContent?.items.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    button
                    sx={{
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: lightColor,
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: lightColor }}>
                        {modalContent?.title.includes("رشته") ? (
                          <MenuBookIcon sx={{ color: baseColor }} />
                        ) : (
                          <AccountBalanceIcon sx={{ color: baseColor }} />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{
                        fontWeight: "medium",
                        color: "text.primary",
                      }}
                    />
                    {/* <ChevronLeftIcon color="action" /> */}
                  </ListItem>
                  {index < modalContent.items.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>
      </Modal>
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            animation: `${fadeIn} 0.3s ease-out`,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            minWidth: isMobile ? '90vw' : '400px',
            maxWidth: '95vw',
            borderTop: `4px solid ${baseColor}`,
          }
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            backgroundColor: lightColor,
            color: theme.palette.getContrastText(lightColor),
            py: 2,
            px: 3,
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          {"تغییرات تایید نشده"}
          <Box
            sx={{
              width: '100%',
              height: '4px',
              background: `linear-gradient(90deg, ${baseColor}, transparent)`,
              mt: 1,
              borderRadius: '2px'
            }}
          />
        </DialogTitle>

        <DialogContent sx={{ py: 3, px: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: lightColor,
                color: theme.palette.getContrastText(lightColor),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                flexShrink: 0,
                animation: `${pulse} 2s infinite`,
              }}
            >
              !
            </Box>
            <DialogContentText
              id="alert-dialog-description"
              sx={{
                color: theme.palette.text.primary,
                fontSize: '0.95rem',
                lineHeight: 1.6,
              }}
            >
              اطلاعات شما تغییر کرده و با اعمال این تغییرات موارد پیشرو دچار تغییر می‌شود.
              <br />
              آیا مایل به ذخیره تغییرات هستید؟
            </DialogContentText>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'space-between',
            px: 3,
            pb: 3,
            pt: 0,
          }}
        >
          <Button
            onClick={() => setShowConfirmation(false)}
            variant="outlined"
            sx={{
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              borderRadius: 2,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderColor: theme.palette.text.secondary,
              }
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={() => {
              setShowConfirmation(false);
              saveChanges();
            }}
            variant="contained"
            autoFocus
            sx={{
              backgroundColor: baseColor,
              color: "#fff",
              borderRadius: 2,
              px: 3,
              py: 1,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: baseColor,
                opacity: 0.9,
                boxShadow: 'none',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            ذخیره تغییرات
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PriorityTable;