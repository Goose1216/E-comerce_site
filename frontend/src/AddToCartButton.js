import React, { useState } from 'react';
import styles from './styles/MainWindow/BlockStyle.module.css';
import AddToCart from './components/Cart/AddToCart';

const AddToCartButton = ({ imageSrc, activeImageSrc, productId, countItem }) => {
    const [isActive, setIsActive] = useState(false);

    const handleAddToCart = async (productId, countItem) => {

        if (isActive) {
            return;
        }

        setIsActive(true);

        await AddToCart(productId, countItem);


        setTimeout(() => {
            setIsActive(false);
        }, 2000);
    };

    return (
        <button
            className={`${styles.AddToCartButtonCatalog} ${isActive ? styles.active : ''}`}
            onClick={() => handleAddToCart(productId, countItem)}
            disabled={isActive}
        >
            <img src={isActive ? activeImageSrc : imageSrc} alt="Добавить в корзину" />
        </button>
    );
};

export default AddToCartButton;
