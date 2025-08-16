import React, { useEffect, useMemo, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import "./style.css";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaUserCheck } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import EditStuAccess from "./EditStuAccess";
import EditStudentForm from "../../Modals/EditStudent";
import UserDetailsModal from "../../UserInfoModal";
import EditInfoModal from "../../Modals/EditInfoModal";
import FirstAddStudentForm from "../../Modals/FirstAddStudent";
import Loader from "../../../helper/Loader";
import { GetButtonColor } from "../../../helper/buttonColor";

const StudentContainer = styled.div`
  width: 70%;
  margin-top: 50px;
  @media screen and (max-width: 768px) {
    margin-top: 50px;
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    margin-top: 50px;
    width: 100%;
  }
`;

const barnch = (filed) => {
  if (filed === 1) {
    return "تجربی";
  } else if (filed === 2) {
    return "ریاضی";
  } else if (filed === 3) {
    return "انسانی";
  } else if (filed === 4) {
    return "زبان";
  } else if (filed === 5) {
    return "هنر";
  }
};

const StudentList = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [userRole] = useState(JSON.parse(localStorage.getItem("user-role")));
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [data, setData] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [openAccess, setOpenAccess] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [kind, setKind] = useState("");
  const [stuId, setStuId] = useState();

  const handleOpen = (user_id) => {
    setStuId(user_id);
    select_student_data(user_id).then(() => {
      setModalOpen(true);
    });
  };

  const handleClose = () => {
    setUserDetails({});
    setStuId();
    setModalOpen(false);
  };

  const handleCloseData = () => {
    setModalOpen(false);
    setOpenEditModal(true);
  };

  const handleOpenAccess = (k, s) => {
    setKind(k);
    setStuId(s);
    setOpenAccess(true);
  };

  const tableConfig = {
    ins: [
      {
        accessorKey: "name",
        header: "نام",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <span
              onClick={() => handleOpen(user_id)}
              style={{ cursor: "pointer" }}
            >
              {row}
            </span>
          );
        },
      },
      {
        accessorKey: "phone",
        header: "نام کاربری",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام کاربری" },
      },
      {
        accessorKey: "password",
        header: "رمز عبور",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رمز عبور" },
      },
      {
        accessorKey: "field",
        header: "رشته",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رشته" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return <span>{barnch(row)}</span>;
        },
      },
      {
        accessorKey: "rank",
        header: "رتبه",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رتبه" },
      },
      {
        accessorKey: "GL",
        header: "سراسری‌",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "سراسری‌",
        },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenAccess("GL", user_id)}
                />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "GLF",
        header: "فرهنگیان",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "فرهنگیان",
        },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenAccess("GLF", user_id)}
                />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "FR",
        header: "آزاد",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "آزاد" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenAccess("FR", user_id)}
                />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "AG",
        header: "استعدادسنجی",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "استعدادسنجی" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenAccess("AG", user_id)}
                />
              )}
            </>
          );
        },
      },
    ],
    hCon: [
      {
        accessorKey: "name",
        header: "نام",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <span
              onClick={() => handleOpen(user_id)}
              style={{ cursor: "pointer" }}
            >
              {row}
            </span>
          );
        },
      },
      {
        accessorKey: "phone",
        header: "نام کاربری",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام کاربری" },
      },
      {
        accessorKey: "password",
        header: "رمز عبور",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رمز عبور" },
      },
      {
        accessorKey: "field",
        header: "رشته",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رشته" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return <span>{barnch(row)}</span>;
        },
      },
      {
        accessorKey: "rank",
        header: "رتبه",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رتبه" },
      },
      {
        accessorKey: "GL",
        header: "سراسری‌",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "سراسری‌",
        },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus size={24} />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "GLF",
        header: "فرهنگیان",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "فرهنگیان",
        },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus size={24} />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "FR",
        header: "آزاد",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "آزاد" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus size={24} />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "AG",
        header: "استعدادسنجی",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "استعدادسنجی" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus size={24} />
              )}
            </>
          );
        },
      },
    ],
    con: [
      {
        accessorKey: "name",
        header: "نام",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <span
              onClick={() => handleOpen(user_id)}
              style={{ cursor: "pointer" }}
            >
              {row}
            </span>
          );
        },
      },
      {
        accessorKey: "phone",
        header: "نام کاربری",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام کاربری" },
      },
      {
        accessorKey: "password",
        header: "رمز عبور",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رمز عبور" },
      },
      {
        accessorKey: "field",
        header: "رشته",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رشته" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return <span>{barnch(row)}</span>;
        },
      },
      {
        accessorKey: "rank",
        header: "رتبه",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رتبه" },
      },
      {
        accessorKey: "GL",
        header: "سراسری‌",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "سراسری‌",
        },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus size={24} />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "GLF",
        header: "فرهنگیان",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "فرهنگیان",
        },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus size={24} />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "FR",
        header: "آزاد",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "آزاد" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus size={24} />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "AG",
        header: "استعدادسنجی",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "استعدادسنجی" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus size={24} />
              )}
            </>
          );
        },
      },
    ],
    oCon: [
      {
        accessorKey: "name",
        header: "نام",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <span
              onClick={() => handleOpen(user_id)}
              style={{ cursor: "pointer" }}
            >
              {row}
            </span>
          );
        },
      },
      {
        accessorKey: "phone",
        header: "نام کاربری",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "نام کاربری" },
      },
      {
        accessorKey: "password",
        header: "رمز عبور",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رمز عبور" },
      },
      {
        accessorKey: "field",
        header: "رشته",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رشته" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return <span>{barnch(row)}</span>;
        },
      },
      {
        accessorKey: "rank",
        header: "رتبه",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "رتبه" },
      },
      {
        accessorKey: "GL",
        header: "سراسری‌",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "سراسری‌",
        },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenAccess("GL", user_id)}
                />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "GLF",
        header: "فرهنگیان",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: {
          placeholder: "فرهنگیان",
        },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenAccess("GLF", user_id)}
                />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "FR",
        header: "آزاد",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "آزاد" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenAccess("FR", user_id)}
                />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "AG",
        header: "استعدادسنجی",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellFilterTextFieldProps: { placeholder: "استعدادسنجی" },
        Cell: ({ cell }) => {
          const row = cell.getValue();
          const user_id = cell.row.original.user_id;
          return (
            <>
              {row === 1 ? (
                <FaUserCheck size={24} style={{}} />
              ) : (
                <FaUserPlus
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenAccess("AG", user_id)}
                />
              )}
            </>
          );
        },
      },
    ],
  };

  const columns = useMemo(() => tableConfig[userRole], []);

  const select_cons_stu = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_cons_stu",
          data: {
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setConsultants(response?.data?.response?.con);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    }
  };

  const select_students = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_students",
          data: {
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setData(response?.data?.response?.stu);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    }
  };

  const select_student_data = async (user_id) => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_student_data",
          data: {
            stu_id: parseInt(user_id),
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setUserDetails(response?.data?.response?.stu);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    }
  };

  useEffect(() => {
    if (userInfo?.data.user_id === undefined) {
      navigate("/signin");
    } else {
      setLoading(true);
      select_students().then(() => {
        if (["ins", "hCon"].includes(userRole)) {
          select_cons_stu().then(() => {
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
    }
  }, [userInfo, reload]);

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <StudentContainer className="container">
      <Grid container mt={3}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            component="h4"
            variant="h6"
            color="mainText"
            fontWeight={500}
          >
            لیست دانش‌آموزان
          </Typography>
          <FirstAddStudentForm
            setReload={setReload}
            consultants={consultants}
          />
        </Grid>
      </Grid>
      {data?.length > 0 ? (
        <div style={{ marginTop: "50px" }}>
          {["ins", "oCon"].includes(userRole) ? (
            <ThemeProvider theme={createTheme({ direction: "rtl" })}>
              <MaterialReactTable
                autoResetPageIndex={false}
                columns={columns}
                data={data}
                enableSorting={true}
                initialState={{
                  density: "compact",
                  pagination: { pageSize: 50 },
                }}
                enableDensityToggle={false}
                getRowId={(row) => row.userId}
                enableRowActions
                renderRowActions={({ row, table }) => (
                  <EditStudentForm
                    type="edit"
                    setReload={setReload}
                    InputData={row.original}
                    consultants={consultants}
                  />
                )}
                localization={MRT_Localization_FA}
              />
            </ThemeProvider>
          ) : (
            <ThemeProvider theme={createTheme({ direction: "rtl" })}>
              <MaterialReactTable
                autoResetPageIndex={false}
                columns={columns}
                data={data}
                enableSorting={true}
                initialState={{
                  density: "compact",
                  pagination: { pageSize: 50 },
                }}
                enableDensityToggle={false}
                getRowId={(row) => row.userId}
                localization={MRT_Localization_FA}
              />
            </ThemeProvider>
          )}
        </div>
      ) : (
        <Grid item xs={12}>
          <img
            src={`https://student.baazmoon.com/bbc_api/get_pic/no-data.png`}
            alt="no-data"
            style={{
              width: "220px",
              height: "220px",
              display: "block",
              margin: "50px auto 0px",
            }}
          />
          <Typography
            color="#ccc"
            fontWeight={500}
            textAlign="center"
            marginTop={1}
          >
            اطلاعاتی در مورد دانش‌آموزان یافت نشد
          </Typography>
        </Grid>
      )}
      <EditStuAccess
        open={openAccess}
        setOpen={setOpenAccess}
        kind={kind}
        setKind={setKind}
        userInfo={userInfo}
        stu_id={stuId}
        setStuId={setStuId}
        setReload={setReload}
      />
      <UserDetailsModal
        open={modalOpen}
        handleClose={handleClose}
        handleCloseData={handleCloseData}
        userDetails={userDetails}
      />
      {openEditModal && (
        <EditInfoModal
          openMo={openEditModal}
          setOpenMo={setOpenEditModal}
          setUserData={setUserDetails}
          setReload={setReload}
          stu_id={stuId}
          userData={userDetails}
        />
      )}
    </StudentContainer>
  );
};

export default StudentList;
