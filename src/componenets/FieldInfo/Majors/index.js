import React, { useState } from "react";
import { majors_info } from "./data";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  styled,
  Box,
  Container as MuiContainer
} from "@mui/material";
import { GetBackGroundColor, GetButtonColor } from "../../../helper/buttonColor";

const StyledContainer = styled(MuiContainer)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const MajorGrid = styled(Grid)(({ theme }) => ({
  justifyContent: "center",
  gap: theme.spacing(3),
  padding: theme.spacing(2, 0),
}));

const MajorCardContainer = styled(Box)(({ theme, isfemale }) => ({
  cursor: "pointer",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  transition: "all 0.3s ease",
  border: `2px solid ${GetButtonColor(isfemale)}`,
  backgroundColor: GetBackGroundColor(isfemale),
  boxShadow: theme.shadows[2],
  height: "120px", // Fixed height
  width: "100%", // Full width of grid item
  minWidth: "250px", // Minimum width
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
    borderColor: GetButtonColor(isfemale, true),
  },
}));

const IconWrapper = styled("img")(({ theme }) => ({
  width: "60px", // Fixed size
  height: "60px", // Fixed size
  minWidth: "60px", // Prevent shrinking
  objectFit: "contain",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
}));

const MajorText = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
  fontWeight: 700,
  color: theme.palette.text.primary,
  textAlign: "right",
  flexGrow: 1,
  fontSize: "1.1rem", // Base font size
  lineHeight: 1.4,
  [theme.breakpoints.down('md')]: {
    fontSize: "1rem", // Slightly smaller on medium screens
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: "0.95rem", // Smaller on mobile
  },
}));

function groupByNumber(data) {
  const result = {};
  data.forEach((item) => {
    if (!result[item.number]) {
      result[item.number] = [];
    }
    result[item.number].push(item);
  });
  return Object.values(result);
}

const SubMajorText = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.secondary,
  fontSize: "0.9rem",
  marginTop: "4px",
  [theme.breakpoints.down('md')]: {
    fontSize: "0.85rem",
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: "0.8rem",
  },
}));

const Majors = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const groupedFields = groupByNumber(majors_info);
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));

  // Calculate font size based on screen size
  const getFontSize = () => {
    if (isMobile) return "0.95rem";
    if (isTablet) return "1rem";
    return "1.1rem";
  };

  return (
    <StyledContainer maxWidth="lg">
      <MajorGrid container>
        {groupedFields.map((group) =>
          group.map((field) => (
            <Grid
              item
              key={field.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ display: 'flex' }}
            >
              <MajorCardContainer
                onClick={() => navigate("/fields/" + field.id)}
                isfemale={userInfo?.data?.sex}
              >
                <IconWrapper
                  src={`https://student.baazmoon.com/ERS/get_pic_info/field/${field.image}`}
                  alt={field.major}
                />
                <MajorText variant={isMobile ? "body1" : "h6"} sx={{ fontSize: getFontSize() }}>
                  {field.major}
                </MajorText>
                {field.submajor && (
                  <SubMajorText>
                    {field.submajor}
                  </SubMajorText>
                )}
              </MajorCardContainer>
            </Grid>
          ))
        )}
      </MajorGrid>
    </StyledContainer>
  );
};

export default Majors;