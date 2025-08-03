import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Fade,
  Zoom,
} from "@mui/material";

const TermsAndConditions = ({
  open,
  baseColor,
  lightColor,
  onAccept,
  theme,
  termsConfig,
}) => {
  const [checked, setChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const contentRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isBottom = scrollHeight - scrollTop <= clientHeight + 10;
      setScrolledToBottom(isBottom);
      if (isBottom) {
        setShowScrollHint(false);
      }
    }
  };

  useEffect(() => {
    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handleAccept = () => {
    if (checked) {
      if (!scrolledToBottom) {
        setSnackbar({
          open: true,
          message: "📢 توصیه می‌شود تمام شرایط را مطالعه نمایید",
          severity: "warning",
        });
      }
      onAccept();
    } else {
      setSnackbar({
        open: true,
        message: "⚠️ لطفاً تیک تأیید شرایط را انتخاب نمایید",
        severity: "error",
      });
    }
  };

  const enhancedContent = {
    title: "📝 راهنمای انتخاب رشته هوشمند",
    acceptanceText: "تمام نکات و شرایط فوق را مطالعه کرده‌ام و متوجه شده‌ام ✅",
    acceptButtonText: "تأیید و ادامه",
    sections: [
      {
        title: "🔍 مرحله اول: تکمیل اطلاعات",
        points: [
          "قبل از هر چیز باید اطلاعات کارنامه خود را وارد کنید. اگر این کار را انجام نداده‌اید، روی دکمه «تکمیل اطلاعات» کلیک نمایید.",
          "دقت کنید که تمام نمرات و رتبه‌ها را به درستی وارد کنید تا سیستم بتواند بهترین پیشنهادها را ارائه دهد.",
        ],
      },
      {
        title: "🎬 مرحله دوم: آموزش‌های ضروری",
        points: [
          "حتماً فیلم‌های آموزشی مربوط به هر بخش را تماشا کنید. این فیلم‌ها به شما کمک می‌کنند تا با تمام قابلیت‌های سیستم آشنا شوید.",
          "📖 متن راهنمای هر صفحه را با دقت بخوانید. این راهنماها حاوی نکات طلایی برای انتخاب رشته مناسب هستند.",
        ],
      },
      {
        title: "🆘 پشتیبانی و راهنمایی",
        points: [
          "اگر در فرآیند انتخاب رشته هوشمند با مشکلی مواجه شدید، می‌توانید از طریق آی‌دی @yejooredigeh1 در تلگرام با پشتیبانی در تماس باشید.",
          "پشتیبانی در سریع‌ترین زمان ممکن پاسخگوی شما خواهد بود.",
        ],
      },
      {
        title: "💎 اشتراک ویژه ال-پروفسور",
        points: [
          "اگر اشتراک ال-پروفسور را تهیه کرده‌اید، به یک لینک اختصاصی دسترسی دارید که تمام آموزش‌ها، فوت‌وفن‌های انتخاب رشته و منابع مورد نیاز در آن قرار دارد.",
          "این لینک مانند یک گنجینه ارزشمند تمام آنچه برای یک انتخاب رشته عالی نیاز دارید را در اختیار شما قرار می‌دهد.",
        ],
      },
    ],
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="terms-dialog-title"
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            borderLeft: `6px solid ${baseColor}`,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          id="terms-dialog-title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: lightColor,
            color: theme.palette.getContrastText(lightColor),
            py: 2,
            px: 3,
            borderBottom: `2px solid ${baseColor}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
          >
            <Zoom in style={{ transitionDelay: "100ms" }}>
              <span style={{ marginLeft: 8 }}>{enhancedContent.title}</span>
            </Zoom>
          </Typography>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ py: 3, position: "relative", backgroundColor: "#f9f9f9" }}
        >
          {showScrollHint && !scrolledToBottom && (
            <Fade in>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: baseColor,
                  color: "white",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  zIndex: 1,
                  animation: "bounce 2s infinite",
                  "@keyframes bounce": {
                    "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
                    "50%": { transform: "translateX(-50%) translateY(-5px)" },
                  },
                  boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  👇 توصیه می‌شود تمام متن را مطالعه نمایید
                </Typography>
              </Box>
            </Fade>
          )}

          <Box
            ref={contentRef}
            sx={{
              maxHeight: "60vh",
              overflowY: "auto",
              pr: 2,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: baseColor,
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
            }}
          >
            {enhancedContent.sections.map((section, index) => (
              <Fade
                in
                key={index}
                timeout={500}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Box
                  sx={{
                    mb: 3,
                    backgroundColor:
                      index % 2 === 0
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(245,245,245,0.7)",
                    p: 2,
                    borderRadius: 2,
                    borderLeft: `3px solid ${baseColor}`,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      color: baseColor,
                      mt: index > 0 ? 3 : 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ marginLeft: 8 }}>{section.title}</span>
                  </Typography>

                  {section.points.map((point, i) => (
                    <Typography
                      key={i}
                      paragraph
                      sx={{
                        position: "relative",
                        pl: 3,
                        "&:before": {
                          content: '"•"',
                          color: baseColor,
                          fontWeight: "bold",
                          display: "inline-block",
                          width: "1em",
                          marginLeft: "-1em",
                          fontSize: "1.2em",
                        },
                      }}
                    >
                      {point}
                    </Typography>
                  ))}
                </Box>
              </Fade>
            ))}
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                sx={{
                  color: baseColor,
                  "&.Mui-checked": {
                    color: baseColor,
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {enhancedContent.acceptanceText}
              </Typography>
            }
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: checked ? `${baseColor}15` : "transparent",
              transition: "all 0.3s ease",
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, backgroundColor: "#f5f5f5" }}>
          <Button
            onClick={handleAccept}
            variant="contained"
            disabled={!checked}
            sx={{
              backgroundColor: baseColor,
              "&:hover": {
                backgroundColor: baseColor,
                opacity: 0.9,
                transform: "translateY(-2px)",
                boxShadow: `0 4px 8px ${baseColor}80`,
              },
              "&:disabled": {
                opacity: 0.6,
              },
              transition: "all 0.3s ease",
              fontWeight: "bold",
              fontSize: "1rem",
              py: 1.5,
              px: 4,
              borderRadius: 2,
              boxShadow: checked ? `0 2px 5px ${baseColor}80` : "none",
            }}
          >
            {enhancedContent.acceptButtonText}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TermsAndConditions;
