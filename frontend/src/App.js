import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import ProductDetail from './ProductDetail';
import Login from './Login';
import LoginGoogle from './LoginGoogle';
import LoginYandex from './LoginYandex';
import ProfileWindow from './Profile';
import PasswordChange from './PasswordChange';
import Reg from './Reg';
import Cart from './Cart';
import Order from './Order';
import OrderDetail from './OrderDetail'
import OrderCreate from './OrderCreate'
import CatalogWindow from './Catalog';
import MainIcon from './img/iconMain.png';
import appStyles from './styles/appStyles.module.css';
import { CartProvider } from './CartContext';

class App extends Component {
    componentDidMount() {
        this.scrollWindowToTop();
    }

    scrollWindowToTop = () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 2);
    };

    render() {
        return (
            <Router>
                <link rel="icon" type="image/png" href={MainIcon} />
                <CartProvider>
                    <div className={appStyles}>
                        <Routes>
                            <Route path="/" element={<Layout />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/login/google" element={<LoginGoogle />} />
                            <Route path="/login/yandex" element={<LoginYandex />} />
                            <Route path="/reg" element={<Reg />} />
                            <Route path="/profile" element={<ProfileWindow />} />
                            <Route path="/change-password" element={<PasswordChange />} />
                            <Route path="/catalog" element={<CatalogWindow />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/order" element={<Order />} />
                            <Route path="/order/create" element={<OrderCreate />} />
                            <Route path="/order/:uuid" element={<OrderDetail />} />
                            <Route path="/:slug" element={<ProductDetail />} />
                        </Routes>
                    </div>
                </CartProvider>
            </Router>
        );
    }
}

function Layout() {
    return (
        <>
            <Header />
            <Main />
            <Footer />
        </>
    );
}

export default App;
