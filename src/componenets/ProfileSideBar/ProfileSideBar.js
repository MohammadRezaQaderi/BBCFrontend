import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { FontWeight } from "../Typography/Base";
import { Body, Body2 } from "../Typography/Body";
import { NavData } from "../Sidebar/SideData";
import logo from "../../assets/images/logo.png";
import { GetButtonColor } from "../../helper/buttonColor";
import axios from "axios";
import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 10px;
  @media screen and (max-width: 768px) {
    display: none;
  }
  @media screen and (max-width: 480px) {
    display: none;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  flex-grow: 0;
  gap: 10px;
  margin-bottom: 100px;
  margin-left: 20px;
  margin-right: 20px;
  width: 20%;
  min-width: 20%;
  height: auto;
  padding-bottom: 50px;
  @media screen and (max-width: 768px) {
    display: none;
  }
  @media screen and (max-width: 480px) {
    display: none;
  }
`;

const UserCard = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const Item = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  &:hover {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      ${({ hover }) => hover} 100%
    );
  }
  ${({ isLast }) => (isLast ? "" : `border-bottom: 1px solid #ddd;`)}
`;

export const ProfileSideBar = () => {
  const [Info] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [Role] = useState(JSON.parse(localStorage.getItem("user-role")));
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const delete_token = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/ERS/delete_request",
        {
          table: "users",
          method_type: "delete_token",
          data: {
            user_id: Info?.data.user_id,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
      } else {
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "در ارتباط با سامانه به مشکل برخوردیم.",
        severity: "error",
      });
    }
  };

  const go_to_path = (path) => {
    if (path === "/signin") {
      delete_token().then(() => {
        localStorage.clear();
        navigate("/")
        window.location.reload();
      });
    }
    navigate(path);
  };
  return (
    <Container>
      <UserCard
        style={{
          textAlign: "center",
          alignItems: "center",
          border: "1px solid #000",
          borderRadius: "8px",
          padding: "24px",
        }}
      >
        <img
          src={
            Info?.data?.pic
              ? `https://student.baazmoon.com/ERS/get_user_pic/${Info?.data?.pic}`
              : logo
          }
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Body fontWeight={FontWeight.Meduim} color={"#000"}>
            {Info?.data.first_name + " " + Info?.data.last_name}
          </Body>
        </div>
      </UserCard>
      <Wrapper>
        {Role && NavData[Role] ? (
          NavData[Role]?.map((item, index) => (
            <Item
              isLast={item.isLast}
              onClick={() => go_to_path(item.path)}
              hover={
                Info?.data?.sex === 2
                  ? "rgba(239, 170, 188, 1)"
                  : "rgba(90, 178, 255, 1)"
              }
            >
              {item.icon}
              <Body2
                fontWeight={FontWeight.Meduim}
                color={
                  window.location.pathname === item.path
                    ? GetButtonColor(Info?.data?.sex)
                    : "#000"
                }
                hover={GetButtonColor(Info?.data?.sex)}
              >
                {item.name}
              </Body2>
            </Item>
          ))
        ) : (
          <></>
        )}
      </Wrapper>
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
    </Container>
  );
};
