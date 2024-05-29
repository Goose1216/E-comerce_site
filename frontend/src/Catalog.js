import React, { Component } from 'react';
import CatalogWindow from './components/AllProduct/CatalogWindow';
import Header from './components/Header';

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
