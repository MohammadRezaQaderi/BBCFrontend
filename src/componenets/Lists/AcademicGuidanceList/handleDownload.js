export const handleDownload = async (
  report,
  report_name,
  file,
  setProgress,
  setSnackbar
) => {
  try {
    let url = ''
    if (report === "get_default") {
      url = `https://student.baazmoon.com/bbc_quiz_api/${report}`
    }
    else{
      url = `https://student.baazmoon.com/bbc_quiz_api/${report}/${file}`
    }
    const response = await fetch(url);

    if (response.ok) {
      const reader = response.body.getReader();
      const contentLength = +response.headers.get("Content-Length");
      let receivedLength = 0;
      let chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;
        const progress = Math.floor((receivedLength / contentLength) * 100);
        setProgress(progress);
      }
      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", report_name);
      document.body.appendChild(link);
      link.click();

      setProgress(0);
    } else if (response.status === 404) {
      setSnackbar({
        open: true,
        message: "فایل مورد نظر شما یافت نشد.",
        severity: "error",
      });
    } else if (response.status === 320) {
      setSnackbar({
        open: true,
        message: "شماره تلفن شما در سامانه موجود نیست. با پشتیبانی تماس بگیرید.",
        severity: "error",
      });
    } else if (response.status === 326) {
      setSnackbar({
        open: true,
        message: "شما به خروجی کارنامه خود دسترسی ندارید. با مشاور خود مطرح کنید.",
        severity: "error",
      });
    } else if (response.status === 321) {
      setSnackbar({
        open: true,
        message: "در حال حاضر آزمون‌های شما به پایان نرسیده است.",
        severity: "error",
      });
    } else if (response.status === 322) {
      setSnackbar({
        open: true,
        message: "کارنامه‌ها درحال آماده سازی می‌باشد.",
        severity: "error",
      });
    } else {
      setSnackbar({
        open: true,
        message: "مشکلی در سامانه پیش‌آمده لحظاتی دیگر مراجعه نمایید",
        severity: "error",
      });
    }
  } catch (error) {
    setSnackbar({
      open: true,
      message: "مشکلی در سامانه پیش‌آمده لحظاتی دیگر مراجعه نمایید",
      severity: "error",
    });
  }
};