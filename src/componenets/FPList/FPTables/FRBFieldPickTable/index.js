import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import {
  Alert, Avatar, Box, Button, Snackbar, Tooltip,
  IconButton,
  Collapse,
  Divider,
  Typography, Grid,
  useMediaQuery,
  useTheme,
  styled,
  CircularProgress
} from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { MdFormatListNumbered } from "react-icons/md";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { ConvertField, ConvertQuota } from "../../../../helper/FieldCheck";
import Loader from "../../../../helper/Loader";
import FilterInput from "../../../../helper/FilterInput/FilterInput";
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

const FRBFieldPickTable = ({ }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const { field, part, stu_id } = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [rowIndex, setRowIndex] = useState("");
  const [majors, setMajors] = useState([]);
  const [fieldName, setFieldName] = useState([]);
  const [university, setUniversity] = useState([]);
  const [universityName, setUniversityName] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [provincesName, setProvincesName] = useState([]);
  const [dorm, setDorm] = useState("");
  const [UserData, setUserData] = useState({});
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

  const columns = useMemo(
    () => [
      {
        accessorKey: "city",
        header: "استان",
        size: 80,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "استان" },
      },
      {
        accessorKey: "university",
        header: "واحد",
        size: 80,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "واحد" },
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
      },
      {
        accessorKey: "filedCode",
        header: "کد رشته-واحد",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "کد رشته" },
      },
      {
        accessorKey: "sex",
        header: "پذیرش",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "پذیرش" },
        Cell: ({ cell }) => {
          const row = cell?.getValue();
          return <span>{row === 3 ? "زن/مرد" : row === 1 ? "مرد" : "زن"}</span>;
        },
      },
      {
        accessorKey: "dorm",
        header: "خوابگاه",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "خوابگاه" },
        Cell: ({ cell }) => {
          const row = cell?.getValue();
          return <span>{row === 0 ? "ندارد" : "دارد"}</span>;
        },
      },
    ],
    []
  );

  const get_student_info = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_student_field_info",
          data: {
            kind: "FR",
            stu_id: parseInt(stu_id),
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

  const update_spfrb_list = async () => {
    if (specialList?.length > 150) {
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
            method_type: "update_spfrb_list",
            data: {
              stu_id: parseInt(stu_id),
              field: parseInt(field),
              part: parseInt(part),
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

  const select_spfrb_list = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "select_spfrb_list",
          data: {
            stu_id: parseInt(stu_id),
            field: parseInt(field),
            part: parseInt(part),
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

  const frb_search_fields = async () => {
    try {
      setSearchLoading(true)
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "frb_search_fields",
          data: {
            stu_id: parseInt(stu_id),
            provinces: provincesName,
            universityName: universityName,
            fieldName: fieldName,
            sex: UserData?.sex,
            rank_in_all: UserData?.rank,
            field: parseInt(field),
            secondField: "NULL",
            partTime: parseInt(part),
            Dorm:
              dorm === "ندارد"
                ? 0
                : dorm === "دارد"
                  ? UserData?.sex === 1
                    ? 1
                    : UserData?.sex === 2
                      ? 2
                      : 3
                  : 4,
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
    }
  };

  const frb_majors = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "frb_majors",
          data: {
            stu_id: parseInt(stu_id),
            provinces: provincesName,
            universityName: universityName,
            sex: UserData?.sex,
            field: parseInt(field),
            secondField: "NULL",
            partTime: parseInt(part),
            Dorm:
              dorm === "ندارد"
                ? 0
                : dorm === "دارد"
                  ? UserData?.sex === 1
                    ? 1
                    : UserData?.sex === 2
                      ? 2
                      : 3
                  : 4,
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

  const frb_universities = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "frb_universities",
          data: {
            stu_id: parseInt(stu_id),
            provinces: provincesName,
            sex: UserData?.sex,
            field: parseInt(field),
            secondField: "NULL",
            partTime: parseInt(part),
            Dorm:
              dorm === "ندارد"
                ? 0
                : dorm === "دارد"
                  ? UserData?.sex === 1
                    ? 1
                    : UserData?.sex === 2
                      ? 2
                      : 3
                  : 4,
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

  const frb_provinces = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "frb_provinces",
          data: {
            stu_id: parseInt(stu_id),
            sex: UserData?.sex,
            field: parseInt(field),
            secondField: "NULL",
            partTime: parseInt(part),
            Dorm:
              dorm === "ندارد"
                ? 0
                : dorm === "دارد"
                  ? UserData?.sex === 1
                    ? 1
                    : UserData?.sex === 2
                      ? 2
                      : 3
                  : 4,
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
      frb_provinces().then(() => { });
    }
  }, [UserData, dorm]);

  useEffect(() => {
    if (Object.keys(UserData).length !== 0) {
      frb_universities().then(() => { });
    }
  }, [provincesName, UserData, dorm]);

  useEffect(() => {
    if (Object.keys(UserData).length !== 0) {
      frb_majors().then(() => { });
    }
  }, [universityName, provincesName, UserData, dorm]);

  const Search = () => {
    if (Object.keys(UserData).length !== 0) {
      frb_search_fields().then(() => {
        select_spfrb_list().then(() => {
          setSearchLoading(false);
        });
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
      setSearchLoading(true);
      check_added_to_list().then((equal) => {
        update_spfrb_list().then(() => {
          select_spfrb_list().then(() => {
            if (equal > 0) {
              setSnackbar({
                open: true,
                message: `${equal} ردیف شما تکراری بود`,
                severity: "warning",
              });
            }
            setSearchLoading(false);
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
      }}
      style={{
        width: isMobile ? "100%" : isTablet ? "100%" : "100%",
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
                    {/* <Typography variant="caption" color="textSecondary">
                      {`انتخاب رشته آزاد‌ سوابق ${parseInt(part) === 1 ? "پاره وقت" : "تمام وقت"
                        }`}

                    </Typography> */}
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
              />
              <FilterInput
                label="نام واحد"
                options={university}
                value={universityName}
                onChange={(event, newValue) => setUniversityName(newValue)}
                placeholder="واحد‌های محل تحصیل."
                multiple={true}
              />
              <FilterInput
                label="رشته"
                options={majors}
                value={fieldName}
                onChange={(event, newValue) => setFieldName(newValue)}
                placeholder="رشته مورد نظر."
                multiple={true}
              />
              <FilterInput
                label="خوابگاه"
                options={["دارد", "ندارد"]}
                value={dorm}
                onChange={(event, newValue) => setDorm(newValue)}
                placeholder="خوابگاه"
                multiple={false}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 3,
                gap: 2,
              }}>
              <Tooltip title="جستجو">
                <Button
                  style={{
                    background: GetButtonColor(userInfo?.data?.sex),
                    borderRadius: "25px",
                    minWidth: isMobile ? "40px" : "auto",
                    padding: isMobile ? "8px" : "10px 16px",
                  }}
                  onClick={() => Search()}
                >
                  <FiSearch color="#fff" size={isMobile ? 16 : 18} />
                  {!isMobile && (
                    <span style={{ marginRight: "8px" }}>جستجو</span>
                  )}
                </Button>
              </Tooltip>
              <Tooltip title="لیست منتخب">
                <Button
                  style={{
                    background: GetButtonColor(userInfo?.data?.sex),
                    borderRadius: "25px",
                    minWidth: isMobile ? "40px" : "auto",
                    padding: isMobile ? "8px" : "10px 16px",
                  }}
                  onClick={() => navigate("/spfrb/" + stu_id + "/" + field + "/" + part)}
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
              <Tooltip title="افزودن به لیست منتخب">
                <Button
                  style={{
                    background: GetButtonColor(userInfo?.data?.sex),
                    borderRadius: "25px",
                    minWidth: isMobile ? "40px" : "auto",
                    padding: isMobile ? "8px" : "10px 16px",
                  }}
                  onClick={() => special_list()}
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
              style={{ direction: "rtl" }}
              muiTableHeadCellFilterTextFieldProps={{
                sx: {
                  m: "0.5rem 0",
                  width: "100%",
                },
              }}
              muiTableProps={{
                sx: {
                  tableLayout: "fixed",
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

export default FRBFieldPickTable;
