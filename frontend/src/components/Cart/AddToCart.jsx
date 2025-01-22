import axios from 'axios';

const AddToCart = async (productId, countItem, setCartQuantity) => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/carts/set/',
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
        if (response.status == 200) {
            setCartQuantity(prevQuantity => prevQuantity + 1);
            console.log('Корзина обновлена:', response.data);
        } else if (response.status == 204) {
            console.log('Корзина обновлена:', response.data);
        } else {
            throw new Error(`HTTP error ${response.status}`);
        }
    } catch (error) {
        console.error('Ошибка при добавлении в корзину:', error);
    }
};

export default AddToCart;
