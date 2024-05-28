import React, { Component } from 'react';
import BasketWindow from './components/Basket/BasketWindow';
import Header from './components/Header';

class Basket extends Component {
    render() {
        return (
            <div>
                <Header />
                <BasketWindow />
            </div>
        );
    }
}

export default Basket;
