import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import RegPostStyles from '../../styles/RegWindow/RegStyles.module.css';

import { Link } from 'react-router-dom';

const Reg = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailError(''); // Сбрасываем ошибку при изменении email
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordError(''); // Сбрасываем ошибку при изменении пароля
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setConfirmPasswordError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/dj-rest-auth/registration/', {
                username,
                email,
                password1: password,
                password2: confirmPassword
            });

            console.log('Успешная регистрация:', response.data);

            navigate('/login');

        } catch (error) {
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.email) {
                    setEmailError(responseData.email[0]);
                }
                if (responseData.password1) {
                    setPasswordError(responseData.password1[0]);
                }
                if (responseData.password2) {
                    setConfirmPasswordError(responseData.password2[0]);
                }
            } else if (error.request) {
                console.error('Ошибка при отправке запроса:', error.request);
            } else {
                console.error('Ошибка:', error.message);
            }
        }
    };

    return (
        <div className={RegPostStyles.Body}>
            <div>
                <a href='\' className={RegPostStyles.GoBack}>
                    <p className={RegPostStyles.GoBackLabelVector}>←</p>
                    <p className={RegPostStyles.GoBackLabel}>Вернуться на главную</p>
                </a>
                <div className={RegPostStyles.Window}>
                    <h1>Регистрация</h1>
                    <form className={RegPostStyles.RegForm} onSubmit={handleSubmit}>
                        <label htmlFor="login" className={RegPostStyles.RegLabel}>Логин</label>
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                        />

                        <label htmlFor="email" className={RegPostStyles.RegLabel}>Эл. Почта</label>
                        <input
                            type="text"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                        {emailError && <div className={RegPostStyles.errorMessageEmail}>{emailError}</div>}

                        <label htmlFor="password" className={RegPostStyles.RegLabel}>Пароль</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        {passwordError && <div className={RegPostStyles.errorMessagePass}>{passwordError}</div>}

                        <label htmlFor="confirmPassword" className={RegPostStyles.RegLabel}>Подтвердите <br /> пароль</label>
                        <input 
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                        {confirmPasswordError && <div className={RegPostStyles.errorMessagePassConf}>{confirmPasswordError}</div>}

                        <button
                            className={RegPostStyles.RegButton} disabled={loading}>
                                {loading ? <span className={RegPostStyles.spinner}></span> : 'Зарегистрироваться'}
                        </button>

                        <Link to="/login" className={RegPostStyles.RegLink}>Авторизоваться</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Reg;
