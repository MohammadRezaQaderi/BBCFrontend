import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Collapse,
    useTheme,
    styled,
    useMediaQuery
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import { GetButtonColor } from "../../helper/buttonColor";

const StyledPaper = styled(Paper)(({ theme, basecolor }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderLeft: `4px solid ${basecolor}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    overflow: "hidden",
    transition: "all 0.3s ease",
}));

const ContentBox = styled(Box)(({ theme }) => ({
    maxHeight: "200px",
    overflowY: "auto",
    paddingRight: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
        maxHeight: "200px",
    },
    "&::-webkit-scrollbar": {
        width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.action.hover,
        borderRadius: "3px",
    },
}));

const HelperInfo = ({
    userInfo,
    title = "راهنمایی",
    content = [], // Now accepts an array of strings
    additionalTips = [],
    secondTitle,
    additionalExplain = "",
}) => {
    const [expanded, setExpanded] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const baseColor = GetButtonColor(userInfo?.data?.sex);

    return (
        <StyledPaper basecolor={baseColor}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ cursor: "pointer" }}
                onClick={() => setExpanded(!expanded)}
                mb={expanded ? 1 : 0}
            >
                <Box display="flex" alignItems="center">
                    <Typography
                        variant={isMobile ? "subtitle2" : "subtitle1"}
                        fontWeight="bold"
                        color="text.primary"
                    >
                        {title}
                    </Typography>
                </Box>
                <IconButton
                    size="small"
                    sx={{ color: baseColor }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                >
                    {expanded ? <CloseIcon fontSize="small" /> : <HelpOutlineIcon fontSize="small" />}
                </IconButton>
            </Box>

            <Collapse in={expanded}>
                <ContentBox>
                    {Array.isArray(content) ? (
                        content.map((paragraph, index) => (
                            <Typography
                                key={index}
                                variant={isMobile ? "body2" : "body1"}
                                paragraph
                                color="text.secondary"
                            >
                                {paragraph}
                            </Typography>
                        ))
                    ) : (
                        <Typography
                            variant={isMobile ? "body2" : "body1"}
                            paragraph
                            color="text.secondary"
                        >
                            {content}
                        </Typography>
                    )}
                    {additionalTips.length > 0 && (
                        <Box mt={2}>
                            <Typography
                                variant={isMobile ? "caption" : "body2"}
                                fontWeight="bold"
                                display="block"
                                mb={1}
                                color="text.primary"
                            >
                                {secondTitle}
                            </Typography>
                            {additionalExplain !== "" && (
                                <Typography
                                    variant={isMobile ? "body2" : "body1"}
                                    paragraph
                                    color="text.secondary"
                                >
                                    {additionalExplain}
                                </Typography>
                            )}
                            <ul style={{
                                margin: 0,
                                paddingRight: theme.spacing(2),
                                listStyleType: "none"
                            }}>
                                {additionalTips.map((tip, index) => (
                                    <li key={index} style={{ marginBottom: theme.spacing(1) }}>
                                        <Box display="flex">
                                            <span style={{
                                                marginLeft: theme.spacing(1),
                                                color: baseColor
                                            }}>•</span>
                                            <Typography
                                                variant={isMobile ? "caption" : "body2"}
                                                color="text.secondary"
                                            >
                                                {tip}
                                            </Typography>
                                        </Box>
                                    </li>
                                ))}
                            </ul>
                        </Box>
                    )}
                </ContentBox>
            </Collapse>
        </StyledPaper>
    );
};

export default HelperInfo;