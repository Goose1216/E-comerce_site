import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import regStyles from '../../styles/RegWindow/RegStyles.module.css';
import axios from 'axios';
import { setToken } from '../../authStorage';

const Login = () => {
    const [emailOrName, setEmailOrName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
    
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/v1/dj-rest-auth/login/', {
            username: emailOrName,
            password: password
          });

          const token = response.data.key;

          setToken(token);

          navigate('/');
        } catch (error) {
          setError('Неправильные учетные данные. Пожалуйста, попробуйте снова.');
          console.error('Ошибка:', error);
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