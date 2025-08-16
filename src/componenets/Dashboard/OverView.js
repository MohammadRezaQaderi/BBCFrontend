import React from "react";
import { Card, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { GetBackGroundColor, GetButtonColor } from "../../helper/buttonColor";

const OverView = ({ type, count, title, sex, icon }) => {
  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <Card
        sx={{
          boxShadow: 3,
          borderRadius: "12px",
          border: `2px solid ${GetButtonColor(sex)}`,
          p: 3,
          width: "100%",
          height: "100%",
          background: GetBackGroundColor(sex),
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 6,
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          {/* <Typography variant="h5" sx={{ mb: 1 }}>
            {icon}
          </Typography> */}
          <Typography
            variant="body1"
            fontWeight={500}
            color="text.primary"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight={700}
            color="primary.main"
            textAlign="center"
          >
            {count}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {type === "student" ? "نفر" : "آزمون"}
          </Typography>
        </Box>
      </Card>
    </motion.div>
  );
};

export default OverView;