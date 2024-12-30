import React, { Component } from 'react';
import CatalogWindow from './components/AllProduct/CatalogWindow';
import Header from './components/Header';
import Footer from './components/Footer';

class Catalog extends Component {
    render() {
        return (
            <div>
                <Header />
                <CatalogWindow />
            </div>
        );
    }
}

export default Catalog;
