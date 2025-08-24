import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import {
  Box,
  Button,
  createTheme,
  IconButton,
  ThemeProvider,
  Tooltip,
  useMediaQuery,
  useTheme,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Avatar,
  Collapse,
  Divider,
  styled as MuiStyled,
  CircularProgress
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { MdFormatListNumbered } from "react-icons/md";
import { MdRestoreFromTrash } from "react-icons/md";
import { RiDeviceRecoverLine } from "react-icons/ri";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ConvertField, ConvertQuota } from "../../../../helper/FieldCheck";
import {
  GetBackGroundColor,
  GetButtonColor,
} from "../../../../helper/buttonColor";
import Loader from "../../../../helper/Loader";
import ErrorState from "../../../../helper/ErrorState";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import { FaAward, FaBook, FaMapMarkerAlt, FaUser, FaVenusMars } from "react-icons/fa";

const LoadingOverlay = MuiStyled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: "9999",
}));


const descriptionContent = (
  <Typography variant="body2" fontWeight="bold">
    حتما بعد از انجام هرگونه تغییرات در چینش لیست منتخب خود دکمه اعمال تغییرات
    در پایین صفحه بزنید.
  </Typography>
);

const check = async (arr1, element) => {
  for (let index = 0; index < arr1.length; index++) {
    if (element["filedCode"] === arr1[index]["filedCode"]) {
      return true;
    }
  }
  return false;
};

const GLTrashList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [UserData, setUserData] = useState({});
  const [update, setUpdate] = useState(false);
  const [restore, setRestore] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [specialList, setSpecialList] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const warningColor = "#ff4444";
  const lightWarningColor = "#ffebee";
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [expanded, setExpanded] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "filedCode",
        header: "کد",
        size: 70,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "کد" },
      },
      {
        accessorKey: "field",
        header: "رشته",
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رشته" },
      },
      {
        accessorKey: "city",
        header: "استان-شهر",
        size: 80,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "استان-شهر" },
      },
      {
        accessorKey: "university",
        header: "دانشگاه",
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "دانشگاه" },
      },
      {
        accessorKey: "admission",
        header: "ترم ورودی",
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "ترم ورودی" },
        Cell: ({ cell }) => (
          <span>{cell.getValue() === 1 ? "نیم‌سال اول" : "نیم‌سال دوم"}</span>
        ),
      },
      {
        accessorKey: "kind",
        header: "نوع پذیرش",
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نوع پذیرش" },
      },
      {
        accessorKey: "obligation",
        header: "تعهد",
        size: 80,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "تعهد" },
        Cell: ({ cell }) => (
          <span>{cell.getValue() === 0 ? "ندارد" : "دارد"}</span>
        ),
      },
      {
        accessorKey: "period",
        header: "دوره",
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "دوره" },
      },
      {
        accessorKey: "explain",
        header: "توضیح",
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "توضیح" },
        enableResizing: false,
      },
      {
        accessorKey: "admissionKind",
        header: "",
        maxSize: 50,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return (
            <span
              style={{
                backgroundColor:
                  row === 3
                    ? "#fa7373"
                    : row === 2
                      ? "#f5eb69"
                      : row === 1
                        ? "#8ef78b"
                        : row === 0
                          ? "#c7c7c7"
                          : "white",
                borderRadius: "50%",
                paddingTop: 3,
                paddingLeft: 10,
                paddingRight: 10,
                color: "white",
              }}
            ></span>
          );
        },
      },
    ];

    // For mobile devices, show fewer columns
    // if (isMobile) {
    //   return baseColumns.filter((column) =>
    //     ["filedCode", "field", "university", "admissionKind"].includes(
    //       column.accessorKey
    //     )
    //   );
    // }

    // // For tablets, show a moderate set of columns
    // if (isTablet) {
    //   return baseColumns.filter((column) =>
    //     [
    //       "filedCode",
    //       "field",
    //       "city",
    //       "university",
    //       "kind",
    //       "admissionKind",
    //     ].includes(column.accessorKey)
    //   );
    // }

    // For desktop, show all columns
    return baseColumns;
  }, [userInfo, isMobile, isTablet]);

  const get_student_info = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_student_field_info",
          data: {
            user_id: userInfo?.data.user_id,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setUserData(response.data.response.data);
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
        message: "خطا در دریافت اطلاعات دانش‌آموز",
        severity: "error",
      });
    }
  };

  const update_spgl_list = async () => {
    if (specialList?.length > 400) {
      setSnackbar({
        open: true,
        message: "لیست منتخب شما پر می‌باشد. لطفا لیست انتخابی خود را مدیریت نمایید ",
        severity: "warning",
      });
      setUpdate((perv) => !perv);
      return false;
    } else {
      try {
        const response = await axios.post(
          "https://student.baazmoon.com/bbc_fieldpick_api/update_request",
          {
            table: "users",
            method_type: "update_spgl_list",
            data: {
              user_id: userInfo?.data?.user_id,
              special_list: JSON.stringify(specialList),
              token: JSON.parse(localStorage.getItem("token")),
            },
          }
        );
        if (response.data.tracking_code !== null) {
          setSnackbar({
            open: true,
            message: response?.data?.response.message,
            severity: "success",
          });
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
          message: "خطا در ارتباط با سامانه",
          severity: "error",
        });
      }
      return true;
    }
  };

  const select_spgl_list = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "select_spgl_list",
          data: {
            user_id: userInfo?.data?.user_id,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setSpecialList(response.data.response);
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
        message: "خطا در ارتباط با سامانه",
        severity: "error",
      });
    }
  };

  const update_trgl_list = async () => {
    if (data?.length > 400) {
      setSnackbar({
        open: true,
        message: "لیست سطل آشغال پر می‌باشد. لطفا سطل آشغال خود را مدیریت نمایید ",
        severity: "warning",
      });
    } else {
      try {
        const response = await axios.post(
          "https://student.baazmoon.com/bbc_fieldpick_api/update_request",
          {
            table: "users",
            method_type: "update_trgl_list",
            data: {
              user_id: userInfo?.data?.user_id,
              trash_list: JSON.stringify(data),
              token: JSON.parse(localStorage.getItem("token")),
            },
          }
        );
        if (response.data.tracking_code !== null) {
          setSnackbar({
            open: true,
            message: response?.data?.response.message,
            severity: "success",
          });
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
          message: "خطا در ارتباط با سامانه",
          severity: "error",
        });
      }
    }
  };

  const select_trgl_list = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "select_trgl_list",
          data: {
            user_id: userInfo?.data?.user_id,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setData(response.data.response);
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
        message: "خطا در ارتباط با سامانه",
        severity: "error",
      });
    }
  };

  const update_table = () => {
    if (Object.keys(UserData).length !== 0) {
      setSearchLoading(true)
      check_added_to_list().then(() => {
        update_spgl_list().then((flag) => {
          if (flag) {
            update_trgl_list().then(() => {
              setUpdate((perv) => !perv);
            });
          } else {
            setUpdate((perv) => !perv);
          }
          setSearchLoading(false);
        });
      });
    } else {
      setSnackbar({
        open: true,
        message: "اطلاعات دانش‌آموز دریافت نشد.",
        severity: "warning",
      });
    }
  };

  const check_added_to_list = async () => {
    let equal = 0;
    let new_spec = specialList;
    if (new_spec.length > 0) {
      for (let j = 0; j < restore.length; j++) {
        check(specialList, restore[j]).then((flag) => {
          if (flag) {
            equal += 1;
          } else if (!flag) {
            new_spec.push(restore[j]);
          }
        });
      }
    } else {
      for (let k = 0; k < restore.length; k++) {
        new_spec.push(restore[k]);
      }
    }
    if (equal > 0) {
      setSnackbar({
        open: true,
        message: equal + "انتخاب بازگردانده شده شما تکراری بود.",
        severity: "warning",
      });
    }
    setSpecialList(new_spec);
  };

  useEffect(() => {
    if (userInfo?.data?.user_id === undefined) {
      navigate("/signin");
    } else {
      setLoading(true);
      get_student_info().then(() => {
        setLoading(false);
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (Object.keys(UserData).length !== 0) {
      select_spgl_list().then(() => {
        select_trgl_list().then(() => { });
      });
    }
  }, [UserData, update]);

  const InfoItem = ({ icon, label, value, color }) => (
    <Grid item xs={6} sm={4} md={3}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{
          display: "flex",
          alignItems: "center",
          p: 1.5,
          borderRadius: "8px",
          height: "100%",
        }}>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: color ? `${color}20` : "#f0f0f0",
            color: color || "#555",
            mr: 1.5,
            flexShrink: 0
          }}>
            {icon}
          </Box>
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="caption" color="textSecondary" noWrap>
              {label}
            </Typography>
            <Typography variant="body2" fontWeight="bold" color={color || "textPrimary"} noWrap>
              {value}
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Grid>
  );

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: isMobile ? 1 : 3,
        margin: isMobile ? 0 : 1,
      }}
      style={{
        width: "100%",
        position: 'relative'
      }}
    >
      {searchLoading && (
        <LoadingOverlay>
          <CircularProgress
            sx={{ color: GetButtonColor(userInfo?.data?.sex) }}
            size={60}
          />
        </LoadingOverlay>
      )}
      {Object.keys(UserData).length !== 0 ? (
        <div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              padding: isMobile ? 1 : 3,
              margin: isMobile ? 0 : 1,
            }}
          >
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
                      backgroundColor: expanded ? "rgba(0,0,0,0.02)" : "transparent",
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
                        mr: 2
                      }}
                    >
                      {UserData?.first_name?.charAt(0)}.{UserData?.last_name?.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {`${UserData?.first_name} ${UserData?.last_name}`}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {`${ConvertField(UserData?.field)} • رتبه ${UserData?.rank}`}
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
                        value={ConvertField(UserData?.field)}
                      />
                      <InfoItem
                        icon={<FaAward size={14} />}
                        label="سهمیه"
                        value={ConvertQuota(UserData?.quota)}
                      />
                      <InfoItem
                        icon={<FaAward size={14} />}
                        label="رتبه"
                        value={UserData?.rank}
                      />
                      <InfoItem
                        icon={<FaMapMarkerAlt size={14} />}
                        label="استان"
                        value={UserData?.city?.split(",")[1]}
                      />
                      <InfoItem
                        icon={<FaUser size={14} />}
                        label="سن"
                        value={1404 - parseInt(UserData?.birth_date) + " سال"}
                      />
                    </Grid>
                  </Collapse>
                </Box>
              </motion.div>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  mb: 2,
                  mt: 2,
                  width: isMobile ? "95%" : isTablet ? "75%" : "50%",
                  backgroundColor: lightWarningColor,
                  borderLeft: `4px solid ${warningColor}`,
                  color: "#d32f2f",
                  "& .MuiTypography-root": {
                    color: "#d32f2f",
                  },
                  textAlign: "center",
                }}
                style={{ width: "100%", maxWidth: "800px" }}
              >
                {descriptionContent}
              </Paper>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 3,
                gap: 2,
                mb: 2,
              }}
            >
              <Tooltip title="اعمال تغییرات(بازگردانی)">
                <Button
                  style={{
                    position: isMobile ? "fixed" : "static",
                    bottom: isMobile ? "50px" : "auto",
                    left: isMobile ? "30px" : "auto",
                    zIndex: 1000,
                    background: GetButtonColor(userInfo?.data?.sex),
                    borderRadius: "25px",
                    minWidth: isMobile ? "40px" : "auto",
                    padding: isMobile ? "8px" : "10px 16px",
                    color: "#fff",
                  }}
                  onClick={update_table}
                >
                  <RiDeviceRecoverLine color="#fff" size={isMobile ? 16 : 18} />
                  {!isMobile && (
                    <span style={{ marginRight: "8px" }}>اعمال تغییرات</span>
                  )}
                </Button>
              </Tooltip>
              <Tooltip title="صفحه جستجو">
                <Button
                  style={{
                    background: GetButtonColor(userInfo?.data?.sex),
                    borderRadius: "25px",
                    minWidth: isMobile ? "40px" : "auto",
                    padding: isMobile ? "8px" : "10px 16px",
                    color: "#fff",
                  }}
                  onClick={() => navigate("/pfgl")}
                >
                  <FiSearch color="#fff" size={isMobile ? 16 : 18} />
                  {!isMobile && (
                    <span style={{ marginRight: "8px" }}>جستجو</span>
                  )}
                </Button>
              </Tooltip>
              <Tooltip title="لیست منتخب سراسری">
                <Button
                  style={{
                    background: GetButtonColor(userInfo?.data?.sex),
                    borderRadius: "25px",
                    minWidth: isMobile ? "40px" : "auto",
                    padding: isMobile ? "8px" : "10px 16px",
                    color: "#fff",
                  }}
                  onClick={() => navigate("/spgl")}
                >
                  <MdFormatListNumbered
                    color="#fff"
                    size={isMobile ? 16 : 18}
                  />
                  {!isMobile && (
                    <span style={{ marginRight: "8px" }}>لیست منتخب</span>
                  )}
                </Button>
              </Tooltip>
            </Box>
          </Box>

          <ThemeProvider theme={createTheme({ direction: "rtl" })}>
            <MaterialReactTable
              enableRowNumbers
              enableColumnActions={false}
              autoResetPageIndex={false}
              columns={columns}
              enableDensityToggle={false}
              data={data || []}
              initialState={{
                density: "compact",
                pagination: { pageSize: 10 },
              }}
              style={{ direction: "rtl", width: "100%" }}
              muiTableContainerProps={{
                sx: {
                  maxHeight: "350px",
                },
              }}
              muiTableProps={{
                sx: {
                  tableLayout: isMobile ? "auto" : "fixed",
                  minWidth: isMobile ? "300px" : "100%",
                },
              }}
              muiTableHeadCellProps={{
                sx: {
                  fontSize: isMobile ? "12px" : "14px",
                  whiteSpace: "nowrap",
                  backgroundColor: "#f5f5f5",
                  fontWeight: "normal",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                },
              }}
              muiTableHeadCellFilterTextFieldProps={{
                sx: {
                  m: "0.5rem 0",
                  width: "100%",
                },
              }}
              muiTableBodyCellProps={({ row }) => {
                return {
                  sx: {
                    fontWeight: "normal",
                    fontSize: isMobile ? "10px" : "12px",
                    whiteSpace: "nowrap",
                  },
                };
              }}
              muiTablePaginationProps={{
                rowsPerPageOptions: [10, 50, 100, 400],
              }}
              enableRowActions
              renderRowActions={({ row, table }) => (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <IconButton
                    color="error"
                    size={isMobile ? "small" : "medium"}
                    onClick={() => {
                      deleted.push(data[row.index]);
                      data.splice(row.index, 1);
                      setData([...data]);
                    }}
                  >
                    <MdDelete />
                  </IconButton>
                  <IconButton
                    color="default"
                    size={isMobile ? "small" : "medium"}
                    onClick={() => {
                      restore.push(data[row.index]);
                      data.splice(row.index, 1);
                      setData([...data]);
                    }}
                  >
                    <MdRestoreFromTrash />
                  </IconButton>
                </Box>
              )}
              getRowId={(row) => row.filedCode}
              localization={MRT_Localization_FA}
              enableStickyHeader
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
          title={"دسترسی محدود"}
          description={
            "شما به این قسمت دسترسی ندارید، لطفا ابتدا اطلاعات خود را تکمیل کنید و در ادامه این خدمت رو تهیه کنید تا بتونید از امکاناتش اسفاده کنید."
          }
          needHeight={false}
        />
      )}
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
    </div>
  );
};

export default GLTrashList;
