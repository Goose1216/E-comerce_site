import React from 'react';
import OrderDetailWindow from './components/Order/OrderDetailWindow';
import Header from './components/Header';
import Footer from './components/Footer';
import { useParams } from 'react-router-dom';
import { getToken } from './authStorage';

const OrderDetail = () => {
    const { uuid } = useParams();
    const token = getToken();

    return (
        <div>
            <Header />
            <OrderDetailWindow uuid={uuid} token={token} />
            <Footer />
        </div>
    );
};

export default OrderDetail;
