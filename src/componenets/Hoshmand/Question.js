import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Slider,
  useMediaQuery,
  useTheme,
  styled,
  keyframes,
  Button,
  Avatar,
  Snackbar,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
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

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const CustomSlider = styled(Slider)(({ theme, baseColor, lightColor }) => ({
  color: baseColor,
  padding: "15px 0",
  "& .MuiSlider-thumb": {
    width: 24,
    height: 24,
    transition: "all 0.2s ease",
    "&:hover, &.Mui-focusVisible": {
      boxShadow: `0px 0px 0px 8px ${lightColor}`,
      animation: `${pulseAnimation} 1.5s infinite`,
    },
    "&.Mui-active": {
      width: 24,
      height: 24,
      boxShadow: `0px 0px 0px 14px ${lightColor}`,
    },
  },
  "& .MuiSlider-valueLabel": {
    backgroundColor: baseColor,
    color: theme.palette.getContrastText(baseColor),
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    transition: "all 0.2s ease",
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-track": {
    height: 8,
    borderRadius: 4,
  },
  "& .MuiSlider-rail": {
    height: 8,
    borderRadius: 4,
  },
}));

const defaultQuestions = [
  {
    id: 1,
    value: 3,
    key: "examtype",
    question: "میزان اهمیت دوره‌ها برای شما چقدر است؟",
    icon: "📚",
  },
  {
    id: 2,
    value: 3,
    key: "univercity",
    question: "میزان اهمیت دانشگاه‌ها برای شما چقدر است؟",
    icon: "🏛️",
  },
  {
    id: 3,
    value: 3,
    key: "major",
    question: "میزان اهمیت رشته‌ها برای شما چقدر است؟",
    icon: "🎓",
  },
];

const yesNoDefualtQuestions = [
  {
    id: 4,
    value: '1,0', // Default to "همه رشته‌ها"
    key: "obligation",
    question: "در مورد رشته‌های تعهدی، تمایل به تحصیل .......... دارم.",
    icon: "⚖️",
    options: [
      { value: '1', label: 'فقط رشته‌های دارای تعهد' },
      { value: '0,1', label: 'همه رشته‌ها' },
      { value: '0', label: 'فقط رشته‌های بدون تعهد' }
    ]
  },
  {
    id: 5,
    value: 'با آزمون,صرفا با سوابق تحصیلی', // Default to "همه رشته‌ها"
    key: "method",
    question: "در مورد نوع پذیرش، تمایل به تحصیل در کدرشته های ............................ دارم.",
    icon: "🔧",
    options: [
      { value: 'صرفا با سوابق تحصیلی', label: 'فقط سوابق تحصیلی' },
      { value: 'با آزمون,صرفا با سوابق تحصیلی', label: 'همه رشته‌ها' },
      { value: 'با آزمون', label: 'فقط با آزمون' }
    ]
  },
];

const Question = ({ userInfo, nextStep }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const baseColor = GetButtonColor(userInfo?.data?.sex);
  const lightColor = GetLightColor(userInfo?.data?.sex);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState(defaultQuestions);
  const [yesNoQuestions, setYesNoQuestions] = useState(yesNoDefualtQuestions);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [initialHash, setInitialHash] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const descriptionContent = (
    <HelperInfo
      userInfo={userInfo}
      title="راهنمای اولویت‌ها"
      content={["دانش آموز عزیز این سامانه قرار است برای شما انتخاب رشته را به صورت هوشمند انجام دهد. بنابراین لطفا راهنمای هر صفحه را به دقت مطالعه کنید.", "لطفا به سوالات زیر با دقت پاسخ دهید. این اطلاعات به ما کمک می‌کند پیشنهادات بهتر و دقیق تری به شما ارائه دهیم. میزان اهمیت یا علاقه خود را در هر زمینه مشخص کنید."]}
      secondTitle="نکات مشاوره‌ای"
      additionalTips={[
        "رشته های تعهدی، رشته هایی هستند که 1.5 تا 3 برابر مدت زمان تحصیل، موظف به خدمت به دولت یا یک نهاد خاص هستید. محل خدمت و جزییات این تعهدات، در قسمت توضیحات رشته-محل موجوده.",
        "رشته های فقط با سوابق تحصیلی، رشته هایی هستند که ملاک پذیرش در آن ها فقط سوابق تحصیلی شماست و نه رتبه کنکور و این شیوه پذیرش هیچ تاثیری در اعتبار مدرک تحصیلی شما ندارد.",
      ]}
    />
  );

  const marks = [
    { value: 1, label: "خیلی کم" },
    { value: 2, label: "کم" },
    { value: 3, label: "متوسط" },
    { value: 4, label: "زیاد" },
    { value: 5, label: "خیلی زیاد" },
  ];

  const generateHash = (data) => {
    return sha256(JSON.stringify(data));
  };

  const handleChange = (id) => (event, newValue) => {
    setQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, value: newValue } : q)
    );
  };

  const handleYesNoChange = (id, newValue) => {
    setYesNoQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, value: newValue } : q)
    );
  };



  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.post(
          "https://entekhab.yejooredigeh.com/hoshmand/select_request",
          {
            table: "users",
            method_type: "get_hoshmand_questions",
            data: {
              user_id: userInfo?.data.user_id,
              token: JSON.parse(localStorage.getItem("token")),
            },
          }
        );

        if (response.data && response.data.status === 200) {
          const apiData = response.data.response;
          setTimeout(() => {
            setInitialHash(generateHash(apiData));
          }, 0);
          setQuestions(prevQuestions =>
            prevQuestions.map(q => ({
              ...q,
              value: apiData[q.key] !== undefined ? apiData[q.key] : q.value
            }))
          );
          setYesNoQuestions(prevYesNoQuestions =>
            prevYesNoQuestions.map(q => ({
              ...q,
              value: apiData[q.key] !== undefined ? apiData[q.key] : q.value
            }))
          );
        } else if (response.data.status === 404) {
          setSnackbar({
            open: true,
            message: "نشست شما به پایان رسیده  لطفا دوباره وارد شوید",
            severity: "error",
          });
          setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user-info");
            localStorage.removeItem("user-role");
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "خطا در دریافت اطلاعات اولویت‌ها",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [userInfo]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };


  const saveChanges = async () => {
    try {
      const responseData = {};
      questions.forEach((item) => {
        responseData[item.key] = item.value;
      });
      yesNoQuestions.forEach((item) => {
        responseData[item.key] = item.value;
      });

      const response = await axios.post(
        "https://entekhab.yejooredigeh.com/hoshmand/update_request",
        {
          table: "users",
          method_type: "update_hoshmand_questions",
          data: {
            user_id: userInfo?.data.user_id,
            token: JSON.parse(localStorage.getItem("token")),
            ...responseData,
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
    try {
      const responseData = {};
      questions.forEach((item) => {
        responseData[item.key] = item.value;
      });
      yesNoQuestions.forEach((item) => {
        responseData[item.key] = item.value;
      });
      const currentHash = generateHash(responseData);
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
    <Box sx={{
      mx: 'auto',
      p: isMobile ? 2 : 4,
    }}>
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

      {/* Questions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {questions.map((item) => (
          <Paper
            key={item.id}
            elevation={2}
            sx={{
              p: isMobile ? 2 : 3,
              borderRadius: 2,
              borderLeft: `4px solid ${baseColor}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              gap: 2
            }}>
              <Avatar sx={{
                bgcolor: lightColor,
                fontWeight: 'bold',
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                fontSize: isMobile ? '0.9rem' : '1.1rem'
              }}>
                {item.id}
              </Avatar>
              <Typography variant="h6" sx={{
                fontWeight: 'bold',
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                  md: '1.1rem'
                },
                lineHeight: 1.3
              }}>
                {item.icon} {item.question}
              </Typography>
            </Box>

            <Box sx={{
              px: isMobile ? 1 : 4,
              py: isMobile ? 1.5 : 2,
              bgcolor: '#f9f9f9',
              borderRadius: 2
            }}>
              <CustomSlider
                baseColor={baseColor}
                lightColor={lightColor}
                value={item.value}
                onChange={handleChange(item.id)}
                min={1}
                max={5}
                step={1}
                marks={marks}
                // marks={isMobile ? marks.map(mark => ({ value: mark.value, label: '' })) : marks}
                valueLabelDisplay="auto"
                sx={{
                  "& .MuiSlider-markLabel": {
                    fontSize: isMobile ? "0.6rem" : "0.7rem",
                    marginTop: "8px",
                    whiteSpace: 'nowrap'
                  },
                  "& .MuiSlider-valueLabel": {
                    fontSize: isMobile ? "0.7rem" : "0.75rem"
                  }
                }}
              />
            </Box>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 4 }}>
        {yesNoQuestions.map((item) => (
          <Paper
            key={item.id}
            elevation={2}
            sx={{
              p: isMobile ? 2 : 3,
              borderRadius: 2,
              borderLeft: `4px solid ${baseColor}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              gap: 2
            }}>
              <Avatar sx={{
                bgcolor: lightColor,
                fontWeight: 'bold',
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                fontSize: isMobile ? '0.9rem' : '1.1rem'
              }}>
                {item.id}
              </Avatar>
              <Typography variant="h6" sx={{
                fontWeight: 'bold',
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                  md: '1.1rem'
                },
                lineHeight: 1.3
              }}>
                {item.icon} {item.question}
              </Typography>
            </Box>

            <Box sx={{
              px: isMobile ? 1 : 4,
              py: isMobile ? 1.5 : 2,
              bgcolor: '#f9f9f9',
              borderRadius: 2
            }}>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  aria-label={item.key}
                  name={item.key}
                  value={item.value}
                  onChange={(e) => handleYesNoChange(item.id, e.target.value)}
                  sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-around',
                    gap: isMobile ? 1 : 0
                  }}
                >
                  {item.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={
                        <Radio
                          sx={{
                            color: baseColor,
                            '&.Mui-checked': {
                              color: baseColor,
                            },
                          }}
                        />
                      }
                      label={option.label}
                      labelPlacement={isMobile ? "end" : "start"}
                      sx={{
                        margin: 0,
                        '& .MuiFormControlLabel-label': {
                          marginRight: theme.spacing(1),
                          fontSize: isMobile ? '0.8rem' : '0.9rem'
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          </Paper>
        ))}
      </Box>

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


      <Box sx={{
        display: 'flex',
        justifyContent: 'end',
      }}>
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
    </Box>
  );
};

export default Question;