import axios from 'axios';

const UpdateCart = async (productId, countItem) => {
    try {
        const response = await axios.put('http://localhost:8000/api/v1/products/cart/update/',
         {
          product: productId,
          new_count: countItem,
         },
         {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        return response;
    } catch (error) {
        console.error('Ошибка при Обновлении товара:', error);
        throw error;
    }
};

export default UpdateCart;
