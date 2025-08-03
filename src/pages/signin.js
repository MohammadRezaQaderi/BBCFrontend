import React, { useState } from "react";
import ScrollToTop from "../componenets/ScrollToTop";
import Signin from "../componenets/Signin";
import Navbar from "../componenets/Navbar";
import Sidebar from "../componenets/Sidebar";

const SigninPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ScrollToTop />
      <Sidebar isOpen={isOpen} toggle={toggle} setIsOpen={setIsOpen} />
      <Navbar toggle={toggle} />
      <Signin />
    </>
  );
};

export default SigninPage;
