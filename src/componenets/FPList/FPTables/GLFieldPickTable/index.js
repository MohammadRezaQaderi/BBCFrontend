import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import {
  Button,
  Tooltip,
  Box,
  useMediaQuery,
  useTheme,
  Grid,
  Typography,
  Snackbar,
  Alert, Avatar,
  IconButton,
  Collapse,
  Divider,
  CircularProgress,
  styled
} from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { MdFormatListNumbered } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import Loader from "../../../../helper/Loader";
import FilterInput from "../../../../helper/FilterInput/FilterInput";
import { ConvertField, ConvertQuota } from "../../../../helper/FieldCheck";
import {
  GetBackGroundColor,
  GetButtonColor,
} from "../../../../helper/buttonColor";
import ErrorState from "../../../../helper/ErrorState";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import { FaAward, FaBook, FaMapMarkerAlt, FaUser, FaVenusMars } from "react-icons/fa";

const LoadingOverlay = styled(Box)(({ theme }) => ({
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
  zIndex: theme.zIndex.modal + 1,
}));

const check = async (arr1, element) => {
  for (let index = 0; index < arr1.length; index++) {
    if (element["filedCode"] === arr1[index]["filedCode"]) {
      return true;
    }
  }
  return false;
};

const GLFieldPickTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [majors, setMajors] = useState([]);
  const [fieldName, setFieldName] = useState([]);
  const [university, setUniversity] = useState([]);
  const [universityName, setUniversityName] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [provincesName, setProvincesName] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesName, setCitiesName] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [periodsName, setPeriodsName] = useState([]);
  const [secondField, setSecondField] = useState("");
  const [acceptWay, setAcceptWay] = useState("");
  const [acceptanceChance, setAcceptanceChance] = useState("");
  const [serviceCommitment, setServiceCommitment] = useState("");
  const [UserData, setUserData] = useState({});
  const [rowIndex, setRowIndex] = useState("");
  const [specialList, setSpecialList] = useState([]);
  const [specialSelect, setSpecialSelect] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

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

    // if (isMobile) {
    //   return baseColumns.filter((column) =>
    //     ["filedCode", "field", "university", "admissionKind"].includes(
    //       column.accessorKey
    //     )
    //   );
    // }

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

  const search_fields = async () => {
    try {
      setSearchLoading(true)
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "fp_search_fields",
          data: {
            user_id: userInfo?.data.user_id,
            provinces: provincesName,
            cities: citiesName,
            universityName: universityName,
            fieldName: fieldName,
            periodType: periodsName,
            acceptWay:
              acceptWay === "با آزمون"
                ? "با آزمون"
                : acceptWay === "صرفا با سوابق تحصیلی"
                  ? "صرفا با سوابق تحصیلی"
                  : "NULL",
            acceptanceChance:
              acceptanceChance === "احتمال قبولی زیاد"
                ? 1
                : acceptanceChance === "احتمال قبولی متوسط تا زیاد"
                  ? 2
                  : acceptanceChance === "احتمال قبولی کم تا زیاد"
                    ? 3
                    : "NULL",
            serviceCommitment:
              serviceCommitment === "دارد"
                ? 1
                : serviceCommitment === "ندارد"
                  ? 0
                  : 3,
            sex: UserData?.sex,
            nativeProvince: UserData?.city.split(",")[0],
            rank_in_all: UserData?.rank,
            quota: UserData?.quota,
            field: UserData?.field,
            secondField:
              secondField === "زبان" ? 4 : secondField === "هنر" ? 5 : "NULL",
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setData(response.data.response);
        setRowSelection({});
        setSpecialSelect([]);
        setSnackbar({
          open: true,
          message: "لیست جدید بروز شد.",
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
        message: "خطا در جستجو",
        severity: "error",
      });
    } finally {
      setSearchLoading(false); // Hide loading overlay
    }
  };

  const fp_exam_types = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "fp_exam_types",
          data: {
            user_id: userInfo?.data.user_id,
            provinces: provincesName,
            cities: citiesName,
            universityName: universityName,
            majors: fieldName,
            sex: UserData?.sex,
            nativeProvince: UserData?.city.split(",")[0],
            field: UserData?.field,
            secondField:
              secondField === "زبان" ? 4 : secondField === "هنر" ? 5 : "NULL",
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setPeriods(response.data.response);
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
        message: "خطا در جستجو",
        severity: "error",
      });
    }
  };

  const fp_majors = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "fp_majors",
          data: {
            user_id: userInfo?.data.user_id,
            provinces: provincesName,
            cities: citiesName,
            universityName: universityName,
            sex: UserData?.sex,
            nativeProvince: UserData?.city.split(",")[0],
            field: UserData?.field,
            secondField:
              secondField === "زبان" ? 4 : secondField === "هنر" ? 5 : "NULL",
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setMajors(response.data.response);
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
        message: "خطا در جستجو",
        severity: "error",
      });
    }
  };

  const fp_universities = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "fp_universities",
          data: {
            user_id: userInfo?.data.user_id,
            provinces: provincesName,
            cities: citiesName,
            sex: UserData?.sex,
            nativeProvince: UserData?.city.split(",")[0],
            field: UserData?.field,
            secondField:
              secondField === "زبان" ? 4 : secondField === "هنر" ? 5 : "NULL",
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setUniversity(response.data.response);
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
        message: "خطا در جستجو",
        severity: "error",
      });
    }
  };

  const fp_cities = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "fp_cities",
          data: {
            user_id: userInfo?.data.user_id,
            provinces: provincesName,
            sex: UserData?.sex,
            nativeProvince: UserData?.city.split(",")[0],
            field: UserData?.field,
            secondField:
              secondField === "زبان" ? 4 : secondField === "هنر" ? 5 : "NULL",
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setCities(response.data.response);
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
        message: "خطا در جستجو",
        severity: "error",
      });
    }
  };

  const fp_provinces = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "fp_provinces",
          data: {
            user_id: userInfo?.data.user_id,
            sex: UserData?.sex,
            nativeProvince: UserData?.city.split(",")[0],
            field: UserData?.field,
            secondField:
              secondField === "زبان" ? 4 : secondField === "هنر" ? 5 : "NULL",
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setProvinces(response.data.response);
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
        message: "خطا در جستجو",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (Object.keys(UserData).length !== 0) {
      fp_provinces().then(() => { });
    }
  }, [UserData, secondField]);

  useEffect(() => {
    if (Object.keys(UserData).length !== 0) {
      fp_cities().then(() => { });
    }
  }, [provincesName, UserData, secondField]);

  useEffect(() => {
    if (Object.keys(UserData).length !== 0) {
      fp_universities().then(() => { });
    }
  }, [citiesName, provincesName, UserData, secondField]);

  useEffect(() => {
    if (Object.keys(UserData).length !== 0) {
      fp_majors().then(() => { });
    }
  }, [universityName, citiesName, provincesName, UserData, secondField]);

  useEffect(() => {
    if (Object.keys(UserData).length !== 0) {
      fp_exam_types().then(() => { });
    }
  }, [
    universityName,
    citiesName,
    provincesName,
    UserData,
    fieldName,
    secondField,
    periodsName,
  ]);

  useEffect(() => {
    if (!userInfo?.data?.user_id) {
      navigate("/signin");
    } else {
      setLoading(true);
      get_student_info().finally(() => setLoading(false));
    }
  }, [userInfo, navigate]);

  const Search = () => {
    if (Object.keys(UserData).length !== 0) {
      search_fields().then(() => {
        select_spgl_list().then(() => { });
      });
    } else {
      setSnackbar({
        open: true,
        message: "اطلاعات شما دریافت نشده است.",
        severity: "warning",
      });
    }
  };

  const special_list = () => {
    if (Object.keys(rowSelection).length === 0) {
      setSnackbar({
        open: true,
        message: "شما هیچ ردیفی انتخاب نکرده‌اید.",
        severity: "error",
      });
    } else {
      check_added_to_list().then((equal) => {
        update_spgl_list().then(() => {
          select_spgl_list().then(() => {
            if (equal > 0) {
              setSnackbar({
                open: true,
                message: `${equal} ردیف شما تکراری بود`,
                severity: "warning",
              });
            }
          });
        });
      });
    }
  };

  const check_added_to_list = async () => {
    let new_spec = specialList;
    let equal = 0;
    for (let specialItem of specialSelect) {
      const flag = await check(new_spec, specialItem);
      if (flag) {
        equal++;
      } else {
        new_spec.push(specialItem);
      }
    }
    setSpecialList(new_spec);
    return equal;
  };

  const addList = async (row) => {
    let a = specialSelect;
    a.push(row);
    setSpecialSelect(a);
  };

  const removeList = async (row) => {
    let newFilter = specialSelect;
    var index = newFilter.indexOf(row);
    if (index !== -1) {
      newFilter.splice(index, 1);
    }
    setSpecialSelect(newFilter);
  };

  const handleRowClick = (rowId, shiftKeyPressed) => {
    if (!shiftKeyPressed) {
      setRowIndex(rowId.index);
      setRowSelection((prev) => ({
        ...prev,
        [rowId.id]: !prev[rowId.id],
      }));
      if (rowSelection[rowId.id]) {
        removeList(data[rowId.index]).then(() => { });
      } else {
        addList(data[rowId.index]).then(() => { });
      }
    } else {
      if (parseInt(rowIndex) > rowId.index) {
        let from_index = rowId.index;
        let to_index = parseInt(rowIndex);
        for (let index = from_index; index < to_index; index++) {
          setRowSelection((prev) => ({
            ...prev,
            [data[index].filedCode]: !prev[data[index].filedCode],
          }));
          if (rowSelection[data[index].filedCode]) {
            removeList(data[index]).then(() => { });
          } else {
            addList(data[index]).then(() => { });
          }
        }
      } else {
        let from_index = parseInt(rowIndex);
        let to_index = rowId.index;
        for (let index = from_index + 1; index <= to_index; index++) {
          setRowSelection((prev) => ({
            ...prev,
            [data[index].filedCode]: !prev[data[index].filedCode],
          }));
          if (rowSelection[data[index].filedCode]) {
            removeList(data[index]).then(() => { });
          } else {
            addList(data[index]).then(() => { });
          }
        }
      }
    }
  };

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

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

  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
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
                        value={UserData?.city?.split(",")[0]}
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : isTablet
                    ? "1fr 1fr"
                    : "1fr 1fr 1fr",
                gap: 2,
                mt: 2,
              }}
            >
              <FilterInput
                label="استان‌ها"
                options={provinces}
                value={provincesName}
                onChange={(event, newValue) => setProvincesName(newValue)}
                placeholder="استان‌های محل تحصیل."
                multiple={true}
                fullWidth
              />
              <FilterInput
                label="شهرها"
                options={cities}
                value={citiesName}
                onChange={(event, newValue) => setCitiesName(newValue)}
                placeholder="شهرهای محل تحصیل."
                multiple={true}
                fullWidth
              />
              <FilterInput
                label="دانشگاه"
                options={university}
                value={universityName}
                onChange={(event, newValue) => setUniversityName(newValue)}
                placeholder="دانشگاه مورد نظر."
                multiple={true}
                fullWidth
              />
              <FilterInput
                label="رشته"
                options={majors}
                value={fieldName}
                onChange={(event, newValue) => setFieldName(newValue)}
                placeholder="رشته مورد نظر."
                multiple={true}
                fullWidth
              />
              <FilterInput
                label="نوع دوره-دانشگاه"
                options={periods}
                value={periodsName}
                onChange={(event, newValue) => setPeriodsName(newValue)}
                placeholder="تعیین نوبت (نوع دوره و دانشگاه) مورد نظر."
                multiple={true}
                fullWidth
              />
              <FilterInput
                label="شانس قبولی"
                options={[
                  "احتمال قبولی زیاد",
                  "احتمال قبولی متوسط تا زیاد",
                  "احتمال قبولی کم تا زیاد",
                ]}
                value={acceptanceChance}
                onChange={(event, newValue) => setAcceptanceChance(newValue)}
                placeholder="احتمال قبولی"
                multiple={false}
                fullWidth
              />
              <FilterInput
                label="رشته دوم"
                options={["زبان", "هنر"]}
                value={secondField}
                onChange={(event, newValue) => setSecondField(newValue)}
                placeholder="رشته دوم"
                multiple={false}
                fullWidth
              />
              <FilterInput
                label="تعهد خدمت"
                options={["دارد", "ندارد"]}
                value={serviceCommitment}
                onChange={(event, newValue) => setServiceCommitment(newValue)}
                placeholder=""
                multiple={false}
                fullWidth
              />
              <FilterInput
                label="نحوه پذیرش"
                options={["با آزمون", "صرفا با سوابق تحصیلی"]}
                value={acceptWay}
                onChange={(event, newValue) => setAcceptWay(newValue)}
                placeholder=""
                multiple={false}
                fullWidth
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 3,
                gap: 2,
              }}
            >
              <Tooltip title="جستجو">
                <Button
                  style={{
                    background: GetButtonColor(userInfo?.data?.sex),
                    borderRadius: "25px",
                    minWidth: isMobile ? "40px" : "auto",
                    padding: isMobile ? "8px" : "10px 16px",
                  }}
                  onClick={Search}
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
              <Tooltip title="افزودن لیست منتخب">
                <Button
                  style={{
                    background: GetButtonColor(userInfo?.data?.sex),
                    borderRadius: "25px",
                    minWidth: isMobile ? "40px" : "auto",
                    padding: isMobile ? "8px" : "10px 16px",
                  }}
                  onClick={special_list}
                >
                  <MdOutlinePlaylistAdd
                    color="#fff"
                    size={isMobile ? 16 : 18}
                  />
                  {!isMobile && (
                    <span style={{ marginRight: "8px" }}>افزودن</span>
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
              data={data || []}
              enableSorting={true}
              enableDensityToggle={false}
              style={{ direction: "rtl", width: "100%" }}
              muiTableHeadCellFilterTextFieldProps={{
                sx: { m: "0.5rem 0", width: "100%" },
              }}
              // muiTableProps={{
              //   sx: {
              //     tableLayout: isMobile ? "auto" : "fixed",
              //     minWidth: isMobile ? "300px" : "100%",
              //   },
              // }}
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
                rowsPerPageOptions: [10, 50, 100],
              }}
              muiTableBodyRowDragHandleProps={({ table }) => ({
                onDragEnd: () => {
                  const { draggingRow, hoveredRow } = table.getState();
                  if (hoveredRow && draggingRow) {
                    data.splice(
                      hoveredRow.index,
                      0,
                      data.splice(draggingRow.index, 1)[0]
                    );
                    setData([...data]);
                  }
                },
              })}
              getRowId={(row) => row.filedCode}
              onRowSelectionChange={setRowSelection}
              muiTableBodyRowProps={({ row }) => {
                return {
                  onClick: (event) => handleRowClick(row, event.shiftKey),
                  selected: rowSelection[row.id],
                  sx: {
                    cursor: "pointer",
                  },
                };
              }}
              state={{ rowSelection }}
              localization={MRT_Localization_FA}
              enableStickyHeader
              muiTableContainerProps={{
                sx: {
                  maxHeight: "350px",
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

export default GLFieldPickTable;
