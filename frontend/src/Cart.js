import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart/Cart';
import cartStyles from './styles/Cart/Cart.module.css';

function CartPage ({ cartItemsCount, setCartItemsCount }) {
  return (
  <>
      <Header cartItemsCount={cartItemsCount} setCartItemsCount={setCartItemsCount} />
      <Cart setCartItemsCount={setCartItemsCount} />
      <Footer />
  </>
  );
};

export default CartPage;
