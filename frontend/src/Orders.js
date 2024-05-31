import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Orders from './components/Orders/Orders'
import cartStyles from './styles/Orders/Orders.module.css';

function OrderPage ({ cartItemsCount, setCartItemsCount }) {
  return (
  <>
      <Header cartItemsCount={cartItemsCount} setCartItemsCount={setCartItemsCount} />
      <Orders setCartItemsCount={setCartItemsCount} />
      <Footer />
  </>
  );
};

export default OrderPage;
