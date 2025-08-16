import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  keyframes,
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

const ExamType = ({ userInfo, nextStep }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const baseColor = GetButtonColor(userInfo?.data?.sex);
  const lightColor = GetLightColor(userInfo?.data?.sex);
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityBoxes, setPriorityBoxes] = useState(Array(6).fill(""));
  const [error, setError] = useState(false);
  const [hoveredBox, setHoveredBox] = useState(null);
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
      title="راهنمای دوره‌ها"
      content={["دانش آموز عزیز، در این صفحه تمام دوره‌‌هایی که می‌توانید در آن‌ها تحصیل کنید را مشاهده می‌کنید. لطفا با توجه به علاقه خود، حداکثر 6 دوره را انتخاب کنید. در هر ردیف 1 دوره مد نظر خود را به ترتیب اولویت مرتب کنید. در نظر داشته باشید که دوره های انتخاب شده توسط شما به این معنا هستند که تحصیل در این دوره‌ها از نظر شما بلامانع است. بنابراین در انتخاب این دوره‌ها حتما دقت کنید."]}
      secondTitle={"نکات مهم مشاوره‌ای:"}
      additionalExplain="اینجا برای راحتی شما، دوره‌های تحصیلی رو خیلی مشخص‌تر و به تفکیک دسته‌بندی کردیم. در ادامه، این دوره‌ها به تفکیک تعریف می‌شوند."
      additionalTips={[
        "روزانه: معتبرترین دوره‌های تحصیلی دانشگاهی می‌باشد که تحصیل در این دوره‌ها رایگان بوده و در دانشگاه‌های سراسری (ملی-دولتی) ارائه می‌شود.",
        "نوبت دوم: دوره نوبت دوم یا شبانه، دوره‌ای از تحصیلات دانشگاهی است که در دانشگاه‌های دولتی و زیر نظر وزارت علوم ارائه می‌شود. این دوره با دوره‌ی روزانه از نظر زمان و محل تشکیل کلاس‌ها و اعتبار مدرک تفاوتی ندارد، اما دانشجویان این دوره ملزم به پرداخت شهریه هستند. همچنین، دانشجویان نوبت دوم ممکن است از برخی خدمات رفاهی مانند خوابگاه با شرایط متفاوتی نسبت به دوره روزانه برخوردار باشند.",
        "شهریه پرداز: دوره شهریه پرداز یا دوره پردیس خودگردان، یک دوره آموزشی است که زیر نظر دانشگاه‌های دولتی فعالیت می‌کند و دانشجویان آن با پرداخت شهریه پذیرش می‌شوند که این شهریه از دوره های نوبت دوم، غیر انتفاعی و پیام نور به مراتب بالاتر است. مدرک تحصیلی این دوره از نظر اعتبار با دوره‌های روزانه تفاوت چندانی ندارد و توسط همان دانشگاه صادر می‌شود.",
        "بورسیه: این دوره توسط دانشگاه‌های خاصی ارائه می‌شود که تحصیل در این کد رشته‌ها، به معنای استخدام شما توسط همان دانشگاه و یا ارگان‌های دیگری مانند نیروهای مسلح و یا بورسیه صنعت و دانش می‌باشد. این دوره‌ها رایگان بوده و از نظر اعتبار مدرک تفاوتی با دوره روزانه ندارد. شرایط خاص پذیرش در این کد رشته‌ها در ویدیوهای آموزشی موجود می‌باشد.",
        "بومی مناطق محروم و بلایای طبیعی: این دوره برای پذیرش داوطلبان بومی یک محل مشخص در نظر گرفته شده است و معمولا تحصیل در این دوره‌ها رایگان و همراه با تعهد خدمت (اعلام شده در دفترچه) بوده و پذیرش آن‌ها مطابق دفترچه از یک استان و یا محل مشخص انجام می‌شود.",
        "فرهنگیان: این دوره، به صورت اختصاصی به رشته-محل‌های دانشگاه‌های فرهنگیان و تربیت دبیر شهید رجایی اشاره دارد که پذیرش در آن‌ها به صورت استانی و با ظرفیت محدود صورت می‌گیرد و پذیرفته شدگان استخدام وزارت آموزش و پرورش خواهند بود و تعهدات مورد نظر آن وزارت خانه بر عهده ایشان می‌باشد.",
        "غیر انتفاعی: این دوره، جز دوره‌های شهریه پرداز می‌باشد. مدرک ارائه شده توسط این مراکز زیر نظر وزارت علوم، تحقیقات و فناوری بوده و شهریه این مراکز، توسط هیات امنا هر مرکز تعیین می‌شود که معمولا تفاوت چندانی با دانشگاه آزاد اسلامی ندارد.",
        "پیام نور: دانشگاه پیام نور یک دانشگاه نیمه‌دولتی در ایران است. این دانشگاه بر اساس آموزش از راه دور و نیمه‌حضوری فعالیت می‌کند و دارای واحدهایی در سراسر کشور است. حضور در کلاس‌های این دانشگاه اجباری نبوده و تشکیل کلاس‌ها در این دانشگاه منوط به شرایط خاصی می‌باشد. شهریه این دانشگاه کمتر از دانشگاه‌های غیرانتفاعی و آزاد اسلامی می‌باشد و امتحانات آن به صورت متمرکز و کشوری برگزار می‌گردد. مدارک این دانشگاه مورد تایید وزارت علوم، تحقیقات و فناوری است.",
        "مجازی : این دوره در بعضی از دانشگاه‌های سراسری به صورت محدود ارائه می‌شود و کلاس‌ها در این دوره به صورت مجازی تشکیل می‌گردد.",
        "آزاد تمام وقت و شهریه پرداز : انتخاب رشته سراسری در این دوره فقط در شاخه تجربی و در 4 رشته( پزشکی، دندانپزشکی، داروسازی و دامپزشکی) انجام می‌شود. توجه داشته باشید شهریه دانشگاه‌ها در دوره آزاد شهریه پرداز از پردیس‌های خودگردان دانشگاه‌های سراسری نیز بیشتر می‌باشد. ",
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
            method_type: "get_hoshmand_examtype",
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
          setAllItems(response.data.response.exam_types || []);
          const userPriorities = Array(6).fill("");
          if (response.data.response.user_data) {
            response.data.response.user_data.forEach((item) => {
              if (item.examType && item.priority >= 1 && item.priority <= 6) {
                userPriorities[item.priority - 1] = item.examType;
              }
            });
          }
          setPriorityBoxes(userPriorities);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "خطا در دریافت اطلاعات دوره‌ها",
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

  const filteredItems = allItems.filter(
    (item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !priorityBoxes.includes(item)
  );

  const handleAddItem = (item, boxIndex) => {
    if (priorityBoxes[boxIndex]) return;

    const newPriorityBoxes = [...priorityBoxes];
    newPriorityBoxes[boxIndex] = item;
    setPriorityBoxes(newPriorityBoxes);
    setError(false);
  };

  const handleRemoveItem = (boxIndex) => {
    const newPriorityBoxes = [...priorityBoxes];
    newPriorityBoxes[boxIndex] = "";
    setPriorityBoxes(newPriorityBoxes);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = Number(result.destination.droppableId.split("-")[1]);

    if (priorityBoxes[destIndex]) return;

    const item = filteredItems[sourceIndex];
    handleAddItem(item, destIndex);
    setHoveredBox(null);
  };

  const saveChanges = async () => {
    try {
      const selectedItems = priorityBoxes
        .map((examType, index) =>
          examType
            ? {
              examType,
              priority: index + 1,
            }
            : null
        )
        .filter((item) => item !== null);

      const examTypesString = selectedItems
        .map((item) => item.examType)
        .join(",");
      const response = await axios.post(
        "https://student.baazmoon.com/hoshmand/update_request",
        {
          table: "users",
          method_type: "update_hoshmand_examtype",
          data: {
            user_id: userInfo?.data.user_id,
            token: JSON.parse(localStorage.getItem("token")),
            data: selectedItems,
            examtypes: examTypesString,
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
    if (priorityBoxes.every((box) => !box)) {
      setError(true);
      return;
    }

    try {
      const selectedItems = priorityBoxes
        .map((examType, index) =>
          examType
            ? {
              examType,
              priority: index + 1,
            }
            : null
        )
        .filter((item) => item !== null);
      const currentHash = generateHash(selectedItems);
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

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
              <TextField
                label="جستجوی دوره‌ها"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: baseColor }}
              >
                همه دوره‌ها
              </Typography>

              <Droppable droppableId="availableItems">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      minHeight: "100px",
                      p: 1,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    {filteredItems.map((item, index) => (
                      <Draggable key={item} draggableId={item} index={index}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Chip
                              label={item}
                              sx={{
                                cursor: "grab",
                                backgroundColor: lightColor,
                                "&:hover": {
                                  backgroundColor: baseColor,
                                  color: "white",
                                },
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
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: baseColor }}
              >
                دوره‌های انتخابی (اولویت‌بندی)
              </Typography>

              {error && (
                <Typography color="error" variant="caption" sx={{ mb: 2 }}>
                  لطفا حداقل یک دوره‌ی انتخاب کنید
                </Typography>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {priorityBoxes.map((item, index) => (
                  <Droppable
                    key={`priority-${index}`}
                    droppableId={`priority-${index}`}
                    onDragEnter={() => setHoveredBox(index)}
                    onDragLeave={() => setHoveredBox(null)}
                  >
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          p: 2,
                          border: `2px dashed ${hoveredBox === index
                            ? priorityBoxes[index]
                              ? theme.palette.error.main
                              : theme.palette.success.main
                            : theme.palette.divider
                            }`,
                          borderRadius: "4px",
                          minHeight: "60px",
                          backgroundColor: theme.palette.background.paper,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            border: `2px dashed ${priorityBoxes[index]
                              ? theme.palette.error.main
                              : theme.palette.success.main
                              }`,
                          },
                        }}
                      >
                        {item ? (
                          <Chip
                            label={`${index + 1}. ${item}`}
                            onDelete={() => handleRemoveItem(index)}
                            sx={{
                              backgroundColor: lightColor,
                              "& .MuiChip-deleteIcon": {
                                color: baseColor,
                                "&:hover": { color: theme.palette.error.main },
                              },
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            باکس {index + 1} - خالی
                          </Typography>
                        )}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={priorityBoxes.every((box) => !box)}
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
      </Box>
    </DragDropContext>
  );
};

export default ExamType;
