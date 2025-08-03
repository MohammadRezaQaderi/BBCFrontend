import { motion } from "framer-motion";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorState = ({
  action,
  title,
  description,
  path,
  needHeight = true,
  path_name = "بازگشت",
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: needHeight ? "60vh" : "none",
        padding: "20px",
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "40px 20px",
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: "bold",
                color: "#d32f2f",
                marginBottom: "20px",
              }}
            >
              {action}
            </Typography>
          </motion.div>

          <Typography
            variant="h6"
            sx={{
              color: "#424242",
              marginBottom: "16px",
              lineHeight: "1.6",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#616161",
              marginBottom: "24px",
              lineHeight: "1.8",
            }}
          >
            {description}
          </Typography>

          {path && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                onClick={() => navigate(path)}
              >
                {path_name}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ErrorState;
