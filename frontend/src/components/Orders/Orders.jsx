import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ordersStyles from '../../styles/Orders/Orders.module.css';
import { getToken, removeToken } from '../../authStorage';

const Orders = ({ setCartItemsCount }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  const fetchOrders = async () => {
    try {
    const token = getToken();
      const response = await axios.get('http://localhost:8000/api/v1/order/list/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    }
  };
  fetchOrders();
}, []);

  return (
  <div className={ordersStyles.AllContainer}>
      <h1>Заказы</h1>
      {orders.length === 0 ? (
        <h2>У вас пока нет заказов</h2>
      ) : (
        <div className={ordersStyles.OrdersList}>
          {orders.map((order) => (
            <div key={order.id} className={ordersStyles.OrderCard}>
              <h2>Заказ №{order.pk}</h2>
              <p>Дата заказа: {new Date(order.date_ordered).toLocaleString()}</p>
              <ul className={ordersStyles.OrderItems}>
                {order.cartItems.map((item) => (
                  <li key={item.pk} className={ordersStyles.OrderItem}>
                    <img src={item.product.image} alt={item.product.name} />
                    <div>
                      <h3>{item.product.name}</h3>
                      <p>Цена: {item.product.price?.toLocaleString('ru-RU')} ₽</p>
                      <p>Количество: {item.quantity}</p>
                      <p>Итого: {item.get_total_price.toLocaleString('ru-RU')} ₽</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className={ordersStyles.OrderSummary}>
                <p>Общая сумма: {order.get_total_price.toLocaleString('ru-RU')} ₽</p>
                <p>Статус: {order.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
