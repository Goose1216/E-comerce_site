import React, { Component } from 'react';
import OrderCreateWindow from './components/Order/OrderCreateWindow';
import Header from './components/Header';
import Footer from './components/Footer';
import { getToken } from './authStorage';

class OrderCreate extends Component {
    render() {
        const token = getToken();

        return (
            <div>
                <Header />
                <OrderCreateWindow token={token} />
                <Footer />
            </div>
        );
    }
}

export default OrderCreate;
