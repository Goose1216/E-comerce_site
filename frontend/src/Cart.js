import React, { Component } from 'react';
import CartWindow from './components/Cart/CartWindow';
import Header from './components/Header';

class Cart extends Component {
    render() {
        return (
            <div>
                <Header />
                <CartWindow />
            </div>
        );
    }
}

export default Cart;
