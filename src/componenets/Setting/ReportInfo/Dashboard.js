import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditInfoUser from "./EditInofUser";
import ShowInfoUser from "./ShowInofUser";
import Loader from "../../../helper/Loader";
import { GetButtonColor } from "../../../helper/buttonColor";
import { Alert, Snackbar } from "@mui/material";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [final, setFinal] = useState();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getStudentInfo = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: "https://student.baazmoon.com/ERS/select_request",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          table: "users",
          method_type: "select_student_info",
          data: {
            user_id: userInfo?.data.user_id,
            token: JSON.parse(localStorage.getItem("token")),
          },
        },
      });
      if (response?.data?.status === 200) {
        setUserDetails(response?.data?.response?.data);
        setFinal(response?.data?.response?.data?.finalized);
      } else if (response?.data?.status === 404) {
        setSnackbar({
          open: true,
          message: "نشست شما به پایان رسیده  لطفا دوباره وارد شوید.",
          severity: "error",
        });
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user-info");
          localStorage.removeItem("user-role");
          window.location.reload();
        }, 3000);
      } else {
        setSnackbar({
          open: true,
          message: response?.data?.error,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت اطلاعات کاربر",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (!userInfo?.data?.user_id) {
      navigate("/signin");
    } else {
      setLoading(true);
      getStudentInfo().finally(() => setLoading(false));
    }
  }, [userInfo, reload]);

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <>
      {[0, 1, 2].includes(final) ? (
        <EditInfoUser
          userData={userDetails}
          final={final}
          setReload={setReload}
          reload={reload}
        />
      ) : (
        <ShowInfoUser userDetails={userDetails} userInfo={userInfo} />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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

export default Dashboard;
