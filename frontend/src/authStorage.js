const TOKEN_KEY = 'token';

export const getToken = () => {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
  const tokenPair = cookies.find(pair => pair[0] === TOKEN_KEY);
  const token = tokenPair ? tokenPair[1] : null;
  console.log('Token retrieved:', token);
  return token;
};

export const setToken = (token, expiryDays = 7) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);

  const cookieString = `${TOKEN_KEY}=${token};expires=${expiryDate.toUTCString()};path=/`;
  document.cookie = cookieString;

  console.log('Token saved:', token);
};

export const removeToken = () => {
  const expiryDate = new Date(0).toUTCString();
  document.cookie = `${TOKEN_KEY}=;expires=${expiryDate};path=/`;

  console.log('Token removed');
};
