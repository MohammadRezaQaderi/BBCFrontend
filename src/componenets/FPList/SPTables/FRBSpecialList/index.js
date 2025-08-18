import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  createTheme,
  IconButton,
  Paper,
  Snackbar,
  ThemeProvider,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Collapse,
  Divider,
  Grid,
  styled as MuiStyled,
  CircularProgress,
  Fade,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ConvertField, ConvertQuota } from "../../../../helper/FieldCheck";
import { font } from "../../../404/font";
import imgData from "../../../../assets/images/logo.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FiSearch } from "react-icons/fi";
import { IoMdTrash } from "react-icons/io";
import { check_number } from "../../../../helper/checkInputs";
import { MdOutlineSaveAs } from "react-icons/md";
import Loader from "../../../../helper/Loader";
import styled, { keyframes } from "styled-components";
import {
  GetBackGroundColor,
  GetButtonColor,
} from "../../../../helper/buttonColor";
import ErrorState from "../../../../helper/ErrorState";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import { FaAward, FaBook, FaMapMarkerAlt, FaUser, FaVenusMars } from "react-icons/fa";

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
const FRBSpecialList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const { field, part, stu_id } = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [UserData, setUserData] = useState({});
  const [changeRow, setChangeRow] = useState("");
  const [update, setUpdate] = useState(false);
  const [deleted, setDeleted] = useState([]);
  const [trashList, setTrashList] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const warningColor = "#ff4444";
  const lightWarningColor = "#ffebee";
  const baseColor = GetButtonColor(userInfo?.data?.sex);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [expanded, setExpanded] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

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
    if (data?.length > 150) {
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
              special_list: JSON.stringify(data),
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
      } finally {
        setSearchLoading(false); // Hide loading overlay
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

  const update_trfrb_list = async () => {
    if (trashList?.length > 150) {
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
            method_type: "update_trfrb_list",
            data: {
              stu_id: parseInt(stu_id),
              field: parseInt(field),
              part: parseInt(part),
              trash_list: JSON.stringify(trashList),
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

  const select_trfrb_list = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "select_trfrb_list",
          data: {
            stu_id: parseInt(stu_id),
            field: parseInt(field),
            part: parseInt(part),
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setTrashList(response.data.response);
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
    setSearchLoading(true)
    if (Object.keys(UserData).length !== 0) {
      check_added_to_list().then(() => {
        update_trfrb_list().then(() => {
          update_spfrb_list().then(() => {
            setUpdate((perv) => !perv);
          });
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
    let new_trash = trashList;
    for (let index = 0; index < deleted.length; index++) {
      new_trash.push(deleted[index]);
    }
    setTrashList(new_trash);
  };

  const change_row_by_id = async (row_id, changed_id) => {
    let new_change = check_number(String(changed_id));
    changed_id = parseInt(new_change);
    if (changed_id < 1 || changed_id > data.length || isNaN(changed_id)) {
      setSnackbar({
        open: true,
        message: "ردیف وارد شده نامعتبر است.",
        severity: "warning",
      });
    } else {
      changed_id = changed_id - 1;
      let new_data = data;
      const element = new_data.splice(row_id, 1)[0];
      new_data.splice(changed_id, 0, element);
      setData([]);
      await new Promise((r) => setTimeout(r, 5));
      setData(new_data);
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
      setSearchLoading(true);
      select_spfrb_list().then(() => {
        select_trfrb_list().then(() => {
          setSearchLoading(false);
        });
      });
    }
  }, [UserData, update]);

  const exportPDF = () => {
    setPdfProgress(0);
    setPdfLoading(true);

    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
    const myFont = font;
    const doc = new jsPDF(orientation, unit, size);
    doc.addFileToVFS("IRANSansWeb-normal.ttf", myFont);
    doc.addFont("IRANSansWeb-normal.ttf", "IRANSansWeb", "normal");
    doc.setFont("IRANSansWeb");
    doc.setFontSize(15);

    const student = `${UserData?.first_name} ${UserData?.last_name
      }, ${ConvertField(parseInt(field))}, رتبه ${UserData?.rank}`;
    const pageWidth = doc.internal.pageSize.getWidth();

    const headers = [
      [
        "وضعیت خوابگاه",
        "جنسیت پذیرش",
        "کد رشته-واحد",
        "نام رشته",
        "نام واحد",
        "نام استان",
        "#",
      ],
    ];

    const image =
      userInfo?.data?.pic === null
        ? imgData
        : `https://student.baazmoon.com/bbc_api/get_ins_pic/${userInfo?.data?.pic}`;
    let data_pdf = data.map((elt, index) => [
      elt.dorm === 0 ? "ندارد" : "دارد",
      parseInt(elt.sex) === 3
        ? "زن/مرد"
        : parseInt(elt.sex) === 1
          ? "مرد"
          : "زن",
      elt.filedCode,
      elt.field,
      elt.university,
      elt.city,
      index + 1,
    ]);

    let content = {
      head: headers,
      body: data_pdf,
      styles: {
        font: "IRANSansWeb",
        fontStyle: "normal",
        fontSize: 5,
        halign: "center",
      },
      startY: 120,
      // headStyles: { fillColor: [239, 170, 188] },
      // alternateRowStyles: { fillColor: [231, 215, 252] },
      // tableLineColor: [110, 60, 108],
      tableLineWidth: 0.1,
    };

    doc.text(student, pageWidth - 40, 40, { align: "right" });
    doc.setFontSize(12);
    // if (UserData?.institiute_name !== "باآزمون") {
    //   const institiute = "موسسه: " + UserData?.institute_name;
    //   doc.text(institiute, pageWidth - 40, 60, { align: "right" });
    // }
    // if (UserData?.hc_name !== "") {
    //   const headConsultant = "سرمشاور: " + UserData?.hc_name;
    //   doc.text(headConsultant, pageWidth - 40, 80, { align: "right" });
    // }
    // if (UserData?.c_name !== "") {
    //   const consultant = "مشاور: " + UserData?.c_name;
    //   doc.text(consultant, pageWidth - 40, 100, { align: "right" });
    // }
    doc.addImage(image, "PNG", 20, 20, 65, 65, undefined, false);
    doc.autoTable(content);

    let progressInterval = setInterval(() => {
      setPdfProgress((prev) => {
        if (prev < 100) return prev + 10;
        clearInterval(progressInterval);
        return 100;
      });
    }, 200);

    setTimeout(() => {
      const file_name = `${UserData?.first_name} ${UserData?.last_name}.pdf`;
      doc.save(file_name);
      setPdfProgress(100);
      setTimeout(() => {
        setPdfLoading(false);
        setPdfProgress(0);
      }, 1000);
    }, 2000);

    // const file_name = UserData?.first_name + " " + UserData?.last_name + ".pdf";
    // doc.save(file_name);
    // setPdfLoading(false);
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
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  mb: 2,
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
              }}>
              <Tooltip title="اعمال تغییرات">
                <Button
                  className="fixed-button"
                  style={{
                    position: isMobile ? "fixed" : "static",
                    bottom: isMobile ? "50px" : "auto",
                    left: isMobile ? "30px" : "auto",
                    zIndex: 1000,
                    background: GetButtonColor(userInfo?.data?.sex),
                    borderRadius: "25px",
                    minWidth: isMobile ? "40px" : "auto",
                    padding: isMobile ? "8px" : "10px 16px",
                  }}
                  onClick={() => update_table()}
                >
                  <MdOutlineSaveAs color="#fff" size={isMobile ? 16 : 18} />
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
                  }}
                  onClick={() => navigate("/pffrb/" + stu_id + "/" + field + "/" + part)}
                >
                  <FiSearch color="#fff" size={isMobile ? 16 : 18} />
                  {!isMobile && (
                    <span style={{ marginRight: "8px" }}>صفحه جستجو</span>
                  )}
                </Button>
              </Tooltip>
              <Tooltip title="سطل آشغال">
                <Button
                  style={{
                    background: GetButtonColor(userInfo?.data?.sex),
                    borderRadius: "25px",
                    minWidth: isMobile ? "40px" : "auto",
                    padding: isMobile ? "8px" : "10px 16px",
                  }}
                  onClick={() => navigate("/trfrb/" + stu_id + "/" + field + "/" + part)}
                >
                  <IoMdTrash color="#fff" size={isMobile ? 16 : 18} />
                  {!isMobile && (
                    <span style={{ marginRight: "8px" }}>سطل آشغال</span>
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
              enableRowOrdering
              enableDensityToggle={false}
              initialState={{
                density: "compact",
                pagination: { pageSize: 50 },
              }}
              style={{ direction: "rtl", width: "100%" }}
              muiTableProps={{
                sx: {
                  tableLayout: isMobile ? "auto" : "fixed",
                  minWidth: isMobile ? "300px" : "100%",
                },
              }}
              muiTableHeadCellProps={{
                sx: {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "normal",
                  fontSize: "14px",
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
              renderTopToolbarCustomActions={({ table }) => (
                <Box
                  sx={{
                    display: "flex",
                    gap: "1rem",
                    p: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    color="primary"
                    style={{
                      background: GetButtonColor(userInfo?.data?.sex),
                      borderRadius: "25px",
                      marginRight: "15px",
                    }}
                    onClick={() => exportPDF()}
                    startIcon={<FileDownloadIcon />}
                    variant="contained"
                  >
                    اطلاعات پی دی اف
                  </Button>
                </Box>
              )}
              enableRowActions
              renderRowActions={({ row, table }) => (
                <Box
                  sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}
                >
                  <IconButton
                    color="error"
                    onClick={() => {
                      deleted.push(data[row.index]);
                      data.splice(row.index, 1);
                      setData([...data]);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <input
                    style={{
                      fontSize: "10px",
                      minWidth: "15px",
                      textAlign: "center",
                    }}
                    placeholder={"ردیف"}
                    onChange={(e) => setChangeRow(e.target.value)}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter") {
                        change_row_by_id(row.index, changeRow).then(
                          () => { }
                        );
                      }
                    }}
                  ></input>
                </Box>
              )}
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
      <Fade in={pdfLoading} timeout={300}>
        <ProgressOverlay>
          <ProgressContainer>
            <CircularProgress
              size={60}
              thickness={4}
              style={{ color: baseColor }}
            />
            <ProgressText>در حال آماده‌سازی فایل PDF</ProgressText>
            <ProgressBar>
              <ProgressFill progress={pdfProgress} color={baseColor} />
            </ProgressBar>
            <ProgressText>{Math.min(100, Math.round(pdfProgress))}%</ProgressText>
          </ProgressContainer>
        </ProgressOverlay>
      </Fade>
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
      <style jsx global>{`
        .fixed-button {
          position: fixed;
          bottom: 150px;
          left: 30px;
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default FRBSpecialList;
