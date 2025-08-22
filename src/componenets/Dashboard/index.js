import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Student from "./Student";
import Consultant from "./Consultant";
import Institute from "./Institute";
import { Page } from "./ProfileElements";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [userRole] = useState(JSON.parse(localStorage.getItem("user-role")));

  useEffect(() => {
    if (userInfo?.data?.user_id === undefined) {
      navigate("/signin");
    }
  }, [userInfo]);

  return (
    <>
      <Page>
        {userRole === "stu" ? (
          // <Student userInfo={userInfo} />
          <></>
        ) : userRole === "con" ? (
          // <Consultant userInfo={userInfo} />
          <></>
        ) : userRole === "ins" ? (
          // <Institute userInfo={userInfo} />
          <></>
        ) : (
          <></>
        )}
      </Page>
    </>
  );
};

export default Dashboard;
