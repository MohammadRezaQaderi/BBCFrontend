import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  themeOfSite: {
    backgroundColor: "#fff",
    color: "#000",
  },
  input: {
    color: "#000",
    "&  input": {
      color: "#614BC3",
      paddingLeft: "35px",
    },
  },
  gridInput: {
    backgroundColor: "#fff",
    "&  label": {
      color: "#000",
    },
    "&  input": {
      color: "#000",
    },
  },
  themeFontColor: {
    color: "#000",
    height: 40,
    "& > .MuiOutlinedInput-input": {
      border: "none !important",
    },
  },
  MuiSpan: {
    color: "#fff",
    height: 40,
    "& .MuiInputLabel-asterisk": {
      display: "inline !important",
      fontSize: "16px",
      fontWeight: 400,
    },
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "#fff",
  },
}));

export const useStylesFast = makeStyles(() => ({
  themeOfSite: {
    backgroundColor: "#fff",
    color: "#000",
  },
  input: {
   "& .MuiInputBase-root": {
      display: "flex",
      flexWrap: "wrap",
      maxHeight: "150px",
      overflowY: "auto",
      border: "1px solid #ccc !important",
      padding: "5px",
      boxSizing: "border-box",
      borderRadius: "4px",
    },
    "& input": {
      color: "#614BC3",
      paddingLeft: "35px",
    },
  },
  gridInput: {
    backgroundColor: "#fff",
    "& label": {
      color: "#000",
    },
    "& input": {
      color: "#000",
    },
  },
  themeFontColor: {
    color: "#000",
    height: 40,
    "& > .MuiOutlinedInput-input": {
      border: "none !important",
    },
  },
  MuiSpan: {
    color: "#fff",
    height: 40,
    "& .MuiInputLabel-asterisk": {
      display: "inline !important",
      fontSize: "16px",
      fontWeight: 400,
    },
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "#fff",
  },
  twoColumnContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },
  column: {
    flex: 1,
    height: "100%",
    padding: "20px",
    boxSizing: "border-box",
  },
  verticalLine: {
    borderLeft: "1px dashed red",
    width: "5px",
    height: "100%",
    margin: "0 10px",
  },
  selectedMajorsContainer: {
    marginTop: "20px",
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
  },
  majorItem: {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
