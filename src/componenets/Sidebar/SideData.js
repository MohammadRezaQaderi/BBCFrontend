import { IoMdExit } from "react-icons/io";
import { FaBook } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { GrSelect } from "react-icons/gr";
import { MdSpaceDashboard } from "react-icons/md";
import { GiArcheryTarget } from "react-icons/gi";
import { MdOutlinePayments } from "react-icons/md";
import { FaRegQuestionCircle } from "react-icons/fa";
import { MdOutlineTextFields } from "react-icons/md";
import { PiCertificateLight } from "react-icons/pi";
import { MdInfoOutline } from "react-icons/md";

export const NavData = {
  stu: [
    {
      name: "داشبورد",
      path: "/dashboard",
      isLast: false,
      icon: <MdSpaceDashboard style={{ width: "30px", height: "30px" }} />,
    },
    {
      name: "تخمین رتبه",
      path: "/estimate",
      isLast: false,
      icon: <FaRegQuestionCircle style={{ width: "30px", height: "30px" }} />,
    },
    // {
    //   name: "انتخاب رشته",
    //   path: "/pick_field",
    //   isLast: false,
    //   icon: <GrSelect style={{ width: "30px", height: "30px" }} />,
    // },
    {
      name: "استعدادسنجی",
      path: "/quiz_detail",
      isLast: false,
      icon: <PiCertificateLight style={{ width: "30px", height: "30px" }} />,
    },
    // {
    //   name: "هوشمند",
    //   path: "/entekhab_hoshmand",
    //   isLast: false,
    //   icon: <GiArcheryTarget style={{ width: "30px", height: "30px" }} />,
    // },
    {
      name: "معرفی رشته‌ها",
      path: "/majors",
      isLast: false,
      icon: <MdOutlineTextFields style={{ width: "30px", height: "30px" }} />,
    },
    {
      name: "دفترچه",
      path: "/notebookInfo",
      isLast: false,
      icon: <FaBook style={{ width: "30px", height: "30px" }} />,
    },
    {
      name: "خرید محصول",
      path: "/payments",
      isLast: false,
      icon: <MdOutlinePayments style={{ width: "30px", height: "30px" }} />,
    },
    // {
    //   name: "ارتباط باما",
    //   path: "/contact_us",
    //   isLast: false,
    //   icon: <MdInfoOutline style={{ width: "30px", height: "30px" }} />,
    // },
    {
      name: "تنظیمات",
      path: "/setting",
      isLast: false,
      icon: <IoSettings style={{ width: "30px", height: "30px" }} />,
    },
    {
      name: "خروج",
      path: "/signin",
      isLast: true,
      icon: <IoMdExit style={{ width: "30px", height: "30px" }} />,
    },
  ],
  other: [
    {
      name: "خونه",
      path: "/",
      isLast: false,
      icon: <MdSpaceDashboard style={{ width: "30px", height: "30px" }} />,
      to: "#about",
    },
    {
      name: "خدماتمون",
      path: "/services",
      isLast: false,
      icon: <MdSpaceDashboard style={{ width: "30px", height: "30px" }} />,
      to: "#about",
    },
    {
      name: "تیممون",
      path: "/teams",
      isLast: false,
      icon: <MdSpaceDashboard style={{ width: "30px", height: "30px" }} />,
      to: "#about",
    },
    {
      name: "تخمین تراز",
      path: "/konkor_estimate",
      isLast: false,
      icon: <MdSpaceDashboard style={{ width: "30px", height: "30px" }} />,
      to: "#about",
    },
    {
      name: "ورود",
      path: "/signin",
      isLast: false,
      icon: <IoMdExit style={{ width: "30px", height: "30px" }} />,
      to: "#about",
    },
  ],
};
