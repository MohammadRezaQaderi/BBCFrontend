import React, { useEffect, useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Button,
  MobileStepper,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { GetButtonColor, GetLightColor } from "../../helper/buttonColor";
import Question from "./Question";
import ExamType from "./ExamType";
import Major from "./Major";
import Porvience from "./Porvience";
import PriorityTable from "./PriorityTable";
import Chain from "./Chain";
import SPList from "./SPList";
import FPList from "./FPList";
import TermsAndConditions from "./TermsAndConditions";
import axios from "axios";
import Loader from "../../helper/Loader";

const steps = [
  "اولویت‌ها",
  "دوره‌ها",
  "رشته‌ها",
  "استان‌ها",
  "جداول",
  "زنجیره",
  "لیست رشته‌ها",
  "لیست منتخب",
  // "خروجی",
];


const termsConfig = {
  title: "شرایط و ضوابط استفاده از سرویس",
  acceptanceText: "من تمام شرایط و ضوابط و سیاست حفظ حریم خصوصی را به دقت مطالعه کرده‌ام و می‌پذیرم",
  acceptButtonText: "تأیید و ادامه",
  sections: [
    {
      title: "شرایط استفاده از سرویس",
      points: [
        "1. با استفاده از این سرویس، شما موافقت می‌کنید که اطلاعات ارائه شده توسط شما ممکن است برای بهبود خدمات ما استفاده شود.",
        "2. ما متعهد به حفظ حریم خصوصی شما هستیم و اطلاعات شخصی شما را با هیچ شخص ثالثی به اشتراک نمی‌گذاریم.",
        "3. شما مسئول صحت اطلاعاتی که وارد می‌کنید هستید و هرگونه استفاده نادرست از سرویس می‌تواند منجر به محدودیت دسترسی شود.",
        "4. ما ممکن است این شرایط را در آینده به روز کنیم و شما موظف به پذیرش نسخه‌های به روز شده هستید."
      ]
    },
    {
      title: "سیاست حفظ حریم خصوصی",
      points: [
        "1. ما از اطلاعات شما فقط برای اهداف مشخص شده در این پلتفرم استفاده می‌کنیم.",
        "2. داده‌های شما در سرورهای امن ذخیره می‌شوند و از استانداردهای رمزنگاری برای محافظت از آنها استفاده می‌شود.",
        "3. شما می‌توانید درخواست حذف اطلاعات خود را در هر زمان ارسال کنید.",
        "4. اطلاعات جمع‌آوری شده تنها برای ارائه خدمات بهتر و شخصی‌سازی تجربه کاربری استفاده خواهد شد."
      ]
    }
  ]
};

const Hoshmand = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [loading, setLoading] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userInfo] = useState(
    JSON.parse(localStorage.getItem("user-info")) || {}
  );
  const baseColor = GetButtonColor(userInfo?.data?.sex);
  const lightColor = GetLightColor(userInfo?.data?.sex);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.post(
          "https://student.baazmoon.com/hoshmand/select_request",
          {
            table: "users",
            method_type: "get_hoshmand_info",
            data: {
              user_id: userInfo?.data.user_id,
              token: JSON.parse(localStorage.getItem("token")),
            },
          }
        );

        if (response.data && response.data.status === 200) {
          const apiData = response.data.response;
          setCurrentStep(apiData.current_step)
          setTermsAccepted(apiData.terms_accepted)
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
          }, 3000);
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

    fetchInfo();
  }, [userInfo]);

  const handleAcceptTerms = () => {
    const saveChanges = async () => {
      try {
        const response = await axios.post(
          "https://student.baazmoon.com/hoshmand/update_request",
          {
            table: "users",
            method_type: "update_hoshmand_info",
            data: {
              user_id: userInfo?.data.user_id,
              token: JSON.parse(localStorage.getItem("token")),
              terms_accepted: 1,
              current_step: 1,
            },
          }
        );
        if (response.data && response.data.status === 200) {
          setSnackbar({
            open: true,
            message: response.data.response.message,
            severity: "success",
          });
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
    saveChanges()
    setTermsAccepted(true);
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const goToStep = (step) => setCurrentStep(step);

  const StepContent = ({ step, userInfo }) => {
    switch (step) {
      case 1:
        return <Question userInfo={userInfo} nextStep={nextStep} />;
      case 2:
        return <ExamType userInfo={userInfo} nextStep={nextStep} />;
      case 3:
        return <Major userInfo={userInfo} nextStep={nextStep} />;
      case 4:
        return <Porvience userInfo={userInfo} nextStep={nextStep} />;
      case 5:
        return <PriorityTable userInfo={userInfo} nextStep={nextStep} />;
      case 6:
        return <Chain userInfo={userInfo} nextStep={nextStep} />;
      case 7:
        return <FPList userInfo={userInfo} nextStep={nextStep} />;
      case 8:
        return <SPList userInfo={userInfo} nextStep={nextStep} />;
      // case 9:
      //   return <PDFList userInfo={userInfo} nextStep={nextStep} />
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }


  if (!termsAccepted) {
    return (
      <TermsAndConditions
        open={!termsAccepted}
        baseColor={baseColor}
        lightColor={lightColor}
        onAccept={handleAcceptTerms}
        theme={theme}
        termsConfig={termsConfig}
      />
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: isMobile ? "100%" : isTablet ? "100%" : "100%",
        margin: "0 auto",
        padding: isMobile ? 1 : 3,
        gap: 3,
      }}
    >
      {!isMobile && (
        <Stepper
          activeStep={currentStep - 1}
          alternativeLabel
          sx={{
            '& .MuiStepIcon-root': {
              color: lightColor,
              '&.Mui-completed': {
                color: baseColor,
              },
              '&.Mui-active': {
                color: baseColor,
              },
            },
            '& .MuiStepLabel-label': {
              '&.Mui-active': {
                fontWeight: 'bold',
              },
              '&.Mui-completed': {
                fontWeight: 'bold',
              },
            }
          }}
        >
          {
            steps.map((label, index) => (
              <Step key={label} completed={index < currentStep - 1}>
                <StepLabel
                  onClick={() => goToStep(index + 1)}
                >
                  {label}
                </StepLabel>
              </Step>
            ))
          }
        </Stepper>
      )
      }

      {
        isMobile && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <MobileStepper
              variant="text"
              steps={steps.length}
              position="static"
              activeStep={currentStep - 1}
              nextButton={
                <Button
                  size="small"
                  sx={{
                    height: 50,
                    backgroundColor: baseColor,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: lightColor,
                    },
                    "&:disabled": {
                      opacity: 0.7,
                    },
                  }}
                  onClick={nextStep}
                  disabled={currentStep === steps.length}
                >
                  <KeyboardArrowLeft style={{ color: lightColor }} />
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={prevStep}
                  sx={{
                    height: 50,
                    backgroundColor: baseColor,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: lightColor,
                    },
                    "&:disabled": {
                      opacity: 0.7,
                    },
                  }}
                  disabled={currentStep === 1}
                >
                  <KeyboardArrowRight style={{ color: lightColor }} />
                </Button>
              }
            />
            <Typography variant="subtitle1" align="center">
              {steps[currentStep - 1]}
            </Typography>
          </Box>
        )
      }

      <div>
        <StepContent step={currentStep} userInfo={userInfo} />
      </div>

      {
        !isMobile && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              sx={{
                height: 50,
                backgroundColor: baseColor,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: lightColor,
                },
                "&:disabled": {
                  opacity: 0.7,
                },
              }}
              onClick={prevStep}
              disabled={currentStep === 1}
              startIcon={<KeyboardArrowRight />}
            >
              قبلی
            </Button>

            {currentStep < steps.length ? (
              <Button
                sx={{
                  height: 50,
                  backgroundColor: baseColor,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: lightColor,
                  },
                  "&:disabled": {
                    opacity: 0.7,
                  },
                }}
                variant="contained"
                onClick={nextStep}
                endIcon={<KeyboardArrowLeft />}
              >
                بعدی
              </Button>
            ) : (
              <></>
            )}
          </Box>
        )
      }
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
    </Box >
  );
};

export default Hoshmand;
