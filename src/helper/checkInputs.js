export function check_national_id(code) {
  var str = code.toString();
  var strLen = str.length,
    strVal = parseInt(str);
  if (strLen < 8 || strLen > 10 || isNaN(strVal) || strVal == 0) return false;
  while (str.length < 10) str = "0" + str;
  if (str.match(/^(\d)\1+$/g)) return false;
  var checkDigit = parseInt(str.slice(-1)),
    str = str.slice(0, -1);
  for (var sum = 0, i = str.length; i > 0; i--)
    sum += (i + 1) * str.substr(-i, 1);
  var mod = sum % 11;
  return (
    (mod < 2 && mod === checkDigit) || (mod >= 2 && mod + checkDigit === 11)
  );
}

export function truncateString(str, n) {
  if (!str) {
    return "";
  }
  if (str.length > n) {
    return str.slice(0, n) + "...";
  }
  return str;
}

export function check_mobile(mobile) {
  var regex = new RegExp(
    "(0|98|0098|98)?([ ]|-|[()]){0,2}9[0-9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}"
  );
  var result = regex.test(mobile);
  if (result == true) {
    return false;
  } else {
    return true;
  }
}

export function check_number(string) {
  return string
    .replace(/[\u0660-\u0669]/g, function (c) {
      return c.charCodeAt(0) - 0x0660;
    })
    .replace(/[\u06f0-\u06f9]/g, function (c) {
      return c.charCodeAt(0) - 0x06f0;
    });
}
