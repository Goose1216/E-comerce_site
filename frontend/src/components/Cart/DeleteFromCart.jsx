import axios from 'axios';

const DeleteFromCart = async (productId) => {
    try {
        const response = await axios.delete('http://localhost:8000/api/v1/products/cart/delete/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            data: { product: productId }
        });

        return response;
    } catch (error) {
        console.error('Ошибка при удалении из корзины:', error);
        throw error;
    }
};

export default DeleteFromCart;
