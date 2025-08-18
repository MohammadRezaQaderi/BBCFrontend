import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  keyframes,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GetButtonColor, GetLightColor } from "../../helper/buttonColor";
import axios from "axios";
import Loader from "../../helper/Loader";
import HelperInfo from "./HelperInfo";
import { sha256 } from 'js-sha256';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1); }
  70% { box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
`;

const Majors = ({ userInfo, nextStep, stu_id }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const baseColor = GetButtonColor(userInfo?.data?.sex);
  const lightColor = GetLightColor(userInfo?.data?.sex);
  const initialBoxes = Array(4)
    .fill()
    .map(() =>
      Array(4)
        .fill()
        .map(() => [])
    );
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [boxes, setBoxes] = useState(initialBoxes);
  const [error, setError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [initialHash, setInitialHash] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const generateHash = (data) => {
    return sha256(JSON.stringify(data));
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setAllItems([]);

        const response = await axios.post(
          "https://student.baazmoon.com/hoshmand_api/select_request",
          {
            table: "users",
            method_type: "select_hoshmand_major",
            data: {
              stu_id: parseInt(stu_id),
              token: JSON.parse(localStorage.getItem("token")),
            },
          }
        );

        if (response.data && response.data.status === 200) {
          setTimeout(() => {
            setInitialHash(generateHash(response.data.response.user_data));
          }, 0);
          setAllItems(response.data.response.majors || []);
          const userBoxes = initialBoxes;
          if (response.data.response.user_data) {
            response.data.response.user_data.forEach((boxData) => {
              const boxIndex = boxData.box - 1;
              boxData.layers.forEach((layerData) => {
                const layerIndex = layerData.layer - 1;
                userBoxes[boxIndex][layerIndex] = [...layerData.items];
              });
            });
          }
          setBoxes(userBoxes);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "خطا در دریافت اطلاعات رشته‌ها",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [userInfo]);

  const descriptionContent = (
    <HelperInfo
      userInfo={userInfo}
      title="راهنمای رشته‌ها"
      content={["دوست عزیز در این مرحله با توجه به دوره‌های انتخاب شده در مرحله قبل تمام رشته‌های ممکن را مشاهده می‌کنید. در این سامانه شما می‌توانید حداکثر 16 رشته تحصیلی را انتخاب کنید. برای این کار رشته‌های مد نظر خود را در 4 دسته کلی که هر دسته شامل 4 لایه است به ترتیب اولویت قرار دهید.", "در نظر داشته باشید اولویت‌بندی نهایی سامانه هوشمند انتخاب رشته متاثر از این اولویت‌بندی است. بنابراین حتما با دقت رشته‌های مد نظر خود را در این دسته‌ها و لایه‌ها قرار دهید."]}
      additionalTips={[]}
    />
  );

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const filteredItems = allItems.filter(
    (item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !boxes.flatMap((box) => box.flatMap((layer) => layer)).includes(item)
  );

  const handleAddItem = (item, boxIndex, layerIndex) => {
    if (boxIndex === undefined || layerIndex === undefined) return;
    // todo here we should chech each layear should have how many major
    if (boxes[boxIndex][layerIndex].length >= 1) return;
    if (boxes[boxIndex].flat().includes(item)) return;

    const newBoxes = [...boxes];
    newBoxes[boxIndex][layerIndex] = [...newBoxes[boxIndex][layerIndex], item];
    setBoxes(newBoxes);
    setError(false);
  };

  const handleRemoveItem = (item, boxIndex, layerIndex) => {
    const newBoxes = [...boxes];
    newBoxes[boxIndex][layerIndex] = newBoxes[boxIndex][layerIndex].filter(
      (i) => i !== item
    );
    setBoxes(newBoxes);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId.startsWith("box-layers-") &&
      destination.droppableId.startsWith("box-layers-")
    ) {
      const boxIndex = parseInt(source.droppableId.split("-")[2]);
      const newBoxes = [...boxes];

      const [removedLayer] = newBoxes[boxIndex].splice(source.index, 1);
      newBoxes[boxIndex].splice(destination.index, 0, removedLayer);

      setBoxes(newBoxes);
      return;
    }

    if (source.droppableId === "availableItems") {
      const [boxIndex, _m, layerIndex] = destination.droppableId
        .split("-")
        .slice(1)
        .map(Number);

      const item = filteredItems[source.index];
      handleAddItem(item, boxIndex, layerIndex);
      return;
    }

    const [sourceBoxIndex, _n, sourceLayerIndex] = source.droppableId
      .split("-")
      .slice(1)
      .map(Number);
    const [destBoxIndex, _o, destLayerIndex] = destination.droppableId
      .split("-")
      .slice(1)
      .map(Number);
    const item = boxes[sourceBoxIndex][sourceLayerIndex][source.index];

    if (source.droppableId === destination.droppableId) {
      const newBoxes = [...boxes];
      const layer = [...newBoxes[sourceBoxIndex][sourceLayerIndex]];
      const [removed] = layer.splice(source.index, 1);
      layer.splice(destination.index, 0, removed);
      newBoxes[sourceBoxIndex][sourceLayerIndex] = layer;
      setBoxes(newBoxes);
      return;
    }

    if (boxes[destBoxIndex][destLayerIndex].flat().includes(item)) return;
    // todo here we should chech each layear should have how many major
    if (boxes[destBoxIndex][destLayerIndex].length >= 1) return;

    const newBoxes = [...boxes];

    newBoxes[sourceBoxIndex][sourceLayerIndex] = newBoxes[sourceBoxIndex][
      sourceLayerIndex
    ].filter((_, i) => i !== source.index);
    newBoxes[destBoxIndex][destLayerIndex] = [
      ...newBoxes[destBoxIndex][destLayerIndex].slice(0, destination.index),
      item,
      ...newBoxes[destBoxIndex][destLayerIndex].slice(destination.index),
    ];
    setBoxes(newBoxes);
  };

  const saveChanges = async () => {
    const totalItems = boxes.flatMap((box) =>
      box.flatMap((layer) => layer)
    ).length;
    if (totalItems === 0) {
      setError(true);
      return;
    }

    try {
      const result = boxes.map((box, boxIndex) => ({
        box: boxIndex + 1,
        layers: box.map((layer, layerIndex) => ({
          layer: layerIndex + 1,
          items: layer,
        })),
      }));
      const major1 = boxes[0].flatMap((layer) => layer).join(",");
      const major2 = boxes[1].flatMap((layer) => layer).join(",");
      const major3 = boxes[2].flatMap((layer) => layer).join(",");
      const major4 = boxes[3].flatMap((layer) => layer).join(",");
      const allMajors = boxes
        .flatMap((box) => box.flatMap((layer) => layer))
        .join(",");
      const response = await axios.post(
        "https://student.baazmoon.com/hoshmand_api/update_request",
        {
          table: "users",
          method_type: "update_hoshmand_major",
          data: {
            stu_id: parseInt(stu_id),
            token: JSON.parse(localStorage.getItem("token")),
            data: result,
            major1: major1,
            major2: major2,
            major3: major3,
            major4: major4,
            majors: allMajors,
          },
        }
      );

      if (response.data && response.data.status === 200) {
        setSnackbar({
          open: true,
          message: response.data.response.message,
          severity: "success",
        });
        nextStep()
      } else {
        setSnackbar({
          open: true,
          message: "خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در ارسال اطلاعات. لطفاً دوباره تلاش کنید.",
        severity: "error",
      });
    }
  };

  const handleNext = async () => {
    const totalItems = boxes.flatMap((box) =>
      box.flatMap((layer) => layer)
    ).length;
    if (totalItems === 0) {
      setError(true);
      return;
    }

    try {
      const result = boxes.map((box, boxIndex) => ({
        box: boxIndex + 1,
        layers: box.map((layer, layerIndex) => ({
          layer: layerIndex + 1,
          items: layer,
        })),
      }));
      const currentHash = generateHash(result);
      if (currentHash !== initialHash) {
        setShowConfirmation(true);
        return
      }
      else {
        nextStep()
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "خطا در ارسال اطلاعات. لطفاً دوباره تلاش کنید.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return <Loader color={GetButtonColor(userInfo?.data?.sex)} />;
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: lightColor,
              borderLeft: `4px solid ${baseColor}`,
            }}
          >
            {descriptionContent}
          </Paper>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TextField
                  label="جستجوی رشته‌ها"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ color: baseColor }}
                >
                  همه رشته های موجود با توجه به دوره های انتخابی
                </Typography>

                <Droppable droppableId="availableItems">
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        p: 1,
                        backgroundColor: theme.palette.background.paper,
                        overflowY: "auto",
                        maxHeight: isMobile ? "400px" : "800px",
                        // flexGrow: 1,
                        "&::-webkit-scrollbar": {
                          width: "6px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: theme.palette.grey[200],
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: theme.palette.grey[400],
                          borderRadius: "3px",
                        },
                      }}
                    >
                      {filteredItems.map((item, index) => (
                        <Draggable key={item} draggableId={item} index={index}>
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Chip
                                label={item}
                                sx={{
                                  cursor: "grab",
                                  backgroundColor: lightColor,
                                  "&:hover": {
                                    backgroundColor: baseColor,
                                    color: "white",
                                  },
                                }}
                              />
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ color: baseColor }}
                >
                  اولویت بندی رشته‌ها با توجه به علاقه شما
                </Typography>

                {error && (
                  <Typography color="error" variant="caption" sx={{ mb: 2 }}>
                    لطفا حداقل یک رشته را در اولویت‌ها قرار دهید
                  </Typography>
                )}

                <Grid container spacing={2}>
                  {boxes.map((box, boxIndex) => (
                    <Grid item xs={12} sm={6} key={`box-${boxIndex}`}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          border: `2px solid ${baseColor}`,
                          borderRadius: "8px",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 1, color: baseColor }}
                        >
                          اولویت {boxIndex + 1}
                        </Typography>

                        <Droppable
                          droppableId={`box-layers-${boxIndex}`}
                          type="LAYERS"
                          direction="vertical"
                        >
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              sx={{
                                flexGrow: 1,
                              }}
                            >
                              {box.map((layer, layerIndex) => (
                                <Draggable
                                  key={`box-${boxIndex}-layer-${layerIndex}`}
                                  draggableId={`box-${boxIndex}-layer-${layerIndex}`}
                                  index={layerIndex}
                                >
                                  {(provided) => (
                                    <Box
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      sx={{ mb: 1 }}
                                    >
                                      <Box
                                        {...provided.dragHandleProps}
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          cursor: "grab",
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          color="textSecondary"
                                          sx={{ mr: 1 }}
                                        >
                                          لایه {layerIndex + 1}
                                        </Typography>
                                      </Box>

                                      <Droppable
                                        droppableId={`box-${boxIndex}-layer-${layerIndex}`}
                                      >
                                        {(provided, snapshot) => (
                                          <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            sx={{
                                              p: 1,
                                              minHeight: "60px",
                                              maxHeight: "150px",
                                              overflowY: "auto",
                                              backgroundColor:
                                                snapshot.isDraggingOver
                                                  ? theme.palette.grey[200]
                                                  : theme.palette.grey[100],
                                              borderRadius: "4px",
                                              border: `1px dashed ${theme.palette.grey[400]}`,
                                              "&::-webkit-scrollbar": {
                                                width: "6px",
                                              },
                                              "&::-webkit-scrollbar-track": {
                                                background:
                                                  theme.palette.grey[200],
                                              },
                                              "&::-webkit-scrollbar-thumb": {
                                                background:
                                                  theme.palette.grey[400],
                                                borderRadius: "3px",
                                              },
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 0.5,
                                              }}
                                            >
                                              {layer.map((item, itemIndex) => (
                                                <Draggable
                                                  key={item}
                                                  draggableId={item}
                                                  index={itemIndex}
                                                >
                                                  {(provided) => (
                                                    <Box
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                    >
                                                      <Chip
                                                        label={item}
                                                        size="small"
                                                        onDelete={() =>
                                                          handleRemoveItem(
                                                            item,
                                                            boxIndex,
                                                            layerIndex
                                                          )
                                                        }
                                                        sx={{
                                                          backgroundColor:
                                                            lightColor,
                                                          "& .MuiChip-deleteIcon":
                                                          {
                                                            color: baseColor,
                                                            "&:hover": {
                                                              color:
                                                                theme.palette
                                                                  .error.main,
                                                            },
                                                          },
                                                        }}
                                                      />
                                                    </Box>
                                                  )}
                                                </Draggable>
                                              ))}
                                              {provided.placeholder}
                                            </Box>
                                          </Box>
                                        )}
                                      </Droppable>
                                    </Box>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </Box>
                          )}
                        </Droppable>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              mt: 2,
              alignSelf: "flex-end",
              backgroundColor: baseColor,
              "&:hover": { backgroundColor: lightColor },
              "&:disabled": { opacity: 0.7 },
            }}
          >
            ذخیره اطلاعات
          </Button>
        </Box>
      </DragDropContext>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            animation: `${fadeIn} 0.3s ease-out`,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            minWidth: isMobile ? '90vw' : '400px',
            maxWidth: '95vw',
            borderTop: `4px solid ${baseColor}`,
          }
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            backgroundColor: lightColor,
            color: theme.palette.getContrastText(lightColor),
            py: 2,
            px: 3,
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          {"تغییرات تایید نشده"}
          <Box
            sx={{
              width: '100%',
              height: '4px',
              background: `linear-gradient(90deg, ${baseColor}, transparent)`,
              mt: 1,
              borderRadius: '2px'
            }}
          />
        </DialogTitle>

        <DialogContent sx={{ py: 3, px: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: lightColor,
                color: theme.palette.getContrastText(lightColor),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                flexShrink: 0,
                animation: `${pulse} 2s infinite`,
              }}
            >
              !
            </Box>
            <DialogContentText
              id="alert-dialog-description"
              sx={{
                color: theme.palette.text.primary,
                fontSize: '0.95rem',
                lineHeight: 1.6,
              }}
            >
              اطلاعات شما تغییر کرده و با اعمال این تغییرات موارد پیشرو دچار تغییر می‌شود.
              <br />
              آیا مایل به ذخیره تغییرات هستید؟
            </DialogContentText>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'space-between',
            px: 3,
            pb: 3,
            pt: 0,
          }}
        >
          <Button
            onClick={() => setShowConfirmation(false)}
            variant="outlined"
            sx={{
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              borderRadius: 2,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderColor: theme.palette.text.secondary,
              }
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={() => {
              setShowConfirmation(false);
              saveChanges();
            }}
            variant="contained"
            autoFocus
            sx={{
              backgroundColor: baseColor,
              color: "#fff",
              borderRadius: 2,
              px: 3,
              py: 1,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: baseColor,
                opacity: 0.9,
                boxShadow: 'none',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            ذخیره تغییرات
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Majors;
