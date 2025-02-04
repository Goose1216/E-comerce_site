import React, { useState, useEffect } from 'react';
import { getToken } from '../../authStorage';
import axios from 'axios';
import { useCart } from '../../CartContext';
import styles from '../../styles/Order/OrderCreate.module.css';
import { Link } from 'react-router-dom'; // Для ссылок на товары

const OrderCreate = ({ token }) => {
    const { setCartQuantity, setCartItems, cartItems } = useCart();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [nameClient, setNameClient] = useState('');
    const [error, setError] = useState('');

    // Функция для получения товаров из корзины
    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/carts/get/', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            setCartItems(response.data);
        } catch (error) {
            console.error('Ошибка при получении товаров из корзины:', error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !phone || !address || !nameClient) {
            setError('Все поля обязательны для заполнения.');
            return;
        }

        const phoneRegex = /^(?:\+7|8)\d{10}$/;
        if (!phoneRegex.test(phone)) {
            setError('Номер телефона должен начинаться с +7 или 8 и состоять из 10 цифр.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Введите корректный email.');
            return;
        }

        try {
            setLoading(true);
            axios.defaults.withCredentials = true;

            const response = await axios.post(
                'http://localhost:8000/api/v1/orders/create/',
                {
                    email: email,
                    phone: phone,
                    address: address,
                    name_client: nameClient,
                },
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                console.log('Заказ успешно оформлен:', response.data);
                setCartItems([]);
                setCartQuantity(0);
                setEmail('');
                setPhone('');
                setAddress('');
                setNameClient('');
            } else {
                console.error('Ошибка при оформлении заказа:', response.data);
                setError('Ошибка при оформлении заказа. Пожалуйста, попробуйте снова.');
            }
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            setError('Ошибка при оформлении заказа. Пожалуйста, попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.orderContainer}>
            <div className={styles.leftSection}>
                <h2 className={styles.title}>Оформление заказа</h2>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Телефон:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+79999999999"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Адрес:</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>ФИО:</label>
                        <input
                            type="text"
                            value={nameClient}
                            onChange={(e) => setNameClient(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? 'Оформление...' : 'Оформить заказ'}
                    </button>
                </form>
            </div>
            <div className={styles.rightSection}>
                <h3>Товары в корзине</h3>
                {cartItems.length > 0 ? (
                    <ul className={styles.cartList}>
                        {cartItems.map((item) => (
                            <li key={item.pk} className={styles.cartItem}>
                                <Link to={`/${item.slug}`}>
                                    <img src={item.image} alt="Изображение товара" className={styles.itemImage} />
                                </Link>
                                <div className={styles.itemDetails}>
                                    <Link to={`/${item.slug}`}>
                                        <h1 className={styles.ProductName}>{item.name}</h1>
                                    </Link>
                                    <p>Цена: {item.price.toLocaleString('ru-RU')} ₽</p>
                                    <p>Количество: {item.count}</p>
                                    <p>Итого: {(item.count * item.price).toLocaleString('ru-RU')} ₽</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Ваша корзина пуста.</p>
                )}
            </div>
        </div>
    );
};

export default OrderCreate;