import React, { Component, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Login from './Login';
import Reg from './Reg';
import Cart from './Cart';
import CatalogWindow from './Catalog'
import MainIcon from './img/iconMain.png';
import appStyles from './styles/appStyles.module.css';

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
                <div className={appStyles}>
                    <Routes>
                        <Route path="/" element={<Layout />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/reg" element={<Reg />} />
                        <Route path="/catalog" element={<CatalogWindow />} />
                        <Route path="/cart" element={<Cart />} />
                    </Routes>
                </div>
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