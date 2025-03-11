import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import blockStyle from '../../styles/MainWindow/BlockStyle.module.css';

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
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailError('');
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordError('');
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setConfirmPasswordError('');
    };

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
        setPhoneError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        try {
            if (phone == '') {
             const response = await axios.post('http://127.0.0.1:8000/api/v1/dj-rest-auth/registration/', {
                username,
                email,
                password1: password,
                password2: confirmPassword,
            });
            console.log('Успешная регистрация:', response.data);

            navigate('/login');

            } else {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/dj-rest-auth/registration/', {
                username,
                email,
                password1: password,
                password2: confirmPassword,
                phone_number: phone
            });
            console.log('Успешная регистрация:', response.data);

            navigate('/login');
            }

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
                if (responseData.non_field_errors) {
                    setConfirmPasswordError(responseData.non_field_errors[0]);
                }
                if (responseData.phone_number) {
                    setPhoneError(responseData.phone_number[0]);
                }
            } else if (error.request) {
                console.error('Ошибка при отправке запроса:', error.request);
            } else {
                console.error('Ошибка:', error.message);
            }
        }
        finally {
        setLoading(false);
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

                        <label htmlFor="phone" className={RegPostStyles.RegLabel}>Телефон</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={handlePhoneChange}
                        />
                        {phoneError && <div className={RegPostStyles.errorMessagePhoneError}>{phoneError}</div>}

                        <button
                            className={RegPostStyles.RegButton} disabled={loading}>
                                {loading ? <span className={blockStyle.spinner}></span> : 'Зарегистрироваться'}
                        </button>

                        <Link to="/login" className={RegPostStyles.RegLink}>Авторизоваться</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Reg;
