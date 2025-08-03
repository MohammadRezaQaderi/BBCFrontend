import React, { useState } from "react";
import { new_fields } from "./data";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  styled,
  Box,
  Container as MuiContainer,
  Divider
} from "@mui/material";
import { majors_info } from "../Majors/data";
import { GetButtonColor, GetBackGroundColor } from "../../../helper/buttonColor";

const StyledContainer = styled(MuiContainer)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: theme.spacing(4),
  gap: theme.spacing(2),
}));

const FieldImage = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: '50%',
  boxShadow: theme.shadows[4],
  objectFit: 'contain',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    width: 80,
    height: 80,
  },
}));

const CardFieldImage = styled('img')(({ theme }) => ({
  width: 75,
  height: 75,
  borderRadius: '50%',
  boxShadow: theme.shadows[4],
  objectFit: 'contain',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    width: 70,
    height: 70,
  },
}));

const FieldGrid = styled(Grid)(({ theme }) => ({
  justifyContent: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(3, 0),
}));

const FieldCardContainer = styled(Box)(({ theme, isfemale }) => ({
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  border: `2px solid ${GetButtonColor(isfemale)}`,
  backgroundColor: GetBackGroundColor(isfemale),
  boxShadow: theme.shadows[2],
  height: 120,
  width: 300,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
    borderColor: GetButtonColor(isfemale, true),
  },
}));

const FieldTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  textAlign: 'center',
  fontSize: '1rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '0.95rem',
  },
}));

const FieldCard = ({ title, onClick, icon, isFemale }) => {
  return (
    <FieldCardContainer onClick={onClick} isfemale={isFemale}>
      {icon && (
        <CardFieldImage
          src={`https://entekhab.yejooredigeh.com/ERS/get_pic_info/field/${icon}`}
          alt={title}
        />
      )}
      <FieldTitle>{title}</FieldTitle>
    </FieldCardContainer>
  );
};

const Fields = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));

  const filteredFields = new_fields.filter(field => field.number === parseInt(id));
  const filteredMajor = majors_info.find(major => major.id === parseInt(id));

  if (!filteredMajor || filteredFields.length === 0) {
    return (
      <StyledContainer maxWidth="lg">
        <Typography variant="h5" color="error" textAlign="center" py={10}>
          متاسفانه اطلاعاتی که به دنبال آن هستید موجود نیست.
        </Typography>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <HeaderContainer>
        <Box textAlign="center">
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {filteredMajor.major}
            {filteredMajor.submajor && (
              <Typography variant="subtitle1" color="text.secondary">
                {filteredMajor.submajor}
              </Typography>
            )}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            رشته‌های تحصیلی منتخب
          </Typography>
        </Box>

        {filteredMajor.image && (
          <FieldImage
            src={`https://entekhab.yejooredigeh.com/ERS/get_pic_info/field/${filteredMajor.image}`}
            alt={filteredMajor.major}
          />
        )}
      </HeaderContainer>

      <Divider sx={{
        borderColor: GetButtonColor(userInfo?.data?.sex),
        borderWidth: 2,
        mb: 4,
        width: '100%'
      }} />

      <FieldGrid container>
        {filteredFields.map((field) => (
          <Grid
            item
            key={field.id}
            xs={5}
            sm={4}
            md={4}
            lg={3}
            sx={{ display: 'flex' }}
          >
            <FieldCard
              title={field.major}
              onClick={() => navigate("/info_show/" + field.id)}
              isFemale={userInfo?.data?.sex}
              icon={field.picture}
            />
          </Grid>
        ))}
      </FieldGrid>
    </StyledContainer>
  );
};

export default Fields;