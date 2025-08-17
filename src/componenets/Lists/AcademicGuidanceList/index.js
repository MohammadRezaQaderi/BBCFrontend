import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Box,
  Divider,
  Snackbar,
  Alert,
  Fade,
  CircularProgress
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import "./style.css";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { FaDownload, FaUserCheck, FaUserPlus } from "react-icons/fa";
import { GetButtonColor } from "../../../helper/buttonColor";
import Loader from "../../../helper/Loader";
import { handleDownload } from "./handleDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import ErrorState from "../../FPList/NoUser";

const ReportContainer = styled.div`
  width: 100%;
  margin-top: 50px;
  margin-right: 20px;
  margin-left: 20px;
  @media screen and (max-width: 768px) {
    padding-right: 10px;
    padding-left: 10px;
    margin-right: 0px;
    margin-left: 0px;
    margin-top: 50px;
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    padding-right: 10px;
    padding-left: 10px;
    margin-right: 0px;
    margin-left: 0px;
    margin-top: 50px;
    width: 100%;
  }
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

const barnch = (filed) => {
  if (filed === 1) {
    return "تجربی";
  } else if (filed === 2) {
    return "ریاضی";
  } else if (filed === 3) {
    return "انسانی";
  } else if (filed === 4) {
    return "زبان";
  } else if (filed === 5) {
    return "هنر";
  }
};

const AcademicGuidanceList = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [userRole] = useState(JSON.parse(localStorage.getItem("user-role")));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [accessMenuAnchor, setAccessMenuAnchor] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [modalAction, setModalAction] = useState(null);
  const [kind, setKind] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const select_report = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_report",
          data: {
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setData(response?.data?.response?.stu);
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
        message: "خطا در دریافت اطلاعات",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (!userInfo?.data?.user_id) {
      navigate("/signin");
    } else {
      setLoading(true);
      select_report().then(() => {
        setLoading(false);
      });
    }
  }, [userInfo]);

  const handleDownloadWithProgress = async (report, phone, report_name) => {
    try {
      await handleDownload(report, report_name, phone, setDownloadProgress);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دانلود فایل",
        severity: "error",
      });
    }
  };

  const handleOpenAccessMenu = (userId, event) => {
    setSelectedUserId(userId);
    setAccessMenuAnchor(event.currentTarget);
  };

  const handleCloseAccessMenu = () => {
    setAccessMenuAnchor(null);
    setSelectedUserId(null);
  };

  const handleOpenAccess = (kind, s, user) => {
    setUserDetails(user);
    setKind(kind);

    let title = "";
    let content = "";
    if (kind === "AGPDF") {
      title = "دسترسی کارنامه";
      content =
        user.AGPDF === 1
          ? "آیا از گرفتن دسترسی دریافت پی دی اف از دانش آموز مطمئن هستید؟"
          : "آیا از دادن دسترسی پی دی اف به دانش‌آموز مطمئن هستید؟";
    } else if (kind === "AGAccess") {
      title = "دسترسی تناسب رشته";
      content =
        user.AGAccess === 1
          ? "آیا از گرفتن دسترسی دیدن تناسب رشته از دانش آموز مطمئن هستید؟"
          : "آیا از دادن دسترسی دیدن تناسب رشته به دانش‌آموز مطمئن هستید؟";
    }
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setUserDetails({});
    setKind("");
  };

  const handleConfirmAccessChange = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/update_request",
        {
          table: "users",
          method_type: "update_ag_access",
          data: {
            token: JSON.parse(localStorage.getItem("token")),
            user_id: userInfo?.data?.user_id,
            kind: kind,
            stu_id: userDetails["user_id"],
            value: userDetails[kind] === 1 ? 0 : 1,
          },
        }
      );

      if (response.data.tracking_code !== null) {
        setSnackbar({
          open: true,
          message: "دسترسی با موفقیت تغییر یافت",
          severity: "success",
        });
        await select_report();
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
        message: "خطا در تغییر دسترسی",
        severity: "error",
      });
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleAccessSelection = (kind, user) => {
    if (selectedUserId) {
      handleOpenAccess(kind, selectedUserId, user);
    }
    handleCloseAccessMenu();
  };

  const AccessMenuItem = ({ kind, userId, data, onClick }) => {
    const user = data.find((u) => u.user_id === userId);
    return (
      <MenuItem onClick={() => onClick(kind, user)}>
        <ListItemIcon>
          {user?.[kind] === 1 ? <FaUserCheck /> : <FaUserPlus />}
        </ListItemIcon>
        <ListItemText>
          {kind === "AGAccess" && "تناسب رشته"}
          {kind === "AGPDF" && "کارنامه"}
        </ListItemText>
      </MenuItem>
    );
  };

  const tableConfig = {
    ins: [
      {
        accessorKey: "name",
        header: "نام",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام" },
      },
      {
        accessorKey: "phone",
        header: "نام کاربری",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام کاربری" },
      },
      {
        accessorKey: "field",
        header: "رشته",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رشته" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return <span>{barnch(row)}</span>;
        },
      },
      {
        accessorKey: "report",
        header: "کارنامه استعدادسنجی",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "کارنامه استعدادسنجی",
        },
        Cell: ({ cell }) => {
          const phone = cell.row.original.phone;
          return (
            <Button
              onClick={() =>
                handleDownloadWithProgress(
                  "get_report",
                  phone,
                  "استعدادسنجی.pdf"
                )
              }
              sx={{ boxShadow: "none", borderRadius: "5px" }}
            >
              <FaDownload color="#000" />
            </Button>
          );
        },
      },
      {
        accessorKey: "con_name",
        header: "مشاور",
        size: 50,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "مشاور" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return <>{row}</>;
        },
      },
      {
        accessorKey: "access",
        header: "دسترسی‌ها",
        size: 50,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          const row = cell.row.original;
          return (
            <IconButton onClick={(e) => handleOpenAccessMenu(row.user_id, e)}>
              <SettingsIcon />
            </IconButton>
          );
        },
      },
    ],
    oCon: [
      {
        accessorKey: "name",
        header: "نام",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام" },
      },
      {
        accessorKey: "phone",
        header: "نام کاربری",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام کاربری" },
      },
      {
        accessorKey: "field",
        header: "رشته",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رشته" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return <span>{barnch(row)}</span>;
        },
      },
      {
        accessorKey: "report",
        header: "کارنامه استعدادسنجی",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "کارنامه استعدادسنجی",
        },
        Cell: ({ cell }) => {
          const phone = cell.row.original.phone;
          return (
            <Button
              onClick={() =>
                handleDownloadWithProgress(
                  "get_report",
                  phone,
                  "استعدادسنجی.pdf"
                )
              }
              sx={{ boxShadow: "none", borderRadius: "5px" }}
            >
              <FaDownload color="#000" />
            </Button>
          );
        },
      },
      {
        accessorKey: "access",
        header: "دسترسی‌ها",
        size: 50,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          const row = cell.row.original;
          return (
            <IconButton onClick={(e) => handleOpenAccessMenu(row.user_id, e)}>
              <SettingsIcon />
            </IconButton>
          );
        },
      },
    ],
    con: [
      {
        accessorKey: "name",
        header: "نام",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام" },
      },
      {
        accessorKey: "phone",
        header: "نام کاربری",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام کاربری" },
      },
      {
        accessorKey: "field",
        header: "رشته",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رشته" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return <span>{barnch(row)}</span>;
        },
      },
      {
        accessorKey: "report",
        header: "کارنامه استعدادسنجی",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "کارنامه استعدادسنجی",
        },
        Cell: ({ cell }) => {
          const phone = cell.row.original.phone;
          return (
            <Button
              onClick={() =>
                handleDownloadWithProgress(
                  "get_report",
                  phone,
                  "استعدادسنجی.pdf"
                )
              }
              sx={{ boxShadow: "none", borderRadius: "5px" }}
            >
              <FaDownload color="#000" />
            </Button>
          );
        },
      },
    ],
  };

  const columns = useMemo(() => tableConfig[userRole] || [], [userRole]);

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <>
      <ReportContainer >
        <Paper
          elevation={3}
          sx={{
            p: 1,
            boxShadow: "none",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Grid container>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2
                }}
              >
                <Typography
                  component="h4"
                  variant="h5"
                  color={GetButtonColor(userInfo?.data?.sex)}
                  fontWeight={600}
                >
                  مشاهده کارنامه
                </Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button
                    variant="contained"
                    style={{
                      background: GetButtonColor(userInfo?.data?.sex),
                    }}
                    sx={{ boxShadow: "none", borderRadius: "5px" }}
                    onClick={() =>
                      handleDownloadWithProgress(
                        "get_default",
                        "1111111111",
                        "نمونه کارنامه استعدادسنجی.pdf"
                      )
                    }
                  >
                    نمونه کارنامه
                  </Button>
                </div>
              </Grid>
            </Grid>
            <Divider sx={{ backgroundColor: GetButtonColor(userInfo?.data?.sex) }} />
          </Box>
          {data?.length > 0 ? (
            <div style={{ marginTop: "50px" }}>
              <ThemeProvider theme={createTheme({ direction: "rtl" })}>
                <MaterialReactTable
                  autoResetPageIndex={false}
                  columns={columns}
                  data={data}
                  enableSorting={true}
                  initialState={{
                    density: "compact",
                    pagination: { pageSize: 50 },
                  }}
                  enableDensityToggle={false}
                  getRowId={(row) => row.userId}
                  localization={MRT_Localization_FA}
                  enableStickyHeader
                  muiTableContainerProps={{
                    sx: {
                      maxHeight: "600px",
                    },
                  }}
                  muiTableHeadCellProps={{
                    sx: {
                      backgroundColor: "#f5f5f5",
                      fontWeight: "bold",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    },
                  }}
                  muiTableBodyProps={{
                    sx: {
                      "& tr": {
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      },
                    },
                  }}
                />
              </ThemeProvider>
            </div>
          ) : (
            <ErrorState
              action={"⚠️"}
              title={"دانش‌آموزی برای استعدادسنجی ثبت نشده"}
              description={
                "شما هنوز دانش‌آموزی برای استفاده از خدمت استعدادسنجی ثبت نکرده‌اید. با ثبت این خدمت برای دانش‌آموز خود می‌تونید از رشته‌های مناسب و نامناسب برای دانش‌آموز خود نسبت به شخصیت و استعدادش باخبر شید و در فرایند انتخاب رشته کار راحتری داشته باشید."
              }
              needHeight={false}
            />
          )}
          <Menu
            anchorEl={accessMenuAnchor}
            open={Boolean(accessMenuAnchor)}
            onClose={handleCloseAccessMenu}
          >
            <AccessMenuItem
              kind="AGAccess"
              userId={selectedUserId}
              data={data}
              onClick={handleAccessSelection}
            />
            <AccessMenuItem
              kind="AGPDF"
              userId={selectedUserId}
              data={data}
              onClick={handleAccessSelection}
            />
          </Menu>
          <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
            <DialogTitle sx={{ textAlign: "center" }}>{modalTitle}</DialogTitle>
            <Grid item xs={12}>
              <hr
                style={{
                  border: `1px solid ${GetButtonColor(userInfo?.data?.sex)}`,
                }}
              />
            </Grid>
            <DialogContent>
              <Typography sx={{ textAlign: "center" }}>{modalContent}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                color="error"
                sx={{
                  boxShadow: "none",
                  borderRadius: "5px",
                  padding: "12px 0",
                }}
                onClick={handleCloseModal}>
                انصراف
              </Button>
              <Button
                onClick={handleConfirmAccessChange}
                variant="contained"
                type="submit"
                sx={{
                  boxShadow: "none",
                  borderRadius: "5px",
                  padding: "12px 0",
                  marginRight: "10px",
                }}
                style={{
                  background:
                    GetButtonColor(userInfo?.data?.sex),
                }}
              >
                تایید
              </Button>
            </DialogActions>
          </Dialog>
          <Fade in={downloadProgress} timeout={300}>
            <ProgressOverlay>
              <ProgressContainer>
                <CircularProgress
                  size={60}
                  thickness={4}
                  style={{ color: GetButtonColor(userInfo?.data?.sex) }}
                />
                <ProgressText>در حال آماده‌سازی فایل PDF</ProgressText>
                <ProgressBar>
                  <ProgressFill progress={downloadProgress} color={GetButtonColor(userInfo?.data?.sex)} />
                </ProgressBar>
                <ProgressText>{Math.min(100, Math.round(downloadProgress))}%</ProgressText>
              </ProgressContainer>
            </ProgressOverlay>
          </Fade>
        </Paper>
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
      </ReportContainer>
    </>
  );
};

export default AcademicGuidanceList;
