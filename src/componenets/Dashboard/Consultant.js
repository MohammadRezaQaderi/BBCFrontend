import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OverView from "./OverView";
import "./style.css";
import axios from "axios";

const Consultant = ({ userInfo }) => {
  const [data, setData] = useState();

  const getUserInfo = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: "https://student.baazmoon.com/bbc_api/select_request",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          table: "users",
          method_type: "select_dashboard_info",
          data: {
            user_id: userInfo?.data.user_id,
            token: JSON.parse(localStorage.getItem("token")),
          },
        },
      });
      if (response?.data?.status === 200) {
        setData(response?.data?.response?.data);
      } else if (response?.data?.status === 404) {
        toast.error("نشست شما به پایان رسیده  لطفا دوباره وارد شوید.");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user-info");
          localStorage.removeItem("user-role");
          window.location.reload();
        }, 5000);
      } else {
        toast.error(response?.data?.error);
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات کاربر");
    }
  };

  useEffect(() => {
    getUserInfo().then(() => {});
  }, []);

  return (
    <>
      <div style={{}}>
        <div className="d-flex flex-column justify-content-center wrap">
          <div className="w-100 row">
            <div className="col-lg-6 col-md-6 col-sm-6 mb-5">
              <OverView
                type="student"
                count={data ? data.GLU + data.GLA : "-"}
                title="کل خرید سراسری"
                sex={userInfo?.data?.sex}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 mb-5">
              <OverView
                type="student"
                count={data ? data.GLA : "-"}
                title="باقی مانده سراسری"
                sex={userInfo?.data?.sex}
              />
            </div>
          </div>
          <div className="w-100 row">
            <div className="col-lg-6 col-md-6 col-sm-6 mb-5">
              <OverView
                type="student"
                count={data ? data.GLFU + data.GLFA : "-"}
                title="کل خرید فرهنگیان"
                sex={userInfo?.data?.sex}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 mb-5">
              <OverView
                type="student"
                count={data ? data.GLFA : "-"}
                title="باقی مانده فرهنگیان"
                sex={userInfo?.data?.sex}
              />
            </div>
          </div>
          <div className="w-100 row">
            <div className="col-lg-6 col-md-6 col-sm-6 mb-5">
              <OverView
                type="student"
                count={data ? data.FRU + data.FRA : "-"}
                title="کل خرید آزاد"
                sex={userInfo?.data?.sex}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 mb-5">
              <OverView
                type="student"
                count={data ? data.FRA : "-"}
                title="باقی مانده آزاد"
                sex={userInfo?.data?.sex}
              />
            </div>
          </div>
          <div className="w-100 row">
            <div className="col-lg-6 col-md-6 col-sm-6 mb-5">
              <OverView
                type="student"
                count={data ? data.AGU + data.AGA : "-"}
                title="کل خرید استعداد سنجی"
                sex={userInfo?.data?.sex}
              />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 mb-5">
              <OverView
                type="student"
                count={data ? data.AGA : "-"}
                title="باقی مانده استعداد سنجی"
                sex={userInfo?.data?.sex}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-center" rtl={true} />
    </>
  );
};

export default Consultant;
