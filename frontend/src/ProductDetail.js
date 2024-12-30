import React from 'react';
import ProductDetailWindow from './components/AllProduct/ProductDetailWindow';
import Header from './components/Header';
import Footer from './components/Footer';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const { slug } = useParams();

    return (
        <div>
            <Header />
            <ProductDetailWindow slug={slug} />
            <Footer />
        </div>
    );
};

export default ProductDetail;
