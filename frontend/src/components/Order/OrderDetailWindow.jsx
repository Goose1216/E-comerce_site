import React, { useState, useEffect, } from 'react';
import axios from 'axios';
import orderStyles from '../../styles/Order/OrderDetailWindow.module.css';

const OrderDetailWindow = ({ uuid, token }) => {
    const [order, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);

     const fetchOrderDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/orders/${uuid}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных о заказе:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [uuid]);

    if (loading) {
        return <div className={orderStyles.textLoadingOrError}>Загрузка...</div>;
    }

    if (!order) {
        return <div className={orderStyles.textLoadingOrError}>Нет информации о заказе.</div>;
    }

    return (
        <div className={orderStyles.orderDetailContainer}>
            <h1 className={orderStyles.orderTitle}>Заказ №{order.uuid}</h1>
            <div className={orderStyles.orderInfo}>
                <div className={orderStyles.orderDetails}>
                    <h2>Детали заказа</h2>
                    <p><strong>Дата заказа:</strong> {new Date(order.created_at).toLocaleDateString('ru-RU')}</p>
                    <p><strong>Статус:</strong> {order.status}</p>
                    <p><strong>Сумма заказа:</strong> {order.total_price ? order.total_price.toLocaleString('ru-RU') : 'Не указана'} ₽</p>
                    <p><strong>Адрес</strong>: {order.address}</p>
                    <p><strong>Телефон</strong>: {order.phone}</p>
                    <p><strong>Почта</strong>: {order.email}</p>
                    <p><strong>ФИО</strong>: {order.name_client}</p>
                </div>
                <div className={orderStyles.orderItems}>
                    <h2>Товары в заказе:</h2>
                    <ul className={orderStyles.orderItemList}>
                        {order.order_items.map(item => (
                            <li key={item.product} className={orderStyles.orderItem}>
                                <div className={orderStyles.itemDetails}>
                                    <span className={orderStyles.itemName}>{item.product}</span>
                                    <span>Количество: {item.count}</span>
                                    <span>Цена за единицу: {item.price.toLocaleString('ru-RU')} ₽</span>
                                    <span>Итоговая цена: {item.total_price.toLocaleString('ru-RU')} ₽</span>

                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailWindow;
