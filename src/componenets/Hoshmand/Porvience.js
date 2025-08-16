import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  keyframes,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

const Province = ({ userInfo, nextStep }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const baseColor = GetButtonColor(userInfo?.data?.sex);
  const lightColor = GetLightColor(userInfo?.data?.sex);
  const [loading, setLoading] = useState(true);
  const [boxes, setBoxes] = useState([]);
  const [error, setError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [initialHash, setInitialHash] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const generateHash = (data) => {
    return sha256(JSON.stringify(data));
  };

  const descriptionContent = (
    <HelperInfo
      userInfo={userInfo}
      title="راهنمای استان‌ها"
      secondTitle={"نکات مهم مشاوره‌ای:"}
      content={["در این قسمت، سامانه بر اساس اطلاعات موجود از سال‌های قبل و تمایل سایر دانش آموزان هم استان بومی شما، به صورت پیش فرض لیست اولیه‌ای از استان‌های مورد استقبال احتمالی شما را ارائه می‌کند. این چینش اولیه مبتنی بر عوامل اثرگذار متعددی از جمله بومی گزینی دفترچه، نزدیکی جغرافیایی و فرهنگی و ... چیده شده است. شما می‌توانید با صلاح دید شخصی خود این لیست را تغییر دهید. و یا استان‌هایی را به صورت کامل حذف کنید. حتما در نظر داشته باشید که این اولویت‌بندی در چینش نهایی لیست شما اثر خواهد داشت."]}
      additionalTips={[
        "توجه داشته باشید سامانه به صورت پیش فرض تمامی استان‌های کشور را برای شما در 5 اولویت دسته‌بندی کرده‌است منتهی پیشنهاد می‌شود برای سهولت در انتخاب رشته و دریافت نتیجه بهتر استان‌هایی را که اصلا تمایل به تحصیل در آنها نداشته را حذف کرده و تعداد دسته استان‌ها را کمتر کنید.",
      ]}
    />
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const response = await axios.post(
          "https://student.baazmoon.com/hoshmand/select_request",
          {
            table: "users",
            method_type: "get_hoshmand_province",
            data: {
              user_id: userInfo?.data.user_id,
              token: JSON.parse(localStorage.getItem("token")),
            },
          }
        );

        if (response.data && response.data.status === 200) {
          setTimeout(() => {
            setInitialHash(generateHash(response.data.response.user_data));
          }, 0);
          setBoxes(response.data.response.user_data);
        } else {
          setTimeout(() => {
            setInitialHash(generateHash([
              {
                id: "box-1",
                title: "استان(های) بومی و محل زندگی شما",
                items: [userInfo?.data?.province || "تهران"],
                readOnly: false,
              },
              {
                id: "box-2",
                title: "استان‌های همسایه و نزدیک به استان بومی",
                items: [],
                readOnly: false,
              },
              {
                id: "box-3",
                title: "استان‌های نزدیک (به لحاظ فرهنگی یا مسافتی)",
                items: [],
                readOnly: false,
              },
              {
                id: "box-4",
                title: "استان‌های با فاصله نسبتا زیاد",
                items: [],
                readOnly: false,
              },
              {
                id: "box-5",
                title: "سایر استان‌های کل کشور که ممکن است بروید",
                items: [],
                readOnly: false,
              },
              {
                id: "box-6",
                title: "استان‌هایی که به هیچ عنوان در آن‌ها تحصیل نخواهید کرد",
                items: [],
                readOnly: false,
              },
            ]));
          }, 0);
          setBoxes([
            {
              id: "box-1",
              title: "استان(های) بومی و محل زندگی شما",
              items: [userInfo?.data?.province || "تهران"],
              readOnly: false,
            },
            {
              id: "box-2",
              title: "استان‌های همسایه و نزدیک به استان بومی",
              items: [],
              readOnly: false,
            },
            {
              id: "box-3",
              title: "استان‌های نزدیک (به لحاظ فرهنگی یا مسافتی)",
              items: [],
              readOnly: false,
            },
            {
              id: "box-4",
              title: "استان‌های با فاصله نسبتا زیاد",
              items: [],
              readOnly: false,
            },
            {
              id: "box-5",
              title: "سایر استان‌های کل کشور که ممکن است بروید",
              items: [],
              readOnly: false,
            },
            {
              id: "box-6",
              title: "استان‌هایی که به هیچ عنوان در آن‌ها تحصیل نخواهید کرد",
              items: [],
              readOnly: false,
            },
          ]);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "خطا در دریافت اطلاعات استان‌ها",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [userInfo]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // if (source.droppableId === "box-1" || destination.droppableId === "box-1") {
    //   return;
    // }

    const sourceBoxIndex = boxes.findIndex(
      (box) => box.id === source.droppableId
    );
    const destBoxIndex = boxes.findIndex(
      (box) => box.id === destination.droppableId
    );

    if (sourceBoxIndex === -1 || destBoxIndex === -1) return;

    const newBoxes = [...boxes];
    const [removed] = newBoxes[sourceBoxIndex].items.splice(source.index, 1);
    newBoxes[destBoxIndex].items.splice(destination.index, 0, removed);

    setBoxes(newBoxes);
    setError(false);
  };

  const saveChanges = async () => {
    // const totalItems = boxes
    //   .slice(1)
    //   .reduce((sum, box) => sum + box.items.length, 0);

    // if (totalItems === 0) {
    //   setSnackbar({
    //     open: true,
    //     message: "خطا در دریافت اطلاعات اولویت‌ها",
    //     severity: "error",
    //   });
    //   setError(true);
    //   return;
    // }
    const province1 = boxes[0].items.join(",");
    const province2 = boxes[1].items.join(",");
    const province3 = boxes[2].items.join(",");
    const province4 = boxes[3].items.join(",");
    const province5 = boxes[4].items.join(",");
    const province6 = boxes[5].items.join(",");
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/hoshmand/update_request",
        {
          table: "users",
          method_type: "update_hoshmand_province",
          data: {
            user_id: userInfo?.data.user_id,
            token: JSON.parse(localStorage.getItem("token")),
            data: boxes,
            province1: province1,
            province2: province2,
            province3: province3,
            province4: province4,
            province5: province5,
            province6: province6,
          },
        }
      );

      if (response.data && response.data.status === 200) {
        setSnackbar({
          open: true,
          message: response.data.response.message,
          severity: "success",
        });
        nextStep()
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
    }
  };

  const handleNext = async () => {
    // const totalItems = boxes
    //   .slice(1)
    //   .reduce((sum, box) => sum + box.items.length, 0);

    // if (totalItems === 0) {
    //   setSnackbar({
    //     open: true,
    //     message: "خطا در دریافت اطلاعات اولویت‌ها",
    //     severity: "error",
    //   });
    //   setError(true);
    //   return;
    // }
    try {
      const currentHash = generateHash(boxes);
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
        message: "خطا در ارسال اطلاعات. لطفاً دوباره تلاش کنید.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {boxes.map((box) => (
            <Paper
              key={box.id}
              elevation={2}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                border: `2px solid ${box.readOnly ? theme.palette.grey[400] : baseColor
                  }`,
                opacity: box.readOnly ? 0.8 : 1,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  color: box.readOnly ? theme.palette.grey[600] : baseColor,
                }}
              >
                {box.title}
              </Typography>

              <Droppable droppableId={box.id} isDropDisabled={box.readOnly}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minHeight: "150px",
                      maxHeight: "150px", // Set a maximum height
                      p: 1,
                      backgroundColor: snapshot.isDraggingOver
                        ? theme.palette.grey[200]
                        : theme.palette.grey[100],
                      borderRadius: "4px",
                      border: `1px dashed ${box.readOnly ? theme.palette.grey[400] : baseColor
                        }`,
                      overflowY: "auto", // Add vertical scroll when content overflows
                      display: "flex",
                      flexWrap: "wrap", // Allow chips to wrap to next line
                      gap: "8px", // Add some gap between chips
                      alignItems: "flex-start", // Align chips to the top
                    }}
                  >
                    {box.items.map((item, index) => (
                      <Draggable
                        key={item}
                        draggableId={item}
                        index={index}
                        isDragDisabled={box.readOnly}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              display: "inline-block",
                              m: 0.5,
                              // Ensure draggable items maintain proper layout
                              flexShrink: 0,
                            }}
                          >
                            <Chip
                              label={item}
                              sx={{
                                backgroundColor: lightColor,
                                cursor: box.readOnly ? "default" : "grab",
                                maxWidth: "100%", // Ensure chip doesn't overflow
                              }}
                            />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          ))}
        </Box>
        {/* {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            لطفا حداقل یک آیتم را در باکس‌های ۲ تا ۶ قرار دهید
          </Typography>
        )} */}
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{
            mt: 2,
            alignSelf: "flex-end",
            backgroundColor: baseColor,
            "&:hover": {
              backgroundColor: baseColor,
              opacity: 0.9,
            },
            "&:disabled": { opacity: 0.7 },
          }}
        >
          ذخیره اطلاعات
        </Button>
      </Box>
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
    </DragDropContext>
  );
};

export default Province;
