import axios from 'axios';

const AddToCart = async (productId, countItem) => {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/products/cart/set/',
      {
        product: productId,
        count: countItem,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error ${response.status}`);
    }

    console.log('Корзина обновлена:', response.data);
  } catch (error) {
    console.error('Ошибка при добавлении в корзину:', error);
  }
};

export default AddToCart;
