import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cartStyles from '../../styles/Cart/Cart.module.css';
import blockStyle from '../../styles/MainWindow/BlockStyle.module.css';
import DeleteFromCart from './DeleteFromCart';
import UpdateCart from './UpdateCart';
import AddToCart from './AddToCart';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../../CartContext';
import { getToken } from '../../authStorage';

const Cart = () => {
    const { setCartQuantity, cartItems, setCartItems} = useCart();
    const token = getToken();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const response = await axios.get('http://localhost:8000/api/v1/carts/get/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        setCartItems(response.data);
    };

    const handleDeleteButton = async (productId) => {
        try {
            const response = await DeleteFromCart(productId, setCartQuantity);

            if (response.status === 200) {
                setCartItems(prevItems => prevItems.filter(item => item.pk !== productId));
                console.log('Товар был успешно удалён', response.data);
            } else if (response.status === 204) {
                console.log('Товар не был удалён');
            } else {
                console.error('Ошибка при удалении товара:', response.data);
            }
        } catch (error) {
            console.error('Ошибка при удалении с корзины:', error);
        }
    };

    const handleUpdateButton = async (productId, countItem) => {
        try {
            const response = await UpdateCart(productId, countItem);

            if (response.status === 200) {
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.pk === productId ? { ...item, count: countItem } : item
                    )
                );
                console.log('Количество товара обновлено:', response.data);
            } else if (response.status === 204) {
                console.log("Товар не был обновлён:", response.data);
            } else {
                console.error('Ошибка при обновлении товара:', response.data);
            }
        } catch (error) {
            console.error('Ошибка при обновлении количества:', error);
        }
    };



    return (
        <div className={cartStyles.CartContainer}>
            <h1>Корзина</h1>
            {cartItems.length === 0 ? (
                <h1>Корзина пуста</h1>
            ) : (
                <ul className={cartStyles.CartItems}>
                    {cartItems.map(item => (
                        <li key={item.pk} className={cartStyles.CartItem}>
                            <Link to={`/${item.slug}`}>
                              <img src={item.image} alt="Изображение товара" />
                            </Link>
                            <div>
                               <Link to={`/${item.slug}`}>
                                    <h1 className={cartStyles.ProductName}>{item.name}</h1>
                                </Link>
                                <p>Цена: {item.price.toLocaleString('ru-RU')} ₽</p>
                                <p>
                                    Количество:
                                    <div className={cartStyles.QuantityContainer}>
                                        <button
                                            className={cartStyles.QuantityButton}
                                            onClick={() => handleUpdateButton(item.pk, item.count - 1)}
                                            disabled={item.count <= 1}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.count}
                                            onChange={(e) => handleUpdateButton(item.pk, parseInt(e.target.value, 10))}
                                            className={cartStyles.QuantityInput}
                                        />
                                        <button
                                            className={cartStyles.QuantityButton}
                                            onClick={() => handleUpdateButton(item.pk, item.count + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </p>
                                <p>Итого: {(item.count * item.price).toLocaleString('ru-RU')} ₽</p>
                                <div className={cartStyles.ButtonGroup}>
                                    <button
                                        className={cartStyles.RemoveButton}
                                        onClick={() => handleDeleteButton(item.pk)}
                                    >
                                        Удалить с корзины
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div className={cartStyles.CartSummary}>
                <h2>Общая сумма: {cartItems.reduce((acc, item) => acc + item.count * item.price, 0).toLocaleString('ru-RU')} ₽</h2>
                {
                <Link to={`/order/create`}>
                {token ? (
                     <button
                        className={cartStyles.confirmButton}>
                        Оформить заказ
                    </button>
                ) : (
                    <button
                        disabled = {true}
                        className={cartStyles.confirmButton}>
                        Для оформления заказа - авторизуйтесь
                    </button>
                )}

                 </Link>
                }
            </div>
        </div>
    );
};

export default Cart;
