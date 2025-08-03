import React from "react";
import { Autocomplete, TextField, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useStyles } from "./styles";

const FilterInput = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  multiple = false,
}) => {
  const classes = useStyles();

  return (
    <Autocomplete
      multiple={multiple}
      fullWidth
      options={options || []}
      getOptionLabel={(option) => option || ""}
      disableCloseOnSelect={multiple}
      limitTags={1}
      size="small"
      className={`${classes.input} ${classes.MuiSpan} mt-3`}
      value={multiple ? (Array.isArray(value) ? value : [value]) : value || ""}
      onChange={(event, newValue) => {
        if (!multiple) {
          onChange(event, newValue || "");
        } else {
          onChange(event, Array.isArray(newValue) ? newValue : []);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder || ""} />
      )}
      renderOption={(props, option, { selected }) => (
        <MenuItem
          {...props}
          key={option}
          value={option}
          sx={{ justifyContent: "space-between" }}
        >
          {option}
          {multiple && selected ? <CheckIcon color="info" /> : null}{" "}
        </MenuItem>
      )}
    />
  );
};

export default FilterInput;
