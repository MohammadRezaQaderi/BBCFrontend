export const ConvertQuota = (quota) => {
  if (quota === 1) {
    return "منطقه ۱";
  }
  if (quota === 2) {
    return "منطقه ۲";
  }
  if (quota === 3) {
    return "منطقه ۳";
  }
  if (quota === 4) {
    return "سهمیه ۵٪";
  }
  if (quota === 5) {
    return "سهمیه ۲۵٪";
  }
};

export const ConvertField = (field) => {
  if (field === 2) {
    return "ریاضی";
  }
  if (field === 1) {
    return "تجربی";
  }
  if (field === 3) {
    return "انسانی";
  }
  if (field === 5) {
    return "هنر";
  }
  if (field === 4) {
    return "زبان";
  }
};

export const ConvertSex = (sex) => {
  if (sex === 2) {
    return "زن";
  }
  if (sex === 1) {
    return "مرد";
  }
};
