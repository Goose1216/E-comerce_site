import React, { Component } from 'react';
import OrderWindow from './components/Order/OrderWindow';
import Header from './components/Header';
import Footer from './components/Footer';
import { getToken } from './authStorage';

class Order extends Component {
    render() {
        const token = getToken();

        return (
            <div>
                <Header />
                <OrderWindow token={token} />
                <Footer />
            </div>
        );
    }
}

export default Order;
