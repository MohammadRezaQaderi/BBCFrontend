import persianDate from "persian-date";

export const convertToPersianDate = (isoDateString) => {
  const date = new Date(isoDateString); // Convert ISO string to a Date object
  const persian = new persianDate(date); // Use PersianDate library to handle conversion
  return persian.format("HH:mm:ss YYYY/MM/DD"); // Format the output as needed
};