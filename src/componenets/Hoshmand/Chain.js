import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Modal,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Close as ErrorIcon,
  School as SchoolIcon,
  AccountBalance as AccountBalanceIcon,
  MenuBook as MenuBookIcon,
  ChevronLeft as ChevronLeftIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  SwapVert as SwapIcon,
  Circle as Circle,
} from "@mui/icons-material";
import { ListItemAvatar, Tooltip } from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GetButtonColor, GetLightColor } from "../../helper/buttonColor";
import { keyframes } from "@mui/system";
import axios from "axios";
import Loader from "../../helper/Loader";
import HistoryIcon from "@mui/icons-material/History";
import ReplayIcon from "@mui/icons-material/Replay";
import HelperInfo from "./HelperInfo";
import { sha256 } from "js-sha256";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1); }
  70% { box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Chain = ({ userInfo, nextStep }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const baseColor = GetButtonColor(userInfo?.data?.sex);
  const lightColor = GetLightColor(userInfo?.data?.sex);
  const [chains, setChains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [expandedChain, setExpandedChain] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentChainIndex, setCurrentChainIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [swapChainId, setSwapChainId] = useState(null);
  const [showSwapConfirm, setShowSwapConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chainToDelete, setChainToDelete] = useState(null);
  const [deletedChains, setDeletedChains] = useState([]);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [targetPosition, setTargetPosition] = useState("");
  const [chainToMove, setChainToMove] = useState(null);
  const [showDeletedChainsModal, setShowDeletedChainsModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [initialHash, setInitialHash] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const generateHash = (data) => {
    return sha256(JSON.stringify(data));
  };

  const descriptionContent = (
    <HelperInfo
      userInfo={userInfo}
      title="راهنمایی"
      secondTitle={"نکات مهم مشاوره‌ای:"}
      content={["دانش آموز عزیز در این مرحله با توجه به انتخاب‌های قبلی شما، به صورت هوشمند زنجیره‌هایی متشکل از رشته-دانشگاه-دوره تولید شده است که می‌توانید به صلاح دید خود، آن‌ها را حذف و یا با هم جا به جا کنید."]}
      additionalTips={[
        "تعداد زنجیره‌های تولید شده بر اساس انتخاب‌های شما ممکن است زیاد باشد. به شما توصیه می‌کنیم تعدادی از این زنجیره‌ها که تمایل به تحصیل در آن رشته-دانشگاه-دوره‌ها ندارید را حذف کنید.",
        "با کلیک کردن بر روی عنوان رشته یا دانشگاه می‌توانید اسامی رشته‌ها و دانشگاه‌های موجود در هر زنجیره را مشاهده کنید. همچنین با کلیک بر روی آیکون چشم می‌توانید به صورت دقیق لیست کدرشته‌های موجود در هر زنجیره را به ترتیب احتمال قبولی از زیاد به کم مشاهده کنید.",
        "با کلیک بر روی آیکون فلش بالا-پایین می‌توانید جایگاه زنجیره‌ها را تغییر دهید.",
      ]}
    />
  );

  useEffect(() => {
    const fetchChains = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://student.baazmoon.com/hoshmand/select_request",
          {
            table: "users",
            method_type: "get_hoshmand_chains",
            data: {
              user_id: userInfo?.data.user_id,
              token: JSON.parse(localStorage.getItem("token")),
            },
          }
        );
        if (response.data && response.data.status === 200) {
          setTimeout(() => {
            setInitialHash(generateHash(response.data.response.chains));
          }, 0);
          const chainsWithIds = response.data.response.chains.map(
            (chain, index) => ({
              ...chain,
              id: `chain-${Date.now()}-${index}`,
              originalIndex: index,
            })
          );
          const deletedChainsWithIds =
            response.data.response.deleted_chains?.map((chain, index) => ({
              ...chain,
              id: `deleted-chain-${Date.now()}-${index}`,
              originalIndex: index,
            })) || [];

          setChains(chainsWithIds);
          setDeletedChains(deletedChainsWithIds);
          setLoading(false);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "خطا در دریافت اطلاعات زنجیره",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChains();
  }, [userInfo?.data?.user_id]);

  const saveChanges = async () => {
    try {
      setSaving(true);
      const chainsToSave = chains.map(({ id, originalIndex, ...rest }) => rest);
      const deletedChainsToSave = deletedChains.map(
        ({ id, originalIndex, ...rest }) => rest
      );
      const response = await axios.post(
        "https://student.baazmoon.com/hoshmand/update_request",
        {
          table: "users",
          method_type: "update_hoshmand_chains",
          data: {
            user_id: userInfo?.data.user_id,
            token: JSON.parse(localStorage.getItem("token")),
            chains: chainsToSave,
            deleted_chains: deletedChainsToSave,
            majors: "",
            universities: "",
          },
        }
      );
      if (response.data && response.data.status === 200) {
        setSnackbar({
          open: true,
          message: response.data.response.message,
          severity: "success",
        });
        nextStep();
      } else {
        setSnackbar({
          open: true,
          message: "خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در ارسال اطلاعات. لطفاً دوباره تلاش کنید.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    try {
      const chainsToSave = chains.map(({ id, originalIndex, ...rest }) => rest);
      const currentHash = generateHash(chainsToSave);
      if (currentHash !== initialHash) {
        setShowConfirmation(true);
        return;
      } else {
        nextStep();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در ارسال اطلاعات. لطفاً دوباره تلاش کنید.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenModal = (content) => {
    setModalContent(content);
    setOpenModal(true);
  };

  const handleOpenTable = async (chain, index) => {
    try {
      setTableLoading(true);
      const sortedCodes = chain["CodeReshteh"]
        .sort((a, b) => a.RowId - b.RowId)
        .map(item => item.CodeReshteh)
        .join(",");

      const response = await axios.post(
        "https://student.baazmoon.com/hoshmand/select_request",
        {
          table: "users",
          method_type: "get_hoshmand_chain_code",
          data: {
            user_id: userInfo?.data.user_id,
            token: JSON.parse(localStorage.getItem("token")),
            codes: sortedCodes,
          },
        }
      );

      if (response.data?.status === 200) {
        setTableData({
          title: `جدول کدهای ${chain.skill_category}`,
          rows: response.data.response.data,
        });
        setOpenModal(true);
      }
    } catch (err) {
      setError("Failed to fetch chain codes");
      console.error("Error fetching chain codes:", err);
    } finally {
      setTableLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalContent(null);
    setTableData(null);
  };

  const handleDeleteChain = (index) => {
    setChainToDelete(index);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteChain = () => {
    const chainToBeDeleted = chains[chainToDelete];
    setDeletedChains([...deletedChains, chainToBeDeleted]);
    setChains(chains.filter((_, i) => i !== chainToDelete));
    setShowDeleteConfirm(false);
    setSnackbar({
      open: true,
      message: "زنجیره حذف شد",
      severity: "success",
    });
  };

  const undoDeleteChain = () => {
    if (deletedChains.length > 0) {
      const lastDeleted = deletedChains[deletedChains.length - 1];
      setChains([...chains, lastDeleted]);
      setDeletedChains(deletedChains.slice(0, -1));
      setSnackbar({
        open: true,
        message: "حذف زنجیره لغو شد",
        severity: "success",
      });
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(chains);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setChains(items);
  };

  const toggleChainExpand = (index) => {
    setExpandedChain(expandedChain === index ? null : index);
  };

  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setCurrentChainIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentChainIndex(null);
  };

  const handleSwapClick = (index) => {
    setSwapChainId(chains[index].id);
    setShowSwapConfirm(true);
  };

  const confirmSwap = (targetIndex) => {
    if (swapChainId === null || targetIndex === null) return;

    const sourceIndex = chains.findIndex((chain) => chain.id === swapChainId);
    if (sourceIndex === -1 || sourceIndex === targetIndex) return;

    const newChains = [...chains];
    [newChains[sourceIndex], newChains[targetIndex]] = [
      newChains[targetIndex],
      newChains[sourceIndex],
    ];
    setChains(newChains);
    setSwapChainId(null);
    setShowSwapConfirm(false);
    setSnackbar({
      open: true,
      message: "جابجایی زنجیره‌ها با موفقیت انجام شد",
      severity: "success",
    });
  };

  const handleMoveClick = (index) => {
    setChainToMove(index);
    setShowMoveDialog(true);
  };

  const confirmMove = () => {
    if (chainToMove === null || targetPosition === "") return;

    const position = parseInt(targetPosition) - 1; // Convert to 0-based index
    if (isNaN(position) || position < 0 || position >= chains.length) {
      setSnackbar({
        open: true,
        message: "موقعیت وارد شده نامعتبر است",
        severity: "error",
      });
      return;
    }

    if (position === chainToMove) {
      setShowMoveDialog(false);
      return;
    }

    const newChains = [...chains];
    const [movedChain] = newChains.splice(chainToMove, 1);
    newChains.splice(position, 0, movedChain);

    setChains(newChains);
    setShowMoveDialog(false);
    setTargetPosition("");
    setSnackbar({
      open: true,
      message: `زنجیره به موقعیت ${position + 1} منتقل شد`,
      severity: "success",
    });
  };

  const restoreChain = (chain) => {
    setChains([...chains, chain]);
    setDeletedChains(deletedChains.filter((c) => c.id !== chain.id));
    setSnackbar({
      open: true,
      message: "زنجیره با موفقیت بازگردانی شد",
      severity: "success",
    });
  };

  const renderModalContent = () => {
    if (tableLoading) {
      return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
    }

    if (tableData) {
      return (
        <Box sx={{ p: 2 }}>
          {/* Header with stats */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              p: 2,
              backgroundColor: lightColor,
              borderRadius: 2,
              boxShadow: 1,
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                جمع کل کدها:
              </Typography>
              <Avatar
                sx={{
                  bgcolor: baseColor,
                  width: 36,
                  height: 36,
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  {tableData.rows.length}
                </Typography>
              </Avatar>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              {[
                {
                  color: "green",
                  icon: <CheckCircleIcon />,
                  label: "احتمال بالا",
                },
                {
                  color: "yellow",
                  icon: <WarningIcon />,
                  label: "احتمال متوسط",
                },
                { color: "red", icon: <ErrorIcon />, label: "احتمال کم" },

                { color: "gray", icon: <Circle />, label: "صرفا باسوابق" },
              ].map(({ color, icon, label }) => {
                const count = tableData.rows.filter((row) =>
                  color === "green"
                    ? row.admissionKind === 1
                    : color === "yellow"
                      ? row.admissionKind === 2
                      : color === "red"
                        ? row.admissionKind === 3
                        : color === "gray"
                          ? row.admissionKind === 5
                          : 0
                ).length;

                return (
                  <Paper
                    key={color}
                    elevation={2}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 1.5,
                      borderRadius: 2,
                      minWidth: 100,
                      backgroundColor:
                        color === "green"
                          ? "rgba(76, 175, 80, 0.1)"
                          : color === "yellow"
                            ? "rgba(255, 235, 59, 0.1)"
                            : color === "red"
                              ? "rgba(244, 67, 54, 0.1)"
                              : "rgba(172, 172, 172, 0.1)",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: 3,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      {React.cloneElement(icon, {
                        sx: {
                          color:
                            color === "green"
                              ? "#4caf50"
                              : color === "yellow"
                                ? "#ff9800"
                                : color === "red"
                                  ? "#f44336"
                                  : "#acacac",
                        },
                      })}
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {label}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color:
                          color === "green"
                            ? "#4caf50"
                            : color === "yellow"
                              ? "#ff9800"
                              : color === "red"
                                ? "#f44336"
                                : "#acacac",
                        fontWeight: "bold",
                      }}
                    >
                      {count}
                    </Typography>
                  </Paper>
                );
              })}
            </Box>
          </Box>

          {/* Table section */}
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: `1px solid ${theme.palette.divider}`,
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: baseColor,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                // backgroundColor: lightColor,
              }}
            >
              <SchoolIcon />
              {tableData?.title || "جدول رشته‌های انتخابی"}
            </Typography>

            <Box
              sx={{
                maxHeight: "50vh",
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  width: "8px",
                  height: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: theme.palette.grey[400],
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: theme.palette.grey[600],
                },
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: lightColor,
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    {[
                      { label: "ردیف", width: 80 },
                      { label: "کد رشته", width: 100 },
                      { label: "نام رشته", width: 200 },
                      { label: "دانشگاه", width: 200 },
                      { label: "شهر", width: 120 },
                      { label: "نوع دوره", width: 120 },
                      { label: "ظرفیت", width: 100 },
                      { label: "وضعیت", width: 100 },
                    ].map((header, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          fontWeight: "bold",
                          minWidth: header.width,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {header.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.rows.map((row, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        "&:nth-of-type(even)": {
                          backgroundColor: "#f9f9f9",
                        },
                        "&:last-child td": { border: 0 },
                        transition: "background-color 0.2s",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ fontFamily: "monospace" }}>
                        {row.filedCode}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {row.field}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {row.university}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {row.city}
                        </Box>
                      </TableCell>
                      <TableCell>{row.period}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row.capacity}
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            row.admissionKind === 1
                              ? "احتمال بالا"
                              : row.admissionKind === 2
                                ? "احتمال متوسط"
                                : row.admissionKind === 3
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
                                row.admissionKind === 1
                                  ? "#4caf50"
                                  : row.admissionKind === 2
                                    ? "#ff9800"
                                    : row.admissionKind === 3
                                      ? "#f44336"
                                      : "#acacac",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mr: 1,
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              animation: `${pulseAnimation} 2s infinite`,
                              // animation:
                              //   row.admissionKind === 1
                              //     ? `${pulseAnimation} 2s infinite`
                              //     : "none",
                            }}
                          >
                            {row.admissionKind === 1 && (
                              <CheckIcon
                                sx={{ color: "white", fontSize: 14 }}
                              />
                            )}
                            {row.admissionKind === 2 && (
                              <WarningIcon
                                sx={{ color: "white", fontSize: 14 }}
                              />
                            )}
                            {row.admissionKind === 3 && (
                              <CloseIcon
                                sx={{ color: "white", fontSize: 14 }}
                              />
                            )}
                          </Box>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
      );
    }

    // For majors/universities list modal
    return (
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
    );
  };

  if (loading && chains.length === 0) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  if (error && chains.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 2, backgroundColor: baseColor }}
        >
          دوباره تلاش کنید
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          p: isMobile ? 1 : 3,
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        {updating && <Loader color={GetButtonColor(userInfo?.data?.sex)} />}
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
        {/* Undo delete button */}
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          {deletedChains.length > 0 && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={undoDeleteChain}
              sx={{
                borderColor: baseColor,
                color: baseColor,
                marginRight: "5px",
                "&:hover": {
                  backgroundColor: lightColor,
                  borderColor: baseColor,
                },
              }}
            >
              بازگرداندن آخرین زنجیره حذف شده
            </Button>
          )}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowDeletedChainsModal(true)}
            startIcon={<HistoryIcon />}
            sx={{
              borderColor: baseColor,
              color: baseColor,
              "&:hover": {
                backgroundColor: lightColor,
                borderColor: baseColor,
              },
            }}
          >
            مشاهده زنجیره‌های حذف شده ({deletedChains.length})
          </Button>
        </Box>
        <Dialog
          open={showDeletedChainsModal}
          onClose={() => setShowDeletedChainsModal(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle
            sx={{
              backgroundColor: baseColor,
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <HistoryIcon />
            زنجیره‌های حذف شده
          </DialogTitle>
          <DialogContent>
            {deletedChains.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 4,
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  هیچ زنجیره حذف شده‌ای وجود ندارد
                </Typography>
              </Box>
            ) : (
              <List>
                {deletedChains.map((chain, index) => (
                  <Paper key={chain.id} sx={{ mb: 2 }}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => restoreChain(chain)}
                          sx={{ color: baseColor }}
                        >
                          <ReplayIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: lightColor, color: baseColor }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${chain.skill_category} - ${chain.university_category}`}
                        secondary={`نوع دوره: ${chain.TypeExamTurn}`}
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowDeletedChainsModal(false)}
              sx={{ color: theme.palette.text.secondary }}
            >
              بستن
            </Button>
          </DialogActions>
        </Dialog>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="chains">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ display: "flex", flexDirection: "column", gap: 3 }}
              >
                {chains.map((chain, index) => (
                  <Draggable
                    key={chain.id}
                    draggableId={`chain-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        elevation={3}
                        sx={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                          p: 2,
                          maxHeight: isMobile ? "auto" : "100px",
                          alignItems: "center",
                          justifyContent: "space-between",
                          position: "relative",
                          overflow: "visible",
                        }}
                      >
                        {/* Chain number */}
                        <Box
                          {...provided.dragHandleProps}
                          sx={{
                            position: "absolute",
                            left: isMobile ? 8 : -10,
                            top: "50%",
                            transform: isMobile ? "none" : "translateY(-50%)",
                            backgroundColor: baseColor,
                            color: "white",
                            borderRadius: "50%",
                            fontSize: "12px",
                            width: 30,
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            boxShadow: 2,
                            zIndex: 1,
                          }}
                        >
                          {index + 1}
                        </Box>

                        {/* Drag handle */}
                        {/* <Box
                          {...provided.dragHandleProps}
                          sx={{
                            position: isMobile ? "absolute" : "relative",
                            left: isMobile ? 8 : 20,
                            top: isMobile ? 8 : "auto",
                            color: theme.palette.grey[500],
                            cursor: "grab",
                          }}
                        >
                          <DragIcon />
                        </Box> */}

                        {/* Mobile settings button */}
                        {isMobile && (
                          <Box
                            sx={{
                              position: "absolute",
                              right: 8,
                              top: 8,
                              display: "flex",
                              gap: 1,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuClick(e, index)}
                              sx={{ color: baseColor }}
                            >
                              <SettingsIcon />
                            </IconButton>
                            {/* <IconButton
                              size="small"
                              onClick={() => toggleChainExpand(index)}
                              sx={{ color: baseColor }}
                            >
                              {expandedChain === index ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton> */}
                          </Box>
                        )}

                        {/* Left side - Actions (desktop) */}
                        {!isMobile && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 1,
                              minWidth: 80,
                            }}
                          >
                            <IconButton
                              onClick={() => handleOpenTable(chain, index)}
                              sx={{ color: baseColor }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            {/* <IconButton
                              onClick={() => handleSwapClick(index)}
                              sx={{ color: theme.palette.warning.main }}
                            >
                              <SwapIcon />
                            </IconButton> */}
                            <IconButton
                              onClick={() => handleDeleteChain(index)}
                              sx={{ color: theme.palette.error.main }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleMoveClick(index)}
                              sx={{ color: theme.palette.error.main }}
                            >
                              <SwapIcon />
                            </IconButton>
                          </Box>
                        )}

                        {/* Chain visualization */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: "center",
                            flexGrow: 1,
                            mx: isMobile ? 0 : 2,
                            position: "relative",
                          }}
                        >
                          {/* Chain items */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: isMobile ? "column" : "row",
                              width: "100%",
                              gap: isMobile ? 1 : 0,
                            }}
                          >
                            {[
                              {
                                type: "major",
                                data: chain.Majors,
                                label: "رشته",
                                name: chain.skill_category,
                                onclick: true,
                              },
                              {
                                type: "university",
                                data: chain.Universities,
                                label: "دانشگاه",
                                name: chain.university_category,
                                onclick: true,
                              },
                              {
                                type: "period",
                                data: [chain.TypeExamTurn],
                                label: "دوره",
                                name: chain.obligation_category === 0 ? `${chain.TypeExamTurn} - بدون‌ تعهدی` : `${chain.TypeExamTurn} - دارای تعهد`,
                                onclick: false,
                              },
                            ].map((item, i) => (
                              <Box
                                key={i}
                                onClick={() =>
                                  item.onclick
                                    ? handleOpenModal({
                                      title: `لیست ${item.label}: ${item.name}`,
                                      items: item.data,
                                    })
                                    : NaN
                                }
                                sx={{
                                  flex: 1,
                                  // maxWidth: !isMobile ? "20%" : "auto",
                                  width: !isMobile ? "25%" : "100%",
                                  p: isMobile ? 1.5 : 2,
                                  m: isMobile ? 0 : 1,
                                  border: `2px solid ${baseColor}`,
                                  borderRadius: 1,
                                  textAlign: "center",
                                  // maxHeight: !isMobile ? "75px" : "auto",
                                  height: !isMobile ? "75px" : "auto",
                                  cursor: "pointer",
                                  backgroundColor: lightColor,
                                  "&:hover": {
                                    animation: `${pulseAnimation} 0.5s ease`,
                                    boxShadow: `0 0 8px ${baseColor}`,
                                  },
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  {item.name}
                                </Typography>
                                {/* <Typography variant="caption">
                                  {item.label}
                                </Typography> */}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleOpenTable(chains[currentChainIndex], currentChainIndex);
              handleMenuClose();
            }}
          >
            <VisibilityIcon sx={{ ml: 1 }} />
            مشاهده جدول
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMoveClick(currentChainIndex);
              handleMenuClose();
            }}
            sx={{ color: theme.palette.warning.main }}
          >
            <SwapIcon sx={{ ml: 1 }} />
            انتقال به موقعیت
          </MenuItem>
          {/* <MenuItem
            onClick={() => {
              handleSwapClick(currentChainIndex);
              handleMenuClose();
            }}
            sx={{ color: theme.palette.warning.main }}
          >
            <SwapIcon sx={{ ml: 1 }} />
            جابجایی
          </MenuItem> */}
          <MenuItem
            onClick={() => {
              handleDeleteChain(currentChainIndex);
              handleMenuClose();
            }}
            sx={{ color: theme.palette.error.main }}
          >
            <DeleteIcon sx={{ ml: 1 }} />
            حذف
          </MenuItem>
        </Menu>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="chain-modal"
          aria-describedby="chain-modal-content"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? "95%" : "60%",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 1,
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            {renderModalContent()}
            <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={handleCloseModal}
                variant="contained"
                sx={{
                  backgroundColor: baseColor,
                  "&:hover": { backgroundColor: lightColor },
                }}
              >
                بستن
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Swap Confirmation Dialog */}
        {/* <Dialog
          open={showSwapConfirm}
          onClose={() => setShowSwapConfirm(false)}
          aria-labelledby="swap-dialog-title"
        >
          <DialogTitle id="swap-dialog-title" sx={{ color: baseColor }}>
            تایید جابجایی زنجیره
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              لطفاً زنجیره ای که می خواهید با این زنجیره جابجا شود را انتخاب کنید:
            </DialogContentText>
            <List>
              {chains.map((chain, index) => (
                <ListItem
                  button
                  key={chain.id}
                  onClick={() => confirmSwap(index)}
                  disabled={chain.id === swapChainId}
                  sx={{
                    '&:hover': {
                      backgroundColor: lightColor,
                    }
                  }}
                >
                  <ListItemText
                    primary={`زنجیره ${index + 1}: ${chain.skill_category} - ${chain.university_category}`}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowSwapConfirm(false)}
              sx={{ color: theme.palette.text.secondary }}
            >
              انصراف
            </Button>
          </DialogActions>
        </Dialog> */}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle
            id="delete-dialog-title"
            sx={{ color: theme.palette.error.main }}
          >
            تایید حذف زنجیره
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              آیا مطمئن هستید که می خواهید این زنجیره را حذف کنید؟
            </DialogContentText>
            {chainToDelete !== null && chains[chainToDelete] && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1">
                  {chains[chainToDelete].skill_category} -{" "}
                  {chains[chainToDelete].university_category}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowDeleteConfirm(false)}
              sx={{ color: theme.palette.text.secondary }}
            >
              انصراف
            </Button>
            <Button
              onClick={confirmDeleteChain}
              sx={{ color: theme.palette.error.main }}
              autoFocus
            >
              حذف
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={3000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSuccess(null)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        </Snackbar>
      </Box>
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
      <Dialog
        open={showMoveDialog}
        onClose={() => setShowMoveDialog(false)}
        aria-labelledby="move-dialog-title"
      >
        <DialogTitle id="move-dialog-title" sx={{ color: baseColor }}>
          انتقال زنجیره به موقعیت جدید
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            لطفاً موقعیت جدید (بین 1 تا {chains.length}) را وارد کنید:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="position"
            label="موقعیت جدید"
            type="number"
            fullWidth
            variant="outlined"
            value={targetPosition}
            onChange={(e) => setTargetPosition(e.target.value)}
            inputProps={{
              min: 1,
              max: chains.length,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: baseColor,
                },
                "&:hover fieldset": {
                  borderColor: baseColor,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowMoveDialog(false)}
            sx={{ color: theme.palette.text.secondary }}
          >
            انصراف
          </Button>
          <Button
            onClick={confirmMove}
            sx={{ color: baseColor }}
            disabled={!targetPosition}
          >
            تایید انتقال
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            animation: `${fadeIn} 0.3s ease-out`,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            minWidth: isMobile ? "90vw" : "400px",
            maxWidth: "95vw",
            borderTop: `4px solid ${baseColor}`,
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            backgroundColor: lightColor,
            color: theme.palette.getContrastText(lightColor),
            py: 2,
            px: 3,
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          {"تغییرات تایید نشده"}
          <Box
            sx={{
              width: "100%",
              height: "4px",
              background: `linear-gradient(90deg, ${baseColor}, transparent)`,
              mt: 1,
              borderRadius: "2px",
            }}
          />
        </DialogTitle>

        <DialogContent sx={{ py: 3, px: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: lightColor,
                color: theme.palette.getContrastText(lightColor),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                fontSize: "0.95rem",
                lineHeight: 1.6,
              }}
            >
              اطلاعات شما تغییر کرده و با اعمال این تغییرات موارد پیشرو دچار
              تغییر می‌شود.
              <br />
              آیا مایل به ذخیره تغییرات هستید؟
            </DialogContentText>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "space-between",
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
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                borderColor: theme.palette.text.secondary,
              },
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
              boxShadow: "none",
              "&:hover": {
                backgroundColor: baseColor,
                opacity: 0.9,
                boxShadow: "none",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
              transition: "all 0.2s ease",
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
    </>
  );
};

export default Chain;
