import { getToken, removeToken } from '../../authStorage';

const CreateOrder = async (setCartItemsCount) => {
  try {
  const token = getToken();
    const response = await fetch('http://localhost:8000/api/v1/order/create/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        phone_number: "+79965669368",
        email: "mail@mail.ru",
        status: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    setCartItemsCount(0);
  } catch (error) {
    console.error('Ошибка при создании корзины:', error);
  }
};

export default CreateOrder;
