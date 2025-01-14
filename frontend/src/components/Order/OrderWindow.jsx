import React, { useState, useEffect } from 'react';
import axios from 'axios';
import orderStyles from '../../styles/Order/Order.module.css';

const OrderList = ({ token }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/orders/list/', {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Ошибка при получении заказов:', error);
        }
    };

    return (
        <div className={orderStyles.OrderContainer}>
            <h1>Мои заказы</h1>
            {orders.length === 0 ? (
                <h2>Нет заказов или вы не авторизованы</h2>
            ) : (
                <ul className={orderStyles.OrderList}>
                    {orders.map(order => (
                        <li key={order.uuid} className={orderStyles.OrderItem}>
                            <h2>Заказ номер: {order.uuid}</h2>
                            <p>Статус: {order.status}</p>
                            <p>Сумма заказа: {order.total_price.toLocaleString('ru-RU')} ₽</p>
                            <p>Дата создания: {new Date(order.created_at).toLocaleString('ru-RU')}</p>
                            <h3>Товары в заказе:</h3>
                            <ul>
                                {order.order_items.map(item => (
                                    <li key={item.product} className={orderStyles.OrderProduct}>
                                        {item.product} - Количество: {item.count}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderList;
