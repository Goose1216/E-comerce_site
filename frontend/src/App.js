import React, { Component } from 'react';
import Footer from "./components/Footer";
import Header from "./components/Header";
import Main from './components/body/Main';

class App extends Component {
    render() {
        return (
            <div>
                <Header />
                <Main />
                <Footer />
            </div>
        );
    }
}

export default App;
