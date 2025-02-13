import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import regStyles from '../../styles/RegWindow/LoginStyles.module.css';
import blockStyle from '../../styles/MainWindow/BlockStyle.module.css';
import axios from 'axios';
import { setToken } from '../../authStorage';
import GooglePict from '../../img/icons8-google-144.png';
import YandexPict from '../../img/icons8-яндекс-логотип-50.png';
import VkPict from '../../img/icons8-vk-96.png';
import { Link } from 'react-router-dom';

const Login = () => {
    const [emailOrName, setEmailOrName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const clientIdGoogle = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUriGoogle = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

    const clientIdYandex = process.env.REACT_APP_YANDEX_CLIENT_ID;
    const redirectUriYandex = process.env.REACT_APP_YANDEX_REDIRECT_URI;

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
        const response = await axios.post('http://127.0.0.1:8000/api/v1/dj-rest-auth/login/', {
            username: emailOrName,
            password: password
        },{
                withCredentials: true
           }
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
                        <label htmlFor="login" className={regStyles.AuthLabel}>Логин/почта</label>
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
                         <Link to="/reg" className={regStyles.RegLink}>Еще не зарегистрированы?</Link>
                    </form>
                    <div className = {regStyles.TextSocialAuth}> Или авторизуйтесь с помощью </div>
                    <div className = {regStyles.ContainerSocialAuth}>
                        <a href ="" onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${redirectUriGoogle}&prompt=consent&response_type=code&client_id=${clientIdGoogle}&scope=openid%20email%20profile&access_type=offline`
                        }}>
                            <img src = {GooglePict} className = {regStyles.SocialAuth} alt="Google Login"></img>
                        </a>
                        <a href ="" onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientIdYandex}&redirect_uri=${redirectUriYandex}`
                        }}>
                            <img src = {YandexPict} className = {regStyles.SocialAuth} alt="Yandex Login"></img>
                        </a>
                        <a href ="" onClick={(e) => {
                            e.preventDefault();
                        }}>
                            <img src = {VkPict} className = {regStyles.SocialAuthVk} alt="Vk Login"></img>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
