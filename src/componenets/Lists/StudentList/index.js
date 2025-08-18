import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Box,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import "./style.css";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import SettingsIcon from "@mui/icons-material/Settings";
import EditStudentForm from "../../Modals/EditStudent";
import FirstAddStudentForm from "../../Modals/FirstAddStudent";
import Loader from "../../../helper/Loader";
import { GetButtonColor } from "../../../helper/buttonColor";
import EditInfoAccess from "./EditInfoAcess";
import ShowInfoFP from "../FieldPickList/ShowInfoFP";
import ErrorState from "../../FPList/NoUser";

const StudentContainer = styled.div`
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

const StudentList = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [userRole] = useState(JSON.parse(localStorage.getItem("user-role")));
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [data, setData] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [openAccess, setOpenAccess] = useState(false);
  const [kind, setKind] = useState("");
  const [openUserInfoModal, setOpenUserInfoModal] = useState(false);
  const [accessMenuAnchor, setAccessMenuAnchor] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenUser = (user_id) => {
    select_student_data(user_id).then(() => {
      setOpenUserInfoModal(true);
    });
  };

  const handleCloseUser = () => {
    setUserDetails({});
    setOpenUserInfoModal(false);
  };

  const handleOpenAccess = (k, s) => {
    setKind(k);
    select_student_data(s).then(() => {
      setOpenAccess(true);
    });
  };

  const handleClose = () => {
    setUserDetails({});
    setKind("");
    setOpenAccess(false);
  };

  const handleCloseFinalize = (s) => {
    select_student_data(s).then(() => { });
  };

  const handleOpenAccessMenu = (userId, event) => {
    setSelectedUserId(userId);
    setAccessMenuAnchor(event.currentTarget);
  };

  const handleCloseAccessMenu = () => {
    setAccessMenuAnchor(null);
    setSelectedUserId(null);
  };

  const handleAccessSelection = (kind) => {
    if (selectedUserId) {
      handleOpenAccess(kind, selectedUserId);
    }
    handleCloseAccessMenu();
  };

  const AccessMenuItem = ({ kind, userId, data, onClick }) => {
    const user = data.find((u) => u.user_id === userId);
    return (
      <MenuItem onClick={() => onClick(kind)}>
        <ListItemIcon>
          {user?.[kind] === 1 ? <FaUserCheck /> : <FaUserPlus />}
        </ListItemIcon>
        <ListItemText>
          {kind === "hoshmand" && "هوشمند"}
          {kind === "FR" && "آزاد"}
          {kind === "AG" && "استعدادسنجی"}
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
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <span
              onClick={() => handleOpenUser(user_id)}
              style={{ cursor: "pointer" }}
            >
              {row}
            </span>
          );
        },
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
        accessorKey: "password",
        header: "رمز عبور",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رمز عبور" },
      },
      {
        accessorKey: "field",
        header: "رشته",
        size: 75,
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
        accessorKey: "rank",
        header: "رتبه",
        size: 75,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رتبه" },
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
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <span
              onClick={() => handleOpenUser(user_id)}
              style={{ cursor: "pointer" }}
            >
              {row}
            </span>
          );
        },
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
        accessorKey: "password",
        header: "رمز عبور",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رمز عبور" },
      },
      {
        accessorKey: "field",
        header: "رشته",
        size: 75,
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
        accessorKey: "rank",
        header: "رتبه",
        size: 75,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رتبه" },
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
  };

  const columns = useMemo(() => tableConfig[userRole], [userRole]);

  const select_cons_stu = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_cons_stu",
          data: {
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setConsultants(response?.data?.response?.con);
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

  const select_students = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_students",
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

  const select_student_data = async (user_id) => {
    setDetailsLoading(true);
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_student_data",
          data: {
            stu_id: parseInt(user_id),
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setUserDetails(response?.data?.response?.stu);
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
    } finally {
      setDetailsLoading(false); // End loading regardless of success/failure
    }
  };

  useEffect(() => {
    if (userInfo?.data.user_id === undefined) {
      navigate("/signin");
    } else {
      setLoading(true);
      select_students().then(() => {
        if (["ins"].includes(userRole)) {
          select_cons_stu().then(() => {
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
    }
  }, [userInfo, reload]);

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <StudentContainer>
      {detailsLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <Loader color={GetButtonColor(userInfo?.data?.sex)} />
        </div>
      )}
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
                لیست دانش‌آموزان
              </Typography>
              <FirstAddStudentForm
                setReload={setReload}
                consultants={consultants}
              />
            </Grid>
          </Grid>
          <Divider sx={{ backgroundColor: GetButtonColor(userInfo?.data?.sex) }} />
        </Box>
        {data?.length > 0 ? (
          <div style={{ marginTop: "50px" }}>
            {["ins"].includes(userRole) ? (
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
                  enableRowActions
                  renderRowActions={({ row, table }) => (
                    <EditStudentForm
                      type="edit"
                      setReload={setReload}
                      InputData={row.original}
                      consultants={consultants}
                    />
                  )}
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
            ) : (
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
                />
              </ThemeProvider>
            )}
          </div>
        ) : (
          <ErrorState
            action={"⚠️"}
            title={"اطلاعاتی لیست دانش‌آموزان یافت نشد"}
            description={
              "لطفا در ابتدا دانش‌آموز تعریف کنید تا در این لیست بتوانید اطلاعات مربوط به دانش‌آموزان خود را مشاهده کنید."
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
            kind="hoshmand"
            userId={selectedUserId}
            data={data}
            onClick={handleAccessSelection}
          />
          <AccessMenuItem
            kind="FR"
            userId={selectedUserId}
            data={data}
            onClick={handleAccessSelection}
          />
          <AccessMenuItem
            kind="AG"
            userId={selectedUserId}
            data={data}
            onClick={handleAccessSelection}
          />
        </Menu>

        {openAccess && (
          <EditInfoAccess
            userDetails={userDetails}
            open={openAccess}
            onClose={handleClose}
            finalized={userDetails?.finalized}
            setReload={setReload}
            kind={kind}
            userInfo={userInfo}
            handleCloseFinalize={handleCloseFinalize}
          />
        )}
        {openUserInfoModal && (
          <ShowInfoFP
            userDetails={userDetails}
            open={openUserInfoModal}
            onClose={handleCloseUser}
            userInfo={userInfo}
          />
        )}
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
    </StudentContainer>
  );
};

export default StudentList;
