import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import FieldCard from "./FieldCard";
import { handleDownload } from "./handleDownload";
import { GetButtonColor } from "../../helper/buttonColor";
import { Alert, Snackbar, Backdrop, CircularProgress, Fade } from "@mui/material";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const ProgressOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(3px);
`;

const ProgressContainer = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px 0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ color }) => color};
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease-out;
  border-radius: 10px;
`;

const ProgressText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-top: 0.5rem;
`;

// Styled Components
const NoteBookContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 30px;
  padding: 40px;
  max-width: auto;
  margin: 80px auto;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    justify-content: center;
    padding: 20px;
    margin: 60px auto;
  }

  @media (max-width: 480px) {
    justify-content: center;
    gap: 20px;
    padding: 15px;
    margin: 40px auto;
  }
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out ${({ index }) => index * 0.1}s both;
  width: 100%;
  max-width: 200px;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PulseContainer = styled.div`
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const NoteBook = () => {
  const [userInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeDownload, setActiveDownload] = useState(null);
  const baseColor = GetButtonColor(userInfo?.data?.sex);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fields = [
    {
      title: "انسانی",
      icon: userInfo?.data?.sex === 2 ? "EnsaniWoman.svg" : "EnsaniMan.svg",
      report: "pdf_nootbook",
      color: GetButtonColor(userInfo?.data?.sex),
      reportName: "دفترچه انسانی.pdf",
      file: "E1403.pdf",
    },
    {
      title: "تجربی",
      icon: userInfo?.data?.sex === 2 ? "TajrobiWoman.svg" : "TajrobiMan.svg",
      report: "pdf_nootbook",
      color: GetButtonColor(userInfo?.data?.sex),
      reportName: "دفترچه تجربی.pdf",
      file: "T1403.pdf",
    },
    {
      title: "ریاضی",
      icon: userInfo?.data?.sex === 2 ? "RiaziWoman.svg" : "RiaziMan.svg",
      report: "pdf_nootbook",
      color: GetButtonColor(userInfo?.data?.sex),
      reportName: "دفترچه ریاضی.pdf",
      file: "R1403.pdf",
    },
    {
      title: "هنر",
      icon: userInfo?.data?.sex === 2 ? "HonarWoman.svg" : "HonarMan.svg",
      report: "pdf_nootbook",
      color: GetButtonColor(userInfo?.data?.sex),
      reportName: "دفترچه هنر.pdf",
      file: "H1403.pdf",
    },
    {
      title: "زبان",
      icon: userInfo?.data?.sex === 2 ? "ZabanWoman.svg" : "ZabanMan.svg",
      report: "pdf_nootbook",
      color: GetButtonColor(userInfo?.data?.sex),
      reportName: "دفترچه زبان.pdf",
      file: "Z1403.pdf",
    },
  ];

  const handleDownloadClick = async (field) => {
    setLoading(true);
    setActiveDownload(field.title);
    setProgress(prev => ({ ...prev, [field.file]: 0 }));

    try {
      await handleDownload(
        field.report,
        field.reportName,
        field.file,
        (prog) => setProgress(prev => ({ ...prev, [field.file]: prog }))
      );

      setSnackbar({
        open: true,
        message: `دانلود ${field.title} با موفقیت انجام شد`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `خطا در دانلود ${field.title}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
      setActiveDownload(null);
      // Reset progress after a delay
      setTimeout(() => {
        setProgress(prev => ({ ...prev, [field.file]: 0 }));
      }, 1000);
    }
  };

  return (
    <>
      <NoteBookContainer>
        {fields.map((field, index) => (
          <FieldContainer key={index} index={index}>
            <PulseContainer>
              <FieldCard
                iconSrc={field.icon}
                title={field.title}
                onClick={() => handleDownloadClick(field)}
                color={field.color}
              />
            </PulseContainer>

            {/* Individual progress bar for each field */}
            {progress[field.file] > 0 && (
              <>
                <ProgressBarContainer>
                  <ProgressFill
                    progress={progress[field.file]}
                    color={field.color}
                  />
                </ProgressBarContainer>
                <ProgressText>
                  {Math.round(progress[field.file])}% در حال دانلود
                </ProgressText>
              </>
            )}
          </FieldContainer>
        ))}
      </NoteBookContainer>

      {/* Global loading overlay */}
      <Fade in={loading} timeout={300}>
        <ProgressOverlay>
          <ProgressContainer>
            <CircularProgress
              size={60}
              thickness={4}
              style={{ color: baseColor }}
            />
            <ProgressText>در حال دانلود دفترچه {activeDownload}...</ProgressText>
            <ProgressBarContainer>
              <ProgressFill
                progress={progress[activeDownload ? fields.find(f => f.title === activeDownload)?.file ?
                  progress[fields.find(f => f.title === activeDownload).file] : 0 : 0]}
                color={baseColor}
              />
            </ProgressBarContainer>
            <ProgressText>
              {activeDownload ?
                Math.round(progress[fields.find(f => f.title === activeDownload)?.file] || 0) : 0}%
            </ProgressText>
          </ProgressContainer>
        </ProgressOverlay>
      </Fade>

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
    </>
  );
};

export default NoteBook;