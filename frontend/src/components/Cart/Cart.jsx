import React, { useState, useEffect } from 'react';
import AddToCart from './AddToCart';
import removeFromCart from './RemoveFromCart';
import cartStyles from '../../styles/Cart/Cart.module.css';

const Cart = ({ setCartItemsCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState('ae39b6eb-7b29-47b9-9a6a-d7baeb249956');

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/product/cart/?cart_id=${cartId}`)
      .then(response => response.json())
      .then(data => {
        setCartItems(data);
        setCartItemsCount(data.length);
      })
      .catch(error => console.error('Ошибка загрузки данных:', error));
  }, [cartId, setCartItemsCount]);

  const handleQuantityChange = async (itemPk, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.pk === itemPk ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      const response = await fetch(`http://localhost:8000/api/v1/product/cart/update/${itemPk}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Ошибка обновления количества товара на сервере');
      }

      const updatedCartItems = await fetch(`http://localhost:8000/api/v1/product/cart/?cart_id=${cartId}`)
        .then(response => response.json());
      setCartItems(updatedCartItems);
      setCartItemsCount(updatedCartItems.length);
    } catch (error) {
      console.error('Ошибка обновления количества товара:', error);
    }
  };

  return (
    <div className={cartStyles.CartContainer}>
        <h1> Корзина </h1>
      {cartItems.length === 0 ? (
        <h1>Корзина пуста</h1>
      ) : (

        <ul className={cartStyles.CartItems}>
          {cartItems.map(item => (
            <li key={item.pk} className={cartStyles.CartItem}>
              <img src={item.product.image} alt={item.product.name} />
              <div>
                <h2>{item.product.name}</h2>
                <p>Цена: {item.product.price.toLocaleString('ru-RU')} ₽</p>
                <p>
                  Количество:
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.pk, parseInt(e.target.value, 10))}
                    className={cartStyles.QuantityInput}
                  />
                </p>
                <p>Итого: {(item.quantity * item.product.price).toLocaleString('ru-RU')} ₽</p>
                <div className={cartStyles.ButtonGroup}>
                  <button className={cartStyles.AddButton} onClick={async () => {
                    try {
                      await AddToCart(item.product.pk, cartId, 1, setCartItemsCount);
                      const updatedCartItems = await fetch(`http://localhost:8000/api/v1/product/cart/?cart_id=${cartId}`)
                        .then(response => response.json());
                      setCartItems(updatedCartItems);
                    } catch (error) {
                      console.error('Ошибка при добавлении в корзину:', error);
                    }
                  }}>Добавить в корзину</button>
                  <button className={cartStyles.RemoveButton} onClick={async () => {
                    try {
                      await removeFromCart(item.pk, cartId, setCartItemsCount);
                      const updatedCartItems = await fetch(`http://localhost:8000/api/v1/product/cart/?cart_id=${cartId}`)
                        .then(response => response.json());
                      setCartItems(updatedCartItems);
                    } catch (error) {
                      console.error('Ошибка при удалении с корзины:', error);
                    }
                  }}>Удалить с корзины</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className={cartStyles.CartSummary}>
        <h2>Общая сумма: {cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0).toLocaleString('ru-RU')} ₽</h2>
        <button>Оформить заказ</button>
      </div>
    </div>
  );
};

export default Cart;
