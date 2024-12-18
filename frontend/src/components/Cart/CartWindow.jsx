import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cartStyles from '../../styles/Cart/Cart.module.css';
import DeleteFromCart from './DeleteFromCart';
import UpdateCart from './UpdateCart';
import AddToCart from './AddToCart';
import { useCart } from '../../CartContext';
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const { setCartQuantity } = useCart();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const response = await axios.get('http://localhost:8000/api/v1/products/cart/get/', {
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
                            <img src={item.image} alt={item.name} />
                            <div>
                                <h2>{item.name}</h2>
                                <p>Цена: {item.price.toLocaleString('ru-RU')} ₽</p>
                                <p>
                                    Количество:
                                    <div className={cartStyles.QuantityContainer}>
                                        <button
                                            className={cartStyles.QuantityButton}
                                            onClick={() => handleUpdateButton(item.pk, item.count - 1)}
                                            disabled={item.count <= 1} // Отключаем кнопку, если количество меньше или равно 1
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
                <button>Оформить заказ</button>
            </div>
        </div>
    );
};

export default Cart;
