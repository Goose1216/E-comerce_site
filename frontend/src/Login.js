import React, { Component } from 'react';
import LoginWindow from './components/Reg/Login'
import { Route, Routes } from 'react-router-dom';

class Login extends Component {
    render() {
        return (
            <div>
                <LoginWindow/>
            </div>
        );
    }
}

export default Login;
