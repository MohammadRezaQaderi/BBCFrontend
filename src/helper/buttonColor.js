export function GetButtonColor(sex) {
  if (sex === 2) {
    return "#efaabc";
  } else {
    return "#5ab2ff";
  }
}


export function GetBackGroundColor(sex) {
  if (sex === 2) {
    return "#ffe7ee";
  } else {
    return "#e1fcff";
  }
}


export function GetLightColor(sex) {
  return sex === 2 ? "#ffc0cb" : "#87cefa";
}

export function GetDarkColor(sex) {
  return sex === 2 ? "#db7093" : "#1e90ff";
}