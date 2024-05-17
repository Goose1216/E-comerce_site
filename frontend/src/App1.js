import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Login from './Login';
import Reg from './Reg';
import CartPage from './Cart';
import appStyles from './styles/appStyles.module.css';

function App() {
  useEffect(() => {
    scrollWindowToTop();
  }, []);

  const scrollWindowToTop = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 2);
  };

  const [cartItemsCount, setCartItemsCount] = useState(0);

  return (
    <Router>
      <div className={appStyles.appContainer}>
        <Routes>
          <Route
            path="/"
            element={<Layout cartItemsCount={cartItemsCount} setCartItemsCount={setCartItemsCount} />}
          />
          <Route path="/cart" element={<CartPage setCartItemsCount={setCartItemsCount} cartItemsCount={cartItemsCount}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/reg" element={<Reg />} />
        </Routes>
      </div>
    </Router>
  );
}

function Layout({ cartItemsCount, setCartItemsCount }) {
  return (
    <>
      <Header cartItemsCount={cartItemsCount} setCartItemsCount={setCartItemsCount} />
      <Main setCartItemsCount={setCartItemsCount} />
      <Footer />
    </>
  );
}

export default App;
