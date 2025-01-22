import axios from 'axios';

const DeleteFromCart = async (productId, setCartQuantity) => {
    try {
        const response = await axios.delete('http://localhost:8000/api/v1/carts/delete/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            data: { product: productId }
        });

        setCartQuantity(prevQuantity => prevQuantity - 1);

        return response;
    } catch (error) {
        console.error('Ошибка при удалении из корзины:', error);
        throw error;
    }
};

export default DeleteFromCart;
