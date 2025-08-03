export const setLocalStorageLogin = (key, data, myCallback) => {
  localStorage.setItem(key, JSON.stringify(data));
  myCallback();
};
