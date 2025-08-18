import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Box,
  Slider,
  Typography,
  styled
} from "@mui/material";
import {
  PlayCircleFilled,
  PauseCircleFilled,
  VolumeUp,
} from "@mui/icons-material";
import { GetBackGroundColor, GetButtonColor } from "../../helper/buttonColor";

const AudioVisualizer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  height: 40,
  gap: 2,
  marginBottom: theme.spacing(1),
}));

const Bar = styled(Box)(({ theme, isactive, color }) => ({
  width: 4,
  backgroundColor: isactive === 'true' ? color : theme.palette.grey[400],
  borderRadius: 2,
  transition: 'height 0.3s ease',
}));

const SoundPlayer = ({ voice, userInfo }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef(null);
  const animationRef = useRef(null);
  const [bars, setBars] = useState(Array(20).fill(5));

  const audioSrc = `https://student.baazmoon.com/bbc_quiz_api/get_voice/${voice}`;

  useEffect(() => {
    // Generate random heights for the equalizer bars
    const interval = setInterval(() => {
      if (isPlaying) {
        setBars(Array(20).fill(0).map(() => Math.random() * 40 + 5));
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue / 100;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(currentProgress) ? 0 : currentProgress);
    }
  };

  const handleSeek = (event, newValue) => {
    if (audioRef.current) {
      const seekTime = (newValue / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
    }
  };

  return (
    <Box sx={{
      width: '100%',
      maxWidth: 400,
      p: 2,
      borderRadius: 4,
      bgcolor: 'background.paper',
      boxShadow: 1,
    }}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Equalizer visualization */}
      <AudioVisualizer>
        {bars.map((height, index) => (
          <Bar
            color={GetButtonColor(userInfo?.data?.sex)}
            key={index}
            style={{ height }}
            isactive={isPlaying.toString()}
          />
        ))}
      </AudioVisualizer>

      {/* Progress bar */}
      <Slider
        value={progress}
        onChange={handleSeek}
        size="small"
        sx={{
          color: GetButtonColor(userInfo?.data?.sex),
          height: 4,
          '& .MuiSlider-thumb': {
            width: 12,
            height: 12,
            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: '0px 0px 0px 8px rgba(58, 133, 137, 0.16)',
            },
            '&.Mui-active': {
              width: 20,
              height: 20,
            },
          },
        }}
      />

      {/* Controls */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 1
      }}>
        <IconButton
          onClick={togglePlay}
          color={GetButtonColor(userInfo?.data?.sex)}
          size="large"
        >
          {isPlaying ? (
            <PauseCircleFilled sx={{ fontSize: 40 }} color={GetButtonColor(userInfo?.data?.sex)} />
          ) : (
            <PlayCircleFilled sx={{ fontSize: 40 }} color={GetButtonColor(userInfo?.data?.sex)} />
          )}
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', width: '60%' }}>
          <VolumeUp color="action" sx={{ mr: 1 }} />
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            size="small"
            sx={{
              color: GetButtonColor(userInfo?.data?.sex),
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
              },
            }}
          />
        </Box>
      </Box>

      {/* <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {voice}
      </Typography> */}
    </Box>
  );
};

export default SoundPlayer;