import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/body/Main';
import Footer from './components/Footer';
import Login from './Login';
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
                <div className={appStyles}>
                    <Routes>
                        <Route path="/" element={<Layout />} />
                        <Route path="/login" element={<Login />} />
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
