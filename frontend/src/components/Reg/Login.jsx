import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import regStyles from '../../styles/RegWindow/LoginStyles.module.css';
import blockStyle from '../../styles/MainWindow/BlockStyle.module.css';
import axios from 'axios';
import { setToken } from '../../authStorage';

import { Link } from 'react-router-dom';

const Login = () => {
    const [emailOrName, setEmailOrName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
        const response = await axios.post('http://127.0.0.1:8000/api/v1/dj-rest-auth/login/', {
            username: emailOrName,
            password: password
        },
        );


        const token = response.data.key;

        setToken(token);

        navigate('/');
        } catch (error) {
        setError('Неправильные учетные данные. Пожалуйста, попробуйте снова.');
        console.error('Ошибка:', error);
        } finally {
        setLoading(false);
        }
    };

  return (
    <div className={regStyles.Body}>
        <div>
            <a href='\' className={regStyles.GoBack}>
                <p className={regStyles.GoBackLabelVector}>←</p>
                <p className={regStyles.GoBackLabel}>Вернуться на главную</p>
            </a>
            {error && <div className={regStyles.errorMessage}>{error}</div>}
            <div className={regStyles.Window}>
                <h1>Авторизация</h1>
                <form className={regStyles.AuthForm} onSubmit={login}>
                    <label htmlFor="login" className={regStyles.AuthLabel}>Логин</label>
                    <input
                        type="text"
                        autoComplete="off"
                        onChange={(e) => setEmailOrName(e.target.value)}
                        value={emailOrName}
                        className={regStyles.LoginAuthInput}
                        required
                    />

                    <label htmlFor="password" className={regStyles.AuthLabel}>Пароль</label>
                    <input 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="off" 
                        value={password}
                        className={regStyles.PasswordAuthInput}
                        required
                    />

                    <button className={regStyles.AuthButton} type="submit" disabled={loading}>
                        {loading ? <span className={blockStyle.spinner}></span> : 'Войти'}
                    </button>
                </form>
                <Link to="/reg" className={regStyles.RegLink}>Еще не зарегистрированы?</Link>
            </div>
        </div>
    </div>
    );  
};

export default Login;