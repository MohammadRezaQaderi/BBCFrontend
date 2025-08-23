import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  createTheme,
  ThemeProvider,
  Tooltip,
  Paper,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Zoom,
  Divider,
  styled,
  CircularProgress,
} from "@mui/material";
import Loader from "../../helper/Loader";
import { GetButtonColor, GetLightColor } from "../../helper/buttonColor";
import HelperInfo from "./HelperInfo";
import {
  Battery20,
  Battery50,
  BatteryFull,
  Delete as DeleteIcon,
  Favorite,
} from "@mui/icons-material";
import { motion } from "framer-motion";

import {
  Warning as WarningIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(4px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: theme.zIndex.modal + 1,
}));

const SPECIAL_LIST_LIMIT = 400;

const FPList = ({ userInfo, nextStep, stu_id }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [data, setData] = useState([]);
  const [userPFData, setUserPFData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [rowIndex, setRowIndex] = useState("");
  const [specialList, setSpecialList] = useState([]);
  const [openSpecialListModal, setOpenSpecialListModal] = useState(false);
  const baseColor = GetButtonColor(userInfo?.data?.sex);
  const lightColor = GetLightColor(userInfo?.data?.sex);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHoshmand, setIsHoshmand] = useState(false);
  const [hoshmandLoading, setHoshmandLoading] = useState(false);
  const [under400, setUnder400] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const thankYouVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const descriptionContent = (
    <HelperInfo
      userInfo={userInfo}
      title="راهنمای لیست رشته‌ها"
      content={[
        "در این صفحه با توجه به اولویت شما در مراحل قبل، لیست رشته‌های موجود، به ترتیب پیشنهادی، به شما نمایش داده شده است. در این صفحه می توانید به دو روش لیست منتخب نهایی 400تایی خود را تولید کنید: 1- به صورت دستی: با کلیک بر روی کدرشته‌های مد نظر و زدن دکمه «اضافه به لیست منتخب کاربر» و در نهایت کلیک بر روی دکمه ذخیره تغییرات 2- به صورت هوشمند: با کلیک بر روی دکمه «چینش نهایی توسط پروفسور»",
      ]}
      secondTitle={"نکات مهم مشاوره‌ای"}
      additionalTips={[
        "چه زمانی باید از چینش دستی استفاده کنم؟ هنگامی که از این سامانه در کنار یک مشاور در حال استفاده هستید و یا آگاهی کامل از عوامل اثرگذار بر چینش لیست نهایی خود دارید (مانند احتمال قبولی، ضوابط و اصول انتخاب رشته و سایر موارد) می‌توانید از قابلیت چینش دستی این سامانه استفاده کنید.",
        "در غیر اینصورت پیشنهاد می‌کنیم چینش نهایی لیست منتخب خود را بر عهده پروفسور بگذارید. ضمنا در مرحله بعد قابلیت اعمال تغییرات جزیی بر روی لیست پروفسور را هم دارید.",
        "نکته مهم: پروفسور در چینش نهایی کدرشته‌ها علاوه بر توجه به علائق و اولویت‌های شما، عامل بسیار مهم احتمال قبولی شما نسبت به رقبای همتراز را نیز در نظر می‌گیرد. بنابراین از انتخاب تعداد بیش از حد کدرشته‌هایی با احتمال قبولی کم یا متوسط جلوگیری خواهد کرد.",
        "چنانچه این اتفاق برای شما افتاد، به شما توصیه می‌کنیم یا به صورت دستی در مرحله 8 کدرشته‌هایی با احتمال قبولی بالا به لیست خود اضافه کنید یا با بازگشت به مراحل قبل، اولویت‌های خود را تغییر دهید.",
      ]}
    />
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "filedCode",
        header: "کد",
        size: 50,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "کد",
          sx: { width: "20%" },
        },
      },
      {
        accessorKey: "field",
        header: "رشته",
        size: 150,
        Cell: ({ cell }) => <span>{cell.getValue()}</span>,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "رشته",
          sx: { width: "75%", marginRight: "8px", marginLeft: "8px" },
        },
      },
      ...(userInfo?.data?.role === "stu" && userPFData?.AGAccess === 0
        ? [] : [
          {
            accessorKey: "hedayat",
            header: "تناسب",
            size: 25,
            enableColumnFilter: false,
            Cell: ({ cell }) => {
              if (cell.getValue()) {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "0 8px",
                    }}
                  >
                    {cell.getValue() === 1 && (
                      <Tooltip title="توصیه اولویت اول" arrow placement="left">
                        <BatteryFull
                          fontSize="small"
                          sx={{ color: "#4caf50", ml: 1, cursor: "pointer" }}
                        />
                      </Tooltip>
                    )}
                    {cell.getValue() === 3 && (
                      <Tooltip title="توصیه با احتیاط" arrow placement="left">
                        <Battery50
                          fontSize="small"
                          sx={{ color: "#ff9800", ml: 1, cursor: "pointer" }}
                        />
                      </Tooltip>
                    )}
                    {cell.getValue() === 2 && (
                      <Tooltip title="عدم توصیه" arrow placement="left">
                        <Battery20
                          fontSize="small"
                          sx={{ color: "#f44336", ml: 1, cursor: "pointer" }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                );
              }
              return null;
            },
            muiTableHeadCellProps: {
              align: "center",
            },
            muiTableBodyCellProps: {
              align: "center",
            },
          },
        ]),
      {
        accessorKey: "city",
        header: "استان-شهر",
        size: 80,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "استان-شهر",
          sx: { width: "75%", marginRight: "8px", marginLeft: "8px" },
        },
      },
      {
        accessorKey: "university",
        header: "دانشگاه",
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "دانشگاه",
          sx: { width: "75%", marginRight: "8px", marginLeft: "8px" },
        },
      },
      {
        accessorKey: "admission",
        header: "ترم ورودی",
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "ترم ورودی" },
        enableColumnFilter: false,
        Cell: ({ cell }) => (
          <span>{cell.getValue() === 1 ? "نیم‌سال اول" : "نیم‌سال دوم"}</span>
        ),
      },
      {
        accessorKey: "kind",
        header: "نوع پذیرش",
        size: 50,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "نوع پذیرش",
          sx: { width: "75%", marginRight: "8px", marginLeft: "8px" },
        },
      },
      {
        accessorKey: "obligation",
        header: "تعهد",
        size: 50,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "تعهد" },
        enableColumnFilter: false,
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
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "دوره",
          sx: { width: "75%", marginRight: "8px", marginLeft: "8px" },
        },
      },
      {
        accessorKey: "capacity",
        header: "ظرفیت",
        size: 50,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "ظرفیت",
          sx: { width: "75%", marginRight: "8px", marginLeft: "8px" },
        },
        enableResizing: false,
      },
      {
        accessorKey: "explain",
        header: "توضیح",
        size: 100,
        maxSize: 150,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "توضیح",
          sx: { width: "100%", marginRight: "8px", marginLeft: "8px" },
        },
        enableResizing: false,
        Cell: ({ cell }) => (
          <Tooltip
            title={cell.getValue()}
            placement="top"
            arrow
            enterDelay={500}
            enterNextDelay={500}
          >
            <Box
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              {cell.getValue()}
            </Box>
          </Tooltip>
        ),
      },
      ...(userInfo?.data?.role === "stu" && userPFData?.probability_permission === 0
        ? [] : [
          {
            accessorKey: "admissionKind",
            header: "",
            muiTableHeadCellProps: { align: "center" },
            muiTableBodyCellProps: { align: "center" },
            enableColumnFilter: false,
            size: 50,
            Cell: ({ cell }) => {
              const row = cell.getValue();
              return (
                <Tooltip
                  title={
                    row === 1
                      ? "احتمال بالا"
                      : row === 2
                        ? "احتمال متوسط"
                        : row === 3
                          ? "احتمال کم"
                          : "صرفا با سوابق"
                  }
                  arrow
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor:
                        row === 1
                          ? "#4caf50"
                          : row === 2
                            ? "#ff9800"
                            : row === 3
                              ? "#f44336"
                              : "#acacac",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {row === 1 && (
                      <CheckIcon sx={{ color: "white", fontSize: 14 }} />
                    )}
                    {row === 2 && (
                      <WarningIcon sx={{ color: "white", fontSize: 14 }} />
                    )}
                    {row === 3 && (
                      <CloseIcon sx={{ color: "white", fontSize: 14 }} />
                    )}
                  </Box>
                </Tooltip>
              );
            },
          },
        ]),
    ],
    [data, userPFData]
  );

  const get_student_info = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/hoshmand_api/select_request",
        {
          table: "users",
          method_type: "select_hoshmand_fields",
          data: {
            stu_id: parseInt(stu_id),
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setData(response.data.response.data);
        setSpecialList(response.data.response.selected_list || []);
        setIsHoshmand(response.data.response.is_hoshmand); // Set isHoshmand state
        setUserPFData(response.data.response.stu_pf_data)
      } else {
        setSnackbar({
          open: true,
          message: response.data.error,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.",
        severity: "error",
      });
    }
  };

  const handleProceedToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      nextStep();
    }, 500);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAddToSpecialList = () => {
    const selectedItems = data.filter((_, index) => rowSelection[index]);

    if (selectedItems.length === 0) {
      setSnackbar({
        open: true,
        message: "لطفاً حداقل یک ردیف را انتخاب کنید",
        severity: "warning",
      });
      return;
    }

    // Check if adding these items would exceed the limit
    const availableSpace = SPECIAL_LIST_LIMIT - specialList.length;
    if (availableSpace <= 0) {
      setSnackbar({
        open: true,
        message: `لیست منتخب شما پر است (حداکثر ${SPECIAL_LIST_LIMIT} آیتم). برای اضافه کردن باید ابتدا از لیست حذف کنید.`,
        severity: "error",
      });
      return;
    }

    // Only add up to the available space
    const itemsToAdd = selectedItems.slice(0, availableSpace);
    const newItems = itemsToAdd.filter(
      (item) =>
        !specialList.some(
          (specialItem) => specialItem.filedCode === item.filedCode
        )
    );

    const duplicateItems = itemsToAdd.filter((item) =>
      specialList.some(
        (specialItem) => specialItem.filedCode === item.filedCode
      )
    );

    if (newItems.length === 0) {
      setSnackbar({
        open: true,
        message: "تمام ردیف‌های انتخاب شده قبلاً در لیست ویژه وجود دارند",
        severity: "warning",
      });
      return;
    }

    setSpecialList([...specialList, ...newItems]);
    setData(
      data.filter(
        (item) =>
          !selectedItems.some(
            (selected) => selected.filedCode === item.filedCode
          ) || newItems.some((newItem) => newItem.filedCode === item.filedCode)
      )
    );
    setRowSelection({});

    let message = `ردیف‌های انتخاب شده به لیست ویژه اضافه شدند (${newItems.length} مورد)`;
    if (duplicateItems.length > 0) {
      message += ` (${duplicateItems.length} مورد تکراری نادیده گرفته شد)`;
    }
    if (selectedItems.length > availableSpace) {
      message += ` (${selectedItems.length - availableSpace
        } مورد اضافه نشد چون لیست پر است)`;
    }

    setSnackbar({
      open: true,
      message: message,
      severity: "success",
    });
  };

  const handleRemoveFromSpecialList = (index) => {
    const itemToRemove = specialList[index];
    setData([...data, itemToRemove]);
    setSpecialList(specialList.filter((_, i) => i !== index));
  };

  const handleHoshmandList = async () => {
    if (isHoshmand) {
      setShowThankYouModal(true);
      return;
    }
    try {
      setHoshmandLoading(true);
      const response = await axios.post(
        "https://student.baazmoon.com/hoshmand_api/select_request",
        {
          table: "users",
          method_type: "select_hoshmand_list",
          data: {
            stu_id: parseInt(stu_id),
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );

      if (response.data.tracking_code !== null) {
        setData(response.data.response.data || []);
        setSpecialList(response.data.response.selected_list || []);
        setIsHoshmand(response.data.response.is_hoshmand);
        if (response.data.response.selected_list.length < 400) {
          setUnder400(true)
        }
        setShowThankYouModal(true);
        setSnackbar({
          open: true,
          message: "لیست هوشمند با موفقیت اعمال شد",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.error || "خطا در دریافت لیست هوشمند",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.",
        severity: "error",
      });
    } finally {
      setHoshmandLoading(false);
    }
  };

  const saveSelection = async () => {
    if (specialList.length > SPECIAL_LIST_LIMIT) {
      setSnackbar({
        open: true,
        message: `لیست منتخب نمی‌تواند بیشتر از ${SPECIAL_LIST_LIMIT} آیتم باشد. لطفاً موارد را کاهش دهید.`,
        severity: "error",
      });
      return;
    }
    try {
      setSaving(true);
      const response = await axios.post(
        "https://student.baazmoon.com/hoshmand_api/update_request",
        {
          table: "users",
          method_type: "update_hoshmand_fields",
          data: {
            stu_id: parseInt(stu_id),
            token: JSON.parse(localStorage.getItem("token")),
            fields_list: data,
            selected_list: specialList,
          },
        }
      );

      if (response.data.tracking_code !== null) {
        setSnackbar({
          open: true,
          message: "تغییرات با موفقیت ذخیره شد",
          severity: "success",
        });
        // Don't automatically show thank you modal here
      } else {
        setSnackbar({
          open: true,
          message: response.data.error || "خطا در ذخیره اطلاعات",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRowClick = (rowId, shiftKeyPressed) => {
    if (!shiftKeyPressed) {
      setRowIndex(rowId.index);
      setRowSelection((prev) => ({
        ...prev,
        [rowId.index]: !prev[rowId.index],
      }));
    } else {
      if (parseInt(rowIndex) > rowId.index) {
        let from_index = rowId.index;
        let to_index = parseInt(rowIndex);
        for (let index = from_index; index < to_index; index++) {
          setRowSelection((prev) => ({
            ...prev,
            [index]: !prev[index],
          }));
        }
      } else {
        let from_index = parseInt(rowIndex);
        let to_index = rowId.index;
        for (let index = from_index + 1; index <= to_index; index++) {
          setRowSelection((prev) => ({
            ...prev,
            [index]: !prev[index],
          }));
        }
      }
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

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <>
      {(hoshmandLoading || saving) && (
        <LoadingOverlay>
          <CircularProgress
            sx={{ color: GetButtonColor(userInfo?.data?.sex) }}
            size={60}
          />
        </LoadingOverlay>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: lightColor,
              borderLeft: `4px solid ${baseColor}`,
              width: "100%",
            }}
          >
            {descriptionContent}
          </Paper>
        </div>
        <div className="d-flex justify-content-center mt-3 mb-3">
          <Tooltip title="ذخیره تغییرات">
            <Button
              style={{
                background: GetButtonColor(userInfo?.data?.sex),
                borderRadius: "25px",
                color: "white",
                marginRight: "15px",
              }}
              onClick={saveSelection}
              variant="contained"
              disabled={saving}
            >
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </Tooltip>
          <Tooltip title="اضافه کردن به لیست ویژه">
            <Button
              style={{
                background: GetButtonColor(userInfo?.data?.sex),
                borderRadius: "25px",
                color: "white",
                marginRight: "15px",
              }}
              onClick={handleAddToSpecialList}
              variant="contained"
            >
              افزودن به لیست منتخب
            </Button>
          </Tooltip>

          <Tooltip title="مشاهده لیست ویژه">
            <Button
              style={{
                background: GetButtonColor(userInfo?.data?.sex),
                borderRadius: "25px",
                color: "white",
                marginRight: "15px",
              }}
              onClick={() => setOpenSpecialListModal(true)}
              variant="contained"
            >
              مشاهده لیست منتخب ({specialList.length})
            </Button>
          </Tooltip>
          <Tooltip title="حذف هوشمند">
            <Button
              style={{
                background: GetButtonColor(userInfo?.data?.sex),
                borderRadius: "25px",
                color: "white",
                marginRight: "15px",
              }}
              onClick={handleHoshmandList}
              variant="contained"
              disabled={loading}
            >
              {loading ? "در حال پردازش..." : "چینش ال‌پروفسور"}
            </Button>
          </Tooltip>
        </div>
        <ThemeProvider theme={createTheme({ direction: "rtl" })}>
          <MaterialReactTable
            enableRowNumbers
            enableColumnActions={false}
            autoResetPageIndex={false}
            columns={columns}
            data={data || []}
            enableSorting={false}
            enableDensityToggle={false}
            initialState={{
              density: "compact",
              pagination: { pageSize: 50 },
            }}
            style={{ direction: "rtl", width: "100%" }}
            muiTableHeadCellFilterTextFieldProps={{
              sx: { m: "0.5rem 0", width: "100%" },
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
                selected: rowSelection[row.index],
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
      <Dialog
        open={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
        transitionDuration={500}
        PaperProps={{
          sx: {
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            background: "linear-gradient(to bottom, #ffffff 0%, #f5f7fa 100%)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={thankYouVariants}
          transition={{ duration: 0.6 }}
        >
          <DialogTitle sx={{ textAlign: "center", py: 4 }}>
            <Box mt={3} mb={2}>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Favorite
                  fontSize="large"
                  sx={{ color: "#e91e63", fontSize: 60 }}
                />
              </motion.div>
            </Box>
            <Typography variant="h5" component="div" gutterBottom>
              لیست هوشمند داری
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center", py: 2, width: "100%" }}>
            <Box>
              <Typography variant="body1" paragraph>
                مرسی که به من اعتماد کردی!
              </Typography>
              <Typography variant="body1" paragraph>
                با توجه به اینکه گذاشتی من برات حذف انجام بدم
              </Typography>
              <Typography variant="body1" paragraph>
                من لیست منتخبت رو بر حسب اونایی که انتخاب کرده بودی چیدم
              </Typography>
              {under400 && (
                <>
                  <Typography variant="body2" paragraph>
                    دانش آموز عزیز
                    در نظر داشته باشید پروفسور به احتمال قبولی شما در چینش لیست حساس است. با توجه به گزینه‌هایی که تاکنون انتخاب کرده‌اید، لیست شما کمتر از 150 کدرشته دارد.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    لطفا یا به صورت دستی به لیست نهایی خود کدرشته با احتمال قبولی بالا اضافه کنید یا با برگشتن به مراحل قبل و تغییر اولویت‌ها و علائق خود، لیست خود را مجددا تولید کنید.
                  </Typography>
                </>
              )}
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ justifyContent: "center", py: 3, gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleProceedToNext}
              sx={{
                minWidth: 120,
                backgroundColor: baseColor,
                "&:hover": { backgroundColor: baseColor },
              }}
              disabled={isTransitioning}
            >
              {isTransitioning ? "در حال انتقال..." : "مرحله بعد"}
            </Button>
          </DialogActions>
        </motion.div>
      </Dialog>

      {/* Special List Modal */}
      <Dialog
        open={openSpecialListModal}
        onClose={() => setOpenSpecialListModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          لیست منتخب ({specialList.length} از {SPECIAL_LIST_LIMIT} آیتم)
        </DialogTitle>
        <DialogContent>
          <ThemeProvider theme={createTheme({ direction: "rtl" })}>
            <MaterialReactTable
              enableRowNumbers
              autoResetPageIndex={false}
              columns={columns}
              data={specialList || []}
              enableDensityToggle={false}
              enableSorting={false}
              initialState={{
                density: "compact",
                pagination: { pageSize: 50 },
              }}
              style={{ direction: "rtl", width: "100%" }}
              muiTableHeadCellFilterTextFieldProps={{
                sx: { m: "0.5rem 0", width: "100%" },
              }}
              muiTableProps={{
                sx: {
                  tableLayout: isMobile ? "auto" : "fixed",
                  minWidth: isMobile ? "300px" : "100%",
                },
              }}
              muiTableContainerProps={{
                sx: {
                  maxHeight: "350px",
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
              localization={MRT_Localization_FA}
              enableRowActions
              renderRowActions={({ row }) => (
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <Button
                    color="error"
                    onClick={() => handleRemoveFromSpecialList(row.index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </Box>
              )}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSpecialListModal(false)}>بستن</Button>
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
    </>
  );
};

export default FPList;
