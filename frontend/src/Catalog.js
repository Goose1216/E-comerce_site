import React, { Component } from 'react';
import CatalogWindow from './components/AllProduct/CatalogWindow';
import HeaderPart from './components/AllUseful/HeaderPart';

class Catalog extends Component {
    render() {
        return (
            <div>
                <HeaderPart />
                <CatalogWindow />
            </div>
        );
    }
}

export default Catalog;
