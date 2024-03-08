import React, { useState } from 'react';
import regStyles from '../../styles/RegWindow/RegStyles.module.css';
import axios from 'axios';

const Login = () => {

    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const login = async (e) => {
        e.preventDefault();
    
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/v1/dj-rest-auth/login/', {
            username: emailOrUsername,
            password: password
          });

          const token = response.data.key;
          console.log('Полученный токен:', token);

          setLoggedIn(true);

        } catch (error) {
          setError('Неправильные учетные данные. Пожалуйста, попробуйте снова.');
          console.error('Ошибка:', error);
        }
      };

      if (loggedIn) {
        window.location.href = '/';
      }

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
                        <label htmlFor="login" className={regStyles.AuthLabel}>Почта</label>
                        <input
                            type="text"
                            autoComplete="off"
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            value={emailOrUsername}
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

                        <button 
                            className={regStyles.AuthButton}
                        >
                                Войти
                        </button>
                    </form>
                    <button className={regStyles.RememButton}>Забыли пароль?</button>
                    <a href="#" className={regStyles.RegLink}>Еще не зарегистрированы?</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
