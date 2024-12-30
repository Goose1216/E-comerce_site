import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/AllProductStyles/ProductDetailStyle.module.css'; // Импортируем стили
import AddToCartButton from '../../AddToCartButton';
import blockStyle from '../../styles/MainWindow/BlockStyle.module.css';
import CartImg from '../../img/orange-cart.png';
import CartImgActive from '../../img/green-cart.png';
import { useCart } from '../../CartContext';

const ProductDetail = ({ slug }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setCartQuantity } = useCart();

    const fetchProductDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/products/${slug}/`);
            setProduct(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных о товаре:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetail();
    }, [slug]);

    if (loading) {
        return <div className={styles.textLoadingOrError}>Загрузка...</div>;
    }

    if (!product) {
        return <div className={styles.textLoadingOrError}>Товар не найден.</div>;
    }

    return (
        <div className={styles.DetailContainer}>
            <h1 className={styles.productName}>{product.name}</h1>
            <div className={styles.productDetailContainer}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
                <div className={styles.productInfo}>
                    <p className={styles.productBrand}>Бренд: {product.brand}</p>

                    <div className={styles.productCategories}>
                        <h2>Категории:</h2>
                        <ul>
                            {product.category.map(cat => (
                                <li key={cat.name}>{cat.name}</li>
                            ))}
                        </ul>
                    </div>
                     <div className={styles.productCategories}>
                        <h2>Размеры:</h2>
                        <ul>
                            <li>Высота: {product.height ? product.height : 'Нет данных'}</li>
                            <li>Ширина: {product.width ? product.width : 'Нет данных'}</li>
                            <li>Длина: {product.depth ? product.depth : 'Нет данных'}</li>
                        </ul>
                     </div>
                     <div className={styles.productPrice}>
                        Цена: {product.price.toLocaleString('ru-RU')} ₽
                        {product.discount > 0 && (
                            <span className={styles.discountPrice}>
                                {product.price_standart}
                            </span>
                        )}
                    </div>
                    <div className={styles.addToCartContainer}>
                        <AddToCartButton
                            imageSrc={CartImg}
                            activeImageSrc={CartImgActive}
                            productId={product.pk}
                            countItem={1}
                            setCartQuantity={setCartQuantity}
                            className={blockStyle.AddToCartButtonCatalog}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
