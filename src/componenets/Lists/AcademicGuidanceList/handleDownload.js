import { toast } from "react-toastify";

export const handleDownload = async (
  report,
  report_name,
  file,
  setProgress
) => {
  try {
    let url = ''
    if (report === "get_default") {
      url = `https://entekhab.baazmoon.com/quiz_api/${report}`
    }
    else{
      url = `https://entekhab.baazmoon.com/quiz_api/${report}/${file}`
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
      toast.error("فایل مورد نظر شما یافت نشد.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (response.status === 320) {
      toast.error(
        "شماره تلفن شما در سامانه موجود نیست. با پشتیبانی تماس بگیرید.",
        {
          position: toast.POSITION.BOTTOM_CENTER,
        }
      );
    } else if (response.status === 326) {
      toast.error(
        "شما به خروجی کارنامه خود دسترسی ندارید. با مشاور خود مطرح کنید.",
        {
          position: toast.POSITION.BOTTOM_CENTER,
        }
      );
    } else if (response.status === 321) {
      toast.error("در حال حاضر آزمون‌های شما به پایان نرسیده است.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (response.status === 322) {
      toast.error("کارنامه‌ها درحال آماده سازی می‌باشد.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      toast.error("مشکلی در سامانه پیش‌آمده لحظاتی دیگر مراجعه نمایید", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  } catch (error) {
    toast.error("مشکلی در سامانه پیش‌آمده لحظاتی دیگر مراجعه نمایید", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
};
