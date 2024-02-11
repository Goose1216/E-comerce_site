import React, { Component } from 'react';
import Footer from "./components/Footer";
import Header from "./components/Header";
import Main from './components/body/Main';
import appStyles from './styles/appStyles.module.css'

class App extends Component {
    render() {
        return (
            <div className={appStyles}>
                <Header />
                <Main />
                <Footer />
            </div>
        );
    }
}

export default App;
