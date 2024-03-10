const TOKEN_KEY = 'token';

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('Token retrieved:', token);
  return token;
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  console.log('Token saved:', token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
