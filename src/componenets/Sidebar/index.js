import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CloseIcon,
  Icon,
  SidebarContainer,
  SidebarLink,
  SidebarMenu,
  SidebarWrapper,
  UserCard,
} from "./SidebarElements";
import { NavData } from "./SideData";
import { Body } from "../Typography/Body";
import logo from "../../assets/images/logo.png";
import { FontWeight } from "../Typography/Base";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";

const Sidebar = ({ isOpen, toggle, setIsOpen }) => {
  const navigate = useNavigate();
  const [Info] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [Role] = useState(JSON.parse(localStorage.getItem("user-role")));
  const [loggedIn, setLoggedIn] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (Info?.value?.user_id === undefined) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, [Info]);

  const delete_token = async () => {
    try {
      const response = await axios.post(
        "https://entekhab.yejooredigeh.com/ERS/delete_request",
        {
          table: "users",
          method_type: "delete_token",
          data: {
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
      if (!loggedIn) {
        delete_token().then(() => {
          localStorage.clear();
          navigate("/");
          window.location.reload();
        });
      } else {
        navigate(path);
        setIsOpen(!isOpen);
      }
    } else {
      navigate(path);
      setIsOpen(!isOpen);
    }
  };
  const go_to_pathNew = (path) => {
    navigate(path);
    setIsOpen(!isOpen);
  };
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      function handleClickOutside(event) {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);
  return (
    <SidebarContainer isOpen={isOpen} onClick={toggle} ref={sidebarRef}>
      <Icon>
        <CloseIcon />
      </Icon>
      {loggedIn ? (
        <UserCard
          style={{
            textAlign: "center",
            alignItems: "center",
            borderRadius: "8px",
            padding: "24px",
            marginTop: "100px",
            marginRight: "20px",
            marginLeft: "20px",
          }}
        >
          <img
            src={
              Info?.data?.pic
                ? `https://entekhab.yejooredigeh.com/ERS/get_user_pic/${Info?.data?.pic}`
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
      ) : (
        <></>
      )}
      <SidebarWrapper>
        {Role && NavData[Role] ? (
          <SidebarMenu>
            {NavData[Role]?.map((item, index) => (
              <SidebarLink
                to={item.path}
                onClick={() => go_to_path(item.path)}
                delay={`${index * 0.2}s`}
                key={index}
              >
                {item.name}
              </SidebarLink>
            ))}
          </SidebarMenu>
        ) : (
          <SidebarMenu>
            {NavData["other"].map((item, index) => (
              <SidebarLink
                to={item.to}
                onClick={() => go_to_pathNew(item.path)}
                delay={`${index * 0.2}s`}
                key={index}
              >
                {item.name}
              </SidebarLink>
            ))}
          </SidebarMenu>
        )}
      </SidebarWrapper>
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
    </SidebarContainer>
  );
};

export default Sidebar;
