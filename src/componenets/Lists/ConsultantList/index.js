import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import AddConsultantForm from "../../Modals/AddConsultant";
import { createTheme, ThemeProvider } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_FA } from "material-react-table/locales/fa";
import { tableConfig } from "./tableConfig";
import "./style.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import EditConsultantForm from "../../Modals/EditConsultant";
import { GetButtonColor } from "../../../helper/buttonColor";
import Loader from "../../../helper/Loader";
import ErrorState from "../../FPList/NoUser";

const ConContainer = styled.div`
  width: 100%;
  margin-top: 50px;
  @media screen and (max-width: 768px) {
    margin-top: 50px;
  }
  @media screen and (max-width: 480px) {
    margin-top: 50px;
  }
`;

const ConsultantContainer = styled.div`
  width: 95%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;
const ConsultantList = () => {
  const navigate = useNavigate();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [userRole] = useState(JSON.parse(localStorage.getItem("user-role")));
  const [hConData, setHConData] = useState([]);
  const [conData, setConData] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  const conColumns = useMemo(() => tableConfig["con"], []);

  const select_consultants = async () => {
    try {
      const response = await axios.post(
        "https://student.baazmoon.com/bbc_api/select_request",
        {
          table: "users",
          method_type: "select_consultants",
          data: {
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      if (response.data.tracking_code !== null) {
        setConData(response?.data?.response?.con);
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
      select_consultants().then(() => {
        setLoading(false);
      });
    }
  }, [userInfo, reload]);

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <ConContainer>
      <ConsultantContainer className="container">
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
                  لیست مشاوران
                </Typography>
                <AddConsultantForm
                  setReload={setReload}
                />
              </Grid>
            </Grid>
            <Divider sx={{ backgroundColor: GetButtonColor(userInfo?.data?.sex) }} />
          </Box>
          {conData?.length > 0 ? (
            <div style={{ marginTop: "50px" }}>
              <ThemeProvider theme={createTheme({ direction: "rtl" })}>
                <MaterialReactTable
                  autoResetPageIndex={false}
                  columns={conColumns}
                  data={conData}
                  enableSorting={true}
                  initialState={{
                    density: "compact",
                    pagination: { pageSize: 50 },
                  }}
                  enableDensityToggle={false}
                  enableRowActions
                  getRowId={(row) => row.userId}
                  renderRowActions={({ row, table }) => (
                    <EditConsultantForm
                      type="edit"
                      setReload={setReload}
                      data={row.original}
                      headConsultants={hConData}
                      userInfo={userInfo}
                      userRole={userRole}
                    />
                  )}
                  localization={MRT_Localization_FA}
                  enableStickyHeader
                  muiTableContainerProps={{
                    sx: {
                      maxHeight: "300px",
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
              title={"اطلاعاتی در مورد مشاوران یافت نشد"}
              description={
                "لطفا با استفاده از دکمه افزودن مشاور برای موسسه خود مشاور تعریف کنید.(البته در ابتدا برای خود سرمشاور تعریف کنید)"
              }
            />
          )}
        </Paper>
      </ConsultantContainer>
    </ConContainer>
  );
};

export default ConsultantList;
