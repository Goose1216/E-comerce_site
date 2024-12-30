import React, { Component } from 'react';
import CartWindow from './components/Cart/CartWindow';
import Header from './components/Header';
import Footer from './components/Footer';

class Cart extends Component {
    render() {
        return (
            <div>
                <Header />
                <CartWindow />
                <Footer />
            </div>
        );
    }
}

export default Cart;
