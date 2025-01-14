import { getToken } from '../../authStorage';
import axios from 'axios';

const OrderCreate = async (setCartItems, setCartQuantity) => {
    try {
        axios.defaults.withCredentials = true;
        const token = getToken();
        const response = await axios.post('http://localhost:8000/api/v1/orders/create/',
            {},
            {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }
        );
        if (response.status === 201) {
            console.log('Заказ успешно оформлен:', response.data);
            setCartItems([]);
            setCartQuantity(0);
        } else {
            console.error('Ошибка при оформлении заказа:', response.data);
        }
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
};

export default OrderCreate;