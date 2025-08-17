import { Alert, Box, Divider, Grid, Paper, Snackbar, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider, Autocomplete } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import "./style.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosCloseCircle } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import FreeModal from "../../Modals/FreeModal/FreeModal";
import { GetButtonColor } from "../../../helper/buttonColor";
import Loader from "../../../helper/Loader";
import ShowInfoFP from "./ShowInfoFP";
import { FaCheckCircle } from "react-icons/fa";
import ErrorState from "../../FPList/NoUser";

const student_state = [
  { name: "همه", id: 0 },
  { name: "هوشمند", id: 1 },
  { name: "آزاد", id: 2 },
];

const FPContainer = styled.div`
  width: 100%;
  margin-top: 50px;
  margin-right: 20px;
  margin-left: 20px;
  @media screen and (max-width: 768px) {
    padding-right: 10px;
    padding-left: 10px;
    margin-right: 0px;
    margin-left: 0px;
    margin-top: 50px;
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    padding-right: 10px;
    padding-left: 10px;
    margin-right: 0px;
    margin-left: 0px;
    margin-top: 50px;
    width: 100%;
  }
`;

const FieldPickList = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [userRole] = useState(JSON.parse(localStorage.getItem("user-role")));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [kind, setKind] = useState(0);
  const [userDetails, setUserDetails] = useState({});
  const [openUserInfoModal, setOpenUserInfoModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState();
  const [userField, setUserField] = useState();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const goToPickField = (user_id, finalized) => {
    if (finalized === 2) {
      navigate("/pfgl/" + user_id);
    } else {
      setSnackbar({
        open: true,
        message: "اطلاعات دانش‌آموز هنوز ثبت نهایی نشده است.",
        severity: "warning",
      });
    }
  };

  const handleOpenModal = (id, field, finalized) => {
    if (finalized === 0) {
      setSnackbar({
        open: true,
        message: "اطلاعات دانش‌آموز هنوز ثبت نهایی نشده است.",
        severity: "warning",
      });
    } else {
      setUserField(field);
      setUserId(id);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setUserId();
    setUserField();
    setOpenModal(false);
  };

  const handleOpenUser = (user_id) => {
    select_student_data(user_id).then(() => {
      setOpenUserInfoModal(true);
    });
  };

  const handleCloseUser = () => {
    setUserDetails({});
    setOpenUserInfoModal(false);
  };

  const tableConfig = useMemo(() => {
    return {
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
                onClick={() => handleOpenUser(user_id)}
                style={{ cursor: "pointer" }}
              >
                {row}
              </span>
            );
          },
        },
        {
          accessorKey: "GL",
          header: "سراسری",
          size: 100,
          muiTableHeadCellProps: {
            align: "center",
          },
          muiTableBodyCellProps: {
            align: "center",
          },
          muiTableHeadCellFilterTextFieldProps: { placeholder: "سراسری" },
          Cell: ({ cell }) => {
            const row = cell.getValue();
            const user_id = cell.row.original.user_id;
            const finalized = cell.row.original.finalized;
            return (
              <>
                {row === 1 ? (
                  <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <FiSearch
                      size={20}
                      style={{ cursor: "pointer" }}
                      title="انتخاب رشته"
                      onClick={() => goToPickField(user_id, finalized)}
                    />
                  </div>
                ) : (
                  <>-</>
                )}
              </>
            );
          },
        },
        {
          accessorKey: "GLF",
          header: "فرهنگیان",
          size: 100,
          muiTableHeadCellProps: {
            align: "center",
          },
          muiTableBodyCellProps: {
            align: "center",
          },
          muiTableHeadCellFilterTextFieldProps: { placeholder: "فرهنگیان" },
          Cell: ({ cell }) => {
            const row = cell.getValue();
            const user_id = cell.row.original.user_id;
            return (
              <>
                {row === 1 ? (
                  <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <FiSearch
                      size={20}
                      style={{ cursor: "pointer" }}
                      title="انتخاب رشته"
                      onClick={() => navigate("/pfglf/" + user_id)}
                    />
                  </div>
                ) : (
                  <>-</>
                )}
              </>
            );
          },
        },
        {
          accessorKey: "FR",
          header: "آزاد",
          size: 100,
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
            const field = cell.row.original.field;
            const finalized = cell.row.original.finalized;
            return (
              <>
                {row === 1 ? (
                  <FiSearch
                    size={20}
                    style={{ cursor: "pointer" }}
                    title="انتخاب رشته"
                    onClick={() => handleOpenModal(user_id, field, finalized)}
                  />
                ) : (
                  <>-</>
                )}
              </>
            );
          },
        },
        {
          accessorKey: "con_name",
          header: "مشاور",
          size: 50,
          muiTableHeadCellProps: {
            align: "center",
          },
          muiTableBodyCellProps: {
            align: "center",
          },
          muiTableHeadCellFilterTextFieldProps: { placeholder: "مشاور" },
          Cell: ({ cell }) => {
            const row = cell.getValue();
            const con_finalized = cell.row.original.con_finalized;
            return (
              <>
                {[2, 3].includes(kind) ? (
                  <>-</>
                ) : con_finalized === 1 ? (
                  <div>
                    {row} <FaCheckCircle size={18} style={{ color: "green" }} />
                  </div>
                ) : (
                  <div>
                    {row}{" "}
                    <IoIosCloseCircle size={21} style={{ color: "red" }} />
                  </div>
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
                onClick={() => handleOpenUser(user_id)}
                style={{ cursor: "pointer" }}
              >
                {row}
              </span>
            );
          },
        },
        {
          accessorKey: "GL",
          header: "سراسری",
          size: 100,
          muiTableHeadCellProps: {
            align: "center",
          },
          muiTableBodyCellProps: {
            align: "center",
          },
          muiTableHeadCellFilterTextFieldProps: { placeholder: "سراسری" },
          Cell: ({ cell }) => {
            const row = cell.getValue();
            const user_id = cell.row.original.user_id;
            const finalized = cell.row.original.finalized;
            return (
              <>
                {row === 1 ? (
                  <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <FiSearch
                      size={20}
                      style={{ cursor: "pointer" }}
                      title="انتخاب رشته"
                      onClick={() => goToPickField(user_id, finalized)}
                    />
                  </div>
                ) : (
                  <>-</>
                )}
              </>
            );
          },
        },
        {
          accessorKey: "GLF",
          header: "فرهنگیان",
          size: 100,
          muiTableHeadCellProps: {
            align: "center",
          },
          muiTableBodyCellProps: {
            align: "center",
          },
          muiTableHeadCellFilterTextFieldProps: { placeholder: "فرهنگیان" },
          Cell: ({ cell }) => {
            const row = cell.getValue();
            const user_id = cell.row.original.user_id;
            const finalized = cell.row.original.finalized;
            return (
              <>
                {row === 1 ? (
                  <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <FiSearch
                      size={20}
                      style={{ cursor: "pointer" }}
                      title="انتخاب رشته"
                      onClick={() => navigate("/pfglf/" + user_id)}
                    />
                  </div>
                ) : (
                  <>-</>
                )}
              </>
            );
          },
        },
        {
          accessorKey: "FR",
          header: "آزاد",
          size: 100,
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
            const field = cell.row.original.field;
            const finalized = cell.row.original.finalized;
            return (
              <>
                {row === 1 ? (
                  <FiSearch
                    size={20}
                    style={{ cursor: "pointer" }}
                    title="انتخاب رشته"
                    onClick={() => handleOpenModal(user_id, field, finalized)}
                  />
                ) : (
                  <>-</>
                )}
              </>
            );
          },
        },
        {
          accessorKey: "con_name",
          header: "تایید مشاور",
          size: 50,
          muiTableHeadCellProps: {
            align: "center",
          },
          muiTableBodyCellProps: {
            align: "center",
          },
          muiTableHeadCellFilterTextFieldProps: { placeholder: "تایید مشاور" },
          Cell: ({ cell }) => {
            const row = cell.getValue();
            const con_finalized = cell.row.original.con_finalized;
            return (
              <>
                {[2, 3].includes(kind) ? (
                  <>-</>
                ) : con_finalized === 1 ? (
                  <div>
                    {row} <FaCheckCircle size={18} style={{ color: "green" }} />
                  </div>
                ) : (
                  <div>
                    {row}{" "}
                    <IoIosCloseCircle size={21} style={{ color: "red" }} />
                  </div>
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
                onClick={() => handleOpenUser(user_id)}
                style={{ cursor: "pointer" }}
              >
                {row}
              </span>
            );
          },
        },
        {
          accessorKey: "GL",
          header: "سراسری",
          size: 100,
          muiTableHeadCellProps: {
            align: "center",
          },
          muiTableBodyCellProps: {
            align: "center",
          },
          muiTableHeadCellFilterTextFieldProps: { placeholder: "سراسری" },
          Cell: ({ cell }) => {
            const row = cell.getValue();
            const user_id = cell.row.original.user_id;
            const finalized = cell.row.original.finalized;
            return (
              <>
                {row === 1 ? (
                  <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <FiSearch
                      size={20}
                      style={{ cursor: "pointer" }}
                      title="انتخاب رشته"
                      onClick={() => goToPickField(user_id, finalized)}
                    />
                  </div>
                ) : (
                  <>-</>
                )}
              </>
            );
          },
        },
        {
          accessorKey: "GLF",
          header: "فرهنگیان",
          size: 100,
          muiTableHeadCellProps: {
            align: "center",
          },
          muiTableBodyCellProps: {
            align: "center",
          },
          muiTableHeadCellFilterTextFieldProps: { placeholder: "فرهنگیان" },
          Cell: ({ cell }) => {
            const row = cell.getValue();
            const user_id = cell.row.original.user_id;
            const finalized = cell.row.original.finalized;
            return (
              <>
                {row === 1 ? (
                  <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <FiSearch
                      size={20}
                      style={{ cursor: "pointer" }}
                      title="انتخاب رشته"
                      onClick={() => navigate("/pfglf/" + user_id)}
                    />
                  </div>
                ) : (
                  <>-</>
                )}
              </>
            );
          },
        },
        {
          accessorKey: "FR",
          header: "آزاد",
          size: 100,
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
            const field = cell.row.original.field;
            const finalized = cell.row.original.finalized;
            return (
              <>
                {row === 1 ? (
                  <FiSearch
                    size={20}
                    style={{ cursor: "pointer" }}
                    title="انتخاب رشته"
                    onClick={() => handleOpenModal(user_id, field, finalized)}
                  />
                ) : (
                  <>-</>
                )}
              </>
            );
          },
        },
        {
          accessorKey: "con_name",
          header: "مشاور",
          size: 50,
          muiTableHeadCellProps: {
            align: "center",
          },
          muiTableBodyCellProps: {
            align: "center",
          },
          muiTableHeadCellFilterTextFieldProps: { placeholder: "مشاور" },
          Cell: ({ cell }) => {
            const row = cell.getValue();
            const con_finalized = cell.row.original.con_finalized;
            return (
              <>
                {[2, 3].includes(kind) ? (
                  <>-</>
                ) : con_finalized === 1 ? (
                  <div>
                    {row} <FaCheckCircle size={18} style={{ color: "green" }} />
                  </div>
                ) : (
                  <div>
                    {row}
                    <IoIosCloseCircle size={21} style={{ color: "red" }} />
                  </div>
                )}
              </>
            );
          },
        },
      ],
    };
  }, [kind, userRole]);

  const columns = useMemo(() => {
    return tableConfig[userRole] || [];
  }, [tableConfig, userRole]);

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
        setSnackbar({
          open: true,
          message: response?.data?.error,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در دریافت اطلاعات",
        severity: "error",
      });
    }
  };

  const select_students_pf = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_students_pf",
          data: {
            kind: kind,
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setData(response?.data?.response?.stu);
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
        message: "خطا در دریافت اطلاعات",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (userInfo?.data.user_id === undefined) {
      navigate("/signin");
    } else {
      setLoading(true);
      select_students_pf().then(() => {
        setLoading(false);
      });
    }
  }, [userInfo, kind]);

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <>
      <FPContainer>
        <Paper
          elevation={3}
          sx={{
            p: 1,
            boxShadow: "none",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Grid container>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2
                }}
              >
                <Typography
                  component="h4"
                  variant="h5"
                  color={GetButtonColor(userInfo?.data?.sex)}
                  fontWeight={600}
                >
                  انتخاب رشته
                </Typography>
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <Autocomplete
                    id="controllable-states-demo"
                    fullWidth
                    value={student_state[kind]}
                    options={student_state}
                    onChange={(event, newValue) => {
                      setKind(newValue.id);
                    }}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField
                        value={kind}
                        {...params}
                        fullWidth
                        size="small"
                        label="نوع انتخاب رشته"
                      />
                    )}
                  />
                </div>
              </Grid>
            </Grid>
            <Divider sx={{ backgroundColor: GetButtonColor(userInfo?.data?.sex) }} />
          </Box>
          {data?.length > 0 ? (
            <div style={{ marginTop: "50px" }}>
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
                  enableStickyHeader
                  muiTableContainerProps={{
                    sx: {
                      maxHeight: "600px",
                    },
                  }}
                  muiTableHeadCellProps={{
                    sx: {
                      backgroundColor: "#f5f5f5",
                      fontWeight: "bold",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    },
                  }}
                  muiTableBodyProps={{
                    sx: {
                      "& tr": {
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      },
                    },
                  }}
                />
              </ThemeProvider>
            </div>
          ) : (
            <ErrorState
              action={"⚠️"}
              title={"اطلاعاتی لیست انتخاب رشته دانش‌آموزان یافت نشد"}
              description={
                "لطفا در ابتدا دانش‌آموز تعریف کنید تا در این لیست بتوانید خدمات مورد نظر رو به دانش‌آموز بدهید."
              }
              needHeight={false}
            />
          )}
          {openModal && (
            <FreeModal
              userId={userId}
              userInfo={userInfo}
              handleCloseModal={handleCloseModal}
              openModal={openModal}
              userField={userField}
            />
          )}
          {openUserInfoModal && (
            <ShowInfoFP
              userDetails={userDetails}
              open={openUserInfoModal}
              onClose={handleCloseUser}
            />
          )}
        </Paper>
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
      </FPContainer>
    </>
  );
};

export default FieldPickList;
