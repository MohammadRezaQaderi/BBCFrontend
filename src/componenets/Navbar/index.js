import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons/lib";
import { FaBars } from "react-icons/fa";
import {
  LogoIcon,
  MobileIcon,
  Nav,
  NavbarContainer,
  NavBtn,
  NavBtnLink,
  NavItem,
  NavMenu,
  NavLinks,
} from "./NavbarElements";
import { animateScroll as scroll } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { MdPersonOutline } from "react-icons/md";
import logo from "../../assets/images/logo.png";
import "./style.css";
import { Body } from "../Typography/Body";
import { FontWeight } from "../Typography/Base";
import { NavData } from "../Sidebar/SideData";

const Navbar = ({ toggle }) => {
  const navigate = useNavigate();
  const [scrollNav, setScrollNav] = useState(false);
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [loggedIn, setLoggedIn] = useState(false);

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  useEffect(() => {
    if (userInfo?.data?.user_id === undefined) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, [userInfo]);

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
  }, []);

  const toggleHome = () => {
    navigate("/");
    scroll.scrollToTop();
  };

  const getName = () => {
    if (["ins"].includes(userInfo?.data?.role)) {
      return userInfo?.data?.name;
    } else {
      return userInfo?.data.first_name + " " + userInfo?.data.last_name;
    }
  };

  // Filter out the signin route from other navigation items
  const filteredNavItems = NavData.other.filter(item => item.path !== "/signin");

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav scrollNav={scrollNav}>
          <NavbarContainer>
            <LogoIcon
              src={
                userInfo?.data?.pic
                  ? `https://student.baazmoon.com/ERS/get_user_pic/${userInfo?.data?.pic}`
                  : logo
              }
              to="/"
              onClick={toggleHome}
            />

            <MobileIcon onClick={toggle}>
              <FaBars style={{ color: "#36ae7c" }} />
            </MobileIcon>

            {!loggedIn ? (
              <>
                <NavMenu>
                  {filteredNavItems.map((item, index) => (
                    <NavItem key={index}>
                      <NavLinks
                        to={item.path}
                        onClick={() => navigate(item.path)}
                        smooth={true}
                        duration={500}
                        spy={true}
                        exact="true"
                        offset={-80}
                        className="nav-link"
                      >
                        {item.name}
                        <span className="nav-link-underline"></span>
                      </NavLinks>
                    </NavItem>
                  ))}
                </NavMenu>

                <NavBtn>
                  <NavBtnLink scrollNav={scrollNav} to="/signin">
                    ورود / ثبت‌نام
                  </NavBtnLink>
                </NavBtn>
              </>
            ) : (
              <NavBtn
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/dashboard")}
              >
                <Body fontWeight={FontWeight.Meduim} color={"#000"}>
                  {getName()}
                </Body>
                <MdPersonOutline size="1.8em" color="#000" />
              </NavBtn>
            )}
          </NavbarContainer>
        </Nav>
      </IconContext.Provider>
    </>
  );
};

export default Navbar;