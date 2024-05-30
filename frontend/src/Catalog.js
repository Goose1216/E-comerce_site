import React, { Component } from 'react';
import CatalogWindow from './components/AllProduct/CatalogWindow';
import Header from './components/Header';

function Catalog ({ cartItemsCount, setCartItemsCount }) {
        return (
            <div>
                <Header cartItemsCount={cartItemsCount} setCartItemsCount={setCartItemsCount} />
                <CatalogWindow setCartItemsCount={setCartItemsCount}/>
            </div>
        );
}

export default Catalog;