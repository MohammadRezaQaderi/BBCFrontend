import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  createTheme,
  IconButton,
  ThemeProvider,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  Slide,
  Fade,
  CircularProgress,
} from "@mui/material";
import { Delete as DeleteIcon, Undo as UndoIcon } from "@mui/icons-material";
import Loader from "../../helper/Loader";
import { GetButtonColor, GetLightColor } from "../../helper/buttonColor";
import HelperInfo from "./HelperInfo";
import FilterInput from "../../helper/FilterInput/FilterInput";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { font } from "../404/font";
import imgData from "../../assets/images/logo.png";
import {
  Battery20,
  Battery50,
  BatteryFull,
  Favorite,
} from "@mui/icons-material";

import {
  Warning as WarningIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

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

const SELECTED_LIST_LIMIT = 150;

const SPList = ({ userInfo, nextStep, stu_id }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowIndex, setRowIndex] = useState("");
  const baseColor = GetButtonColor(userInfo?.data?.sex);
  const lightColor = GetLightColor(userInfo?.data?.sex);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [targetPosition, setTargetPosition] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loadingSearchTable, setLoadingSearchTable] = useState(false);

  const [trashList, setTrashList] = useState([]);
  const [openTrashModal, setOpenTrashModal] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);

  // Search filter states
  const [provinces, setProvinces] = useState([]);
  const [provincesName, setProvincesName] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesName, setCitiesName] = useState([]);
  const [university, setUniversity] = useState([]);
  const [universityName, setUniversityName] = useState([]);
  const [majors, setMajors] = useState([]);
  const [fieldName, setFieldName] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [periodsName, setPeriodsName] = useState([]);
  const [acceptWay, setAcceptWay] = useState("");
  const [acceptanceChance, setAcceptanceChance] = useState("");
  const [serviceCommitment, setServiceCommitment] = useState("");
  const [secondField, setSecondField] = useState("");
  const [userData, setUserData] = useState({});
  const [searchModalRowSelection, setSearchModalRowSelection] = useState({});
  const [searchModalData, setSearchModalData] = useState([]);

  const descriptionContent = (
    <HelperInfo
      userInfo={userInfo}
      title="راهنمایی"
      content={[
        `در این صفحه می‌توانید لیست نهایی خود را مشاهده و تغییرات مد نظرتان را بر آن اعمال کنید. با کلیک بر روی چند کدرشته می‌توانید آن‌ها به صورت یکجا جا به جا کنید. با استفاده از دکمه جست و جوی پیشرفته می‌توانید به تمامی کدرشته‌های موجود در دفترچه با کمک فیلترهای مختلف دسترسی داشته و در صورت صلاحدید آن‌ها را به انتهای لیست نهایی خود اضافه کنید. در نظر داشته باشید تعداد کد رشته‌های این صفحه نمی‌تواند فراتر از ${SELECTED_LIST_LIMIT} کدرشته باشد`,
      ]}
      secondTitle={"نکته‌ی مهم"}
      additionalTips={[
        `در صورتی که لیست نهایی پروفسور کمتر از ${SELECTED_LIST_LIMIT} کدرشته دارد به شما پیشنهاد می‌کنیم یا به صورت دستی با زدن دکمه جست و جوی پیشرفته کدرشته‌هایی با احتمال قبولی بالا به لیست خود اضافه کنید یا با بازگشت به مراحل قبل، اولویت‌های خود را تغییر دهید.`,
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
          sx: { width: "75%", marginRight: "8px", marginLeft: "8px" },
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
                width: "100%",
                textAlign: "center",
              }}
            >
              {cell.getValue()}
            </Box>
          </Tooltip>
        ),
      },
      {
        accessorKey: "admissionKind",
        header: "",
        maxSize: 25,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        enableColumnFilter: false,
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
    ],
    []
  );

  const get_student_info = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://student.baazmoon.com/hoshmand_api/select_request",
        {
          table: "users",
          method_type: "select_hoshmand_sp_list",
          data: {
            stu_id: parseInt(stu_id),
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );

      if (response.data.tracking_code !== null) {
        setData(response.data.response.selected_list || []);
        setTrashList(response.data.response.trash_list || []);
        setUserData(response.data.response.user_data || {});
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
    } finally {
      setLoading(false);
    }
  };

  const updateList = async () => {
    if (data.length > SELECTED_LIST_LIMIT) {
      setSnackbar({
        open: true,
        message: `لیست منتخب نمی‌تواند بیشتر از ${SELECTED_LIST_LIMIT} آیتم باشد. لطفاً موارد را کاهش دهید.`,
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
          method_type: "update_hoshmand_sp_list",
          data: {
            token: JSON.parse(localStorage.getItem("token")),
            selected_list: data,
            trash_list: trashList,
            stu_id: parseInt(stu_id),
          },
        }
      );

      if (response.data.tracking_code !== null) {
        setSnackbar({
          open: true,
          message: "تغییرات با موفقیت ذخیره شد",
          severity: "success",
        });
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
    } finally {
      setSaving(false);
    }
  };

  const handleMoveToTrash = (row) => {
    if (data.length <= 1) {
      setSnackbar({
        open: true,
        message: "لیست باید حداقل شامل یک آیتم باشد",
        severity: "warning",
      });
      return;
    }

    const newData = [...data];
    const [movedItem] = newData.splice(row.index, 1);
    setData(newData);
    setTrashList([...trashList, movedItem]);
    setSelectedRows((prev) => prev.filter((id) => id !== row.id));
  };

  const handleRestoreFromTrash = (row) => {
    if (data.length >= SELECTED_LIST_LIMIT) {
      setSnackbar({
        open: true,
        message: `لیست منتخب شما پر است (حداکثر ${SELECTED_LIST_LIMIT} آیتم). برای اضافه کردن باید ابتدا از لیست حذف کنید.`,
        severity: "error",
      });
      return;
    }

    const alreadyExists = data.some(
      (item) => item.filedCode === row.original.filedCode
    );

    if (alreadyExists) {
      setSnackbar({
        open: true,
        message: "این آیتم قبلاً در لیست موجود است",
        severity: "warning",
      });
      return;
    }

    const newTrashList = [...trashList];
    const [restoredItem] = newTrashList.splice(row.index, 1);
    setTrashList(newTrashList);
    setData([...data, restoredItem]);

    setSnackbar({
      open: true,
      message: "آیتم با موفقیت بازیابی شد",
      severity: "success",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const renderSearchButton = () => (
    <Tooltip title="اضافه کردن کدرشته">
      <Button
        style={{
          background: GetButtonColor(userInfo?.data?.sex),
          borderRadius: "25px",
          color: "white",
          marginRight: "15px",
        }}
        onClick={() => setOpenSearchModal(true)}
        variant="contained"
      >
        اضافه کردن کدرشته
      </Button>
    </Tooltip>
  );

  const renderSearchModal = () => (
    <Dialog
      open={openSearchModal}
      onClose={() => setOpenSearchModal(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>اضافه کردن کدرشته</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 2,
            mt: 2,
          }}
        >
          <FilterInput
            label="استان‌ها"
            options={provinces}
            value={provincesName}
            onChange={(event, newValue) => setProvincesName(newValue)}
            placeholder="استان‌های محل تحصیل"
            multiple={true}
            fullWidth
          />
          <FilterInput
            label="شهرها"
            options={cities}
            value={citiesName}
            onChange={(event, newValue) => setCitiesName(newValue)}
            placeholder="شهرهای محل تحصیل"
            multiple={true}
            fullWidth
          />
          <FilterInput
            label="دانشگاه"
            options={university}
            value={universityName}
            onChange={(event, newValue) => setUniversityName(newValue)}
            placeholder="دانشگاه مورد نظر"
            multiple={true}
            fullWidth
          />
          <FilterInput
            label="رشته"
            options={majors}
            value={fieldName}
            onChange={(event, newValue) => setFieldName(newValue)}
            placeholder="رشته مورد نظر"
            multiple={true}
            fullWidth
          />
          <FilterInput
            label="نوع دوره-دانشگاه"
            options={periods}
            value={periodsName}
            onChange={(event, newValue) => setPeriodsName(newValue)}
            placeholder="نوع دوره و دانشگاه"
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
            placeholder="تعهد خدمت"
            multiple={false}
            fullWidth
          />
          <FilterInput
            label="نحوه پذیرش"
            options={["با آزمون", "صرفا با سوابق تحصیلی"]}
            value={acceptWay}
            onChange={(event, newValue) => setAcceptWay(newValue)}
            placeholder="نحوه پذیرش"
            multiple={false}
            fullWidth
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <ThemeProvider theme={createTheme({ direction: "rtl" })}>
            <MaterialReactTable
              enableRowNumbers
              autoResetPageIndex={false}
              columns={columns}
              data={searchModalData || []}
              enableSorting={true}
              enableDensityToggle={false}
              initialState={{
                density: "compact",
                pagination: { pageSize: 50 },
              }}
              style={{ direction: "rtl", width: "100%" }}
              muiTableHeadCellFilterTextFieldProps={{
                sx: { m: "0.5rem 0", width: "100%" },
              }}
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
              getRowId={(row) => row.filedCode}
              onRowSelectionChange={setSearchModalRowSelection}
              muiTableBodyRowProps={({ row }) => {
                return {
                  onClick: (event) => {
                    if (!event.shiftKey) {
                      setSearchModalRowSelection((prev) => ({
                        ...prev,
                        [row.index]: !prev[row.index],
                      }));
                    }
                  },
                  selected: searchModalRowSelection[row.index],
                  sx: {
                    cursor: "pointer",
                  },
                };
              }}
              state={{ rowSelection: searchModalRowSelection }}
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenSearchModal(false)}>انصراف</Button>
        <Button
          onClick={search_fields}
          variant="outlined"
          color="primary"
          startIcon={<FiSearch />}
        >
          جستجو
        </Button>
        <Button
          onClick={handleAddFromSearchModal}
          variant="contained"
          color="primary"
          disabled={Object.keys(searchModalRowSelection).length === 0}
        >
          افزودن به لیست
        </Button>
      </DialogActions>
    </Dialog>
  );

  const handleMoveSelectedRows = () => {
    const position = parseInt(targetPosition);
    if (isNaN(position)) {
      setSnackbar({
        open: true,
        message: "لطفا یک عدد معتبر وارد کنید",
        severity: "warning",
      });
      return;
    }

    if (position < 1 || position > data.length) {
      setSnackbar({
        open: true,
        message: `عدد باید بین 1 تا ${data.length} باشد`,
        severity: "warning",
      });
      return;
    }

    const insertIndex = position - 1;

    const dataMap = new Map(data.map((item) => [item.filedCode, item]));

    const selectedItems = selectedRows
      .map((code) => dataMap.get(code))
      .filter((item) => item !== undefined);

    const remainingItems = data.filter(
      (item) => !selectedRows.includes(item.filedCode)
    );

    const numBefore = data.findIndex(
      (item) => item.filedCode === selectedRows[0]
    );
    const adjustedInsertIndex =
      insertIndex > numBefore
        ? insertIndex - selectedItems.length
        : insertIndex;

    remainingItems.splice(adjustedInsertIndex, 0, ...selectedItems);
    setData(remainingItems);
    setSelectedRows([]);
    setMoveDialogOpen(false);
    setTargetPosition("");
  };

  const handleRowClick = (rowId, shiftKeyPressed) => {
    if (!shiftKeyPressed) {
      setRowIndex(rowId.index);
      setSelectedRows((prev) => {
        const fieldCode = rowId.id;
        return prev.includes(fieldCode)
          ? prev.filter((id) => id !== fieldCode)
          : [...prev, fieldCode];
      });
    } else {
      if (parseInt(rowIndex) > rowId.index) {
        let from_index = rowId.index;
        let to_index = parseInt(rowIndex);
        const newSelected = [...selectedRows];

        for (let index = from_index; index < to_index; index++) {
          const fieldCode = data[index].filedCode;
          const existingIndex = newSelected.indexOf(fieldCode);
          if (existingIndex >= 0) {
            newSelected.splice(existingIndex, 1);
          } else {
            newSelected.push(fieldCode);
          }
        }

        setSelectedRows(newSelected);
      } else {
        let from_index = parseInt(rowIndex);
        let to_index = rowId.index;
        const newSelected = [...selectedRows];

        for (let index = from_index + 1; index <= to_index; index++) {
          const fieldCode = data[index].filedCode;
          const existingIndex = newSelected.indexOf(fieldCode);
          if (existingIndex >= 0) {
            newSelected.splice(existingIndex, 1);
          } else {
            newSelected.push(fieldCode);
          }
        }

        setSelectedRows(newSelected);
      }
    }
  };

  const handleSaveChanges = () => {
    updateList();
  };

  const exportPDF = () => {
    setPdfProgress(0);
    setPdfLoading(true);

    const doc = new jsPDF("portrait", "pt", "a4");
    doc.addFileToVFS("IRANSansWeb-normal.ttf", font);
    doc.addFont("IRANSansWeb-normal.ttf", "IRANSansWeb", "normal");
    doc.setFont("IRANSansWeb");

    doc.setFontSize(14);
    doc.text(`نام: ${userData?.first_name} ${userData?.last_name}`, 400, 40, {
      align: "right",
    });

    const image =
      userInfo?.data?.pic === null
        ? imgData
        : `https://student.baazmoon.com/bbc_api/get_user_pic/${userInfo?.data?.pic}`;
    doc.addImage(image, "PNG", 50, 40, 80, 80);

    const interval = setInterval(() => {
      setPdfProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);

          const headers = columns.map((col) => col.header);
          const dataPdf = data.map((item) =>
            columns.map((col) => {
              const value = item[col.accessorKey];
              if (col.Cell)
                return col.Cell({ cell: { getValue: () => value } });
              return value;
            })
          );

          doc.autoTable({
            head: [headers],
            body: dataPdf,
            startY: 140,
            styles: { font: "IRANSansWeb", fontSize: 10, halign: "center" },
            headStyles: {
              fillColor: [40, 53, 147],
              textColor: [255, 255, 255],
            },
          });

          setTimeout(() => {
            doc.save(`${userData?.first_name} ${userData?.last_name}.pdf`);
            setPdfLoading(false);
          }, 500);

          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  // Search related functions
  const fp_provinces = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "fp_provinces",
          data: {
            stu_id: parseInt(stu_id),
            sex: userData?.sex,
            nativeProvince: userData?.city?.split(",")[0],
            field: userData?.field,
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
          message: response.data.error,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت استان‌ها",
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
            stu_id: parseInt(stu_id),
            provinces: provincesName,
            sex: userData?.sex,
            nativeProvince: userData?.city?.split(",")[0],
            field: userData?.field,
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
          message: response.data.error,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت شهرها",
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
            stu_id: parseInt(stu_id),
            provinces: provincesName,
            cities: citiesName,
            sex: userData?.sex,
            nativeProvince: userData?.city?.split(",")[0],
            field: userData?.field,
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
          message: response.data.error,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت دانشگاه‌ها",
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
            stu_id: parseInt(stu_id),
            provinces: provincesName,
            cities: citiesName,
            universityName: universityName,
            sex: userData?.sex,
            nativeProvince: userData?.city?.split(",")[0],
            field: userData?.field,
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
          message: response.data.error,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت رشته‌ها",
        severity: "error",
      });
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
            stu_id: parseInt(stu_id),
            provinces: provincesName,
            cities: citiesName,
            universityName: universityName,
            majors: fieldName,
            sex: userData?.sex,
            nativeProvince: userData?.city?.split(",")[0],
            field: userData?.field,
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
          message: response.data.error,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت نوع دوره‌ها",
        severity: "error",
      });
    }
  };

  const search_fields = async () => {
    try {
      setLoadingSearchTable(true);
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_fieldpick_api/select_request",
        {
          table: "users",
          method_type: "fp_search_fields",
          data: {
            stu_id: parseInt(stu_id),
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
            sex: userData?.sex,
            nativeProvince: userData?.city?.split(",")[0],
            rank_in_all: userData?.rank,
            quota: userData?.quota,
            field: userData?.field,
            secondField:
              secondField === "زبان" ? 4 : secondField === "هنر" ? 5 : "NULL",
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setSearchModalData(response.data.response);
        setSearchModalRowSelection({});
        setSnackbar({
          open: true,
          message: "نتایج جستجو با موفقیت دریافت شد",
          severity: "success",
        });
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
        message: "خطا در جستجو",
        severity: "error",
      });
    } finally {
      setLoadingSearchTable(false);
    }
  };

  const handleAddFromSearchModal = () => {
    const selectedItems = searchModalData.filter(
      (_, index) => searchModalRowSelection[index]
    );

    if (selectedItems.length === 0) {
      setSnackbar({
        open: true,
        message: "لطفاً حداقل یک ردیف را انتخاب کنید",
        severity: "warning",
      });
      return;
    }

    // Check if adding these items would exceed the limit
    const availableSpace = SELECTED_LIST_LIMIT - data.length;
    if (availableSpace <= 0) {
      setSnackbar({
        open: true,
        message: `لیست منتخب شما پر است (حداکثر ${SELECTED_LIST_LIMIT} آیتم). برای اضافه کردن باید ابتدا از لیست حذف کنید.`,
        severity: "error",
      });
      return;
    }

    // Only add up to the available space
    const itemsToAdd = selectedItems.slice(0, availableSpace);
    const newItems = itemsToAdd.filter(
      (item) => !data.some((existing) => existing.filedCode === item.filedCode)
    );

    const duplicateItems = itemsToAdd.filter((item) =>
      data.some((existing) => existing.filedCode === item.filedCode)
    );

    if (newItems.length === 0) {
      setSnackbar({
        open: true,
        message: "تمام ردیف‌های انتخاب شده قبلاً در لیست وجود دارند",
        severity: "warning",
      });
      return;
    }

    setData([...data, ...newItems]);
    setSearchModalData(
      searchModalData.filter((_, index) => !searchModalRowSelection[index])
    );
    setSearchModalRowSelection({});

    let message = `ردیف‌های انتخاب شده به لیست اضافه شدند (${newItems.length} مورد)`;
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

  useEffect(() => {
    if (userInfo?.data?.user_id === undefined) {
      navigate("/signin");
    } else {
      get_student_info();
    }
  }, [userInfo]);

  // Effects for search filters
  useEffect(() => {
    if (openSearchModal) {
      fp_provinces();
    }
  }, [openSearchModal, userData]);

  useEffect(() => {
    if (openSearchModal) {
      fp_cities();
    }
  }, [provincesName, userData, openSearchModal]);

  useEffect(() => {
    if (openSearchModal) {
      fp_universities();
    }
  }, [citiesName, provincesName, userData, openSearchModal]);

  useEffect(() => {
    if (openSearchModal) {
      fp_majors();
    }
  }, [universityName, citiesName, provincesName, userData, openSearchModal]);

  useEffect(() => {
    if (openSearchModal) {
      fp_exam_types();
    }
  }, [fieldName, universityName, citiesName, provincesName, userData, openSearchModal]);

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <>
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
              onClick={handleSaveChanges}
              disabled={saving}
              variant="contained"
            >
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </Tooltip>
          <Tooltip title="کدرشته‌های حذف شده">
            <Button
              style={{
                background: GetButtonColor(userInfo?.data?.sex),
                borderRadius: "25px",
                color: "white",
                marginRight: "15px",
              }}
              onClick={() => setOpenTrashModal(true)}
              variant="contained"
            >
              کدرشته‌های حذف شده ({trashList.length})
            </Button>
          </Tooltip>
          <Tooltip title="خروجی PDF">
            <Button
              style={{
                background: GetButtonColor(userInfo?.data?.sex),
                borderRadius: "25px",
                color: "white",
                marginRight: "15px",
              }}
              onClick={exportPDF}
              variant="contained"
            >
              خروجی PDF
            </Button>
          </Tooltip>
          {renderSearchButton()}
        </div>
        <ThemeProvider theme={createTheme({ direction: "rtl" })}>
          <MaterialReactTable
            enableRowNumbers
            enableColumnActions={false}
            autoResetPageIndex={false}
            columns={columns}
            data={data || []}
            enableSorting={false}
            enableRowOrdering
            onColumnVisibilityChange={setColumnVisibility}
            enableDensityToggle={false}
            style={{ direction: "rtl", width: "100%" }}
            initialState={{
              density: "compact",
              pagination: { pageSize: 50 },
            }}
            muiTableHeadCellFilterTextFieldProps={{
              sx: {
                m: "0.5rem 0",
                width: "100%",
              },
            }}
            muiTableProps={{
              sx: {
                tableLayout: isMobile ? "auto" : "fixed",
                minWidth: isMobile ? "300px" : "100%",
              },
            }}
            muiTableBodyCellProps={({ row }) => {
              return {
                sx: {
                  fontWeight: "normal",
                  fontSize: "10px",
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
            displayColumnDefOptions={{
              "mrt-row-select": {
                size: 0,
                header: () => null,
                Cell: () => null,
              },
            }}
            onRowSelectionChange={setSelectedRows}
            state={{
              selectedRows,
              columnVisibility: columnVisibility,
            }}
            muiTableBodyRowProps={({ row }) => ({
              onClick: (event) => handleRowClick(row, event.shiftKey),
              selected: selectedRows.includes(row.id),
              sx: {
                cursor: "pointer",
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
                {selectedRows.length > 0 && (
                  <Button
                    color="primary"
                    style={{
                      background: "#4CAF50",
                      color: "white",
                      borderRadius: "25px",
                      marginRight: "15px",
                    }}
                    onClick={() => setMoveDialogOpen(true)}
                    variant="contained"
                  >
                    انتقال انتخاب شده‌ها ({selectedRows.length})
                  </Button>
                )}
              </Box>
            )}
            enableRowActions
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: "flex", gap: "8px" }}>
                <Tooltip title="حذف به سطل زباله">
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (data.length > 1) {
                        handleMoveToTrash(row);
                      } else {
                        setSnackbar({
                          open: true,
                          message: "لیست باید حداقل شامل یک آیتم باشد",
                          severity: "warning",
                        });
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            localization={MRT_Localization_FA}
            enableStickyHeader
            muiTableContainerProps={{
              sx: {
                maxHeight: "350px",
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
        <Dialog
          open={openTrashModal}
          onClose={() => setOpenTrashModal(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>سطل زباله ({trashList.length} آیتم)</DialogTitle>
          <DialogContent>
            <ThemeProvider theme={createTheme({ direction: "rtl" })}>
              <MaterialReactTable
                enableRowNumbers
                columns={columns}
                enableRowActions
                autoResetPageIndex={false}
                enableSorting={true}
                enableDensityToggle={false}
                data={trashList || []}
                getRowId={(row) => row.filedCode}
                initialState={{
                  density: "compact",
                  pagination: { pageSize: 50 },
                }}
                style={{ direction: "rtl", width: "100%" }}
                muiTableHeadCellFilterTextFieldProps={{
                  sx: { m: "0.5rem 0", width: "100%" },
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
                muiTableProps={{
                  sx: {
                    tableLayout: isMobile ? "auto" : "fixed",
                    minWidth: isMobile ? "300px" : "100%",
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
                renderRowActions={({ row }) => (
                  <Box sx={{ display: "flex", gap: "1rem" }}>
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreFromTrash(row);
                      }}
                    >
                      <UndoIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
                localization={MRT_Localization_FA}
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTrashModal(false)}>بستن</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={moveDialogOpen}
          onClose={() => setMoveDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Slide}
          transitionDuration={300}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              overflow: "hidden",
              background:
                "linear-gradient(to bottom, #ffffff 0%, #f5f7fa 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              py: 3,
              position: "relative",
              backgroundColor: "#f8f9fa",
              borderBottom: `1px solid ${lightColor}`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                height: "4px",
                background: `linear-gradient(to right, ${baseColor}, ${lightColor})`,
              }}
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              انتقال ردیف‌های انتخاب شده
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ py: 3, textAlign: "center" }}>
            <Box
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                border: `1px solid ${lightColor}`,
              }}
            >
              <Typography variant="body1" sx={{ mb: 1 }}>
                <span style={{ fontWeight: 600, color: baseColor }}>
                  {selectedRows.length} ردیف
                </span>{" "}
                انتخاب شده‌اند
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                به کدام ردیف منتقل شوند؟
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  (بین 1 تا {data.length})
                </Typography>
                <input
                  type="number"
                  value={targetPosition}
                  onChange={(e) => {
                    const value = Math.min(
                      Math.max(1, parseInt(e.target.value) || 1),
                      data.length
                    );
                    setTargetPosition(value);
                  }}
                  min="1"
                  max={data.length}
                  style={{
                    width: "80px",
                    padding: "10px",
                    textAlign: "center",
                    border: `2px solid ${lightColor}`,
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none",
                    transition: "all 0.3s",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  onFocus={(e) => {
                    e.target.select();
                    e.target.style.borderColor = baseColor;
                    e.target.style.boxShadow = `0 0 0 2px ${lightColor}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = lightColor;
                    e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                  autoFocus
                />
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="textSecondary">
                ردیف‌های انتخاب شده به موقعیت وارد شده منتقل خواهند شد
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{ justifyContent: "center", pb: 3, px: 3, gap: 2 }}
          >
            <Button
              onClick={() => setMoveDialogOpen(false)}
              variant="outlined"
              sx={{
                minWidth: 120,
                borderRadius: "8px",
                borderColor: "#e0e0e0",
                "&:hover": {
                  borderColor: "#bdbdbd",
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              انصراف
            </Button>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleMoveSelectedRows}
                variant="contained"
                sx={{
                  minWidth: 120,
                  borderRadius: "8px",
                  backgroundColor: baseColor,
                  "&:hover": {
                    backgroundColor: baseColor,
                    opacity: 0.9,
                  },
                }}
              >
                انتقال
              </Button>
            </motion.div>
          </DialogActions>
        </Dialog>
      </div>
      {renderSearchModal()}
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
            <ProgressText>
              {Math.min(100, Math.round(pdfProgress))}%
            </ProgressText>
          </ProgressContainer>
        </ProgressOverlay>
      </Fade>
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

export default SPList;
