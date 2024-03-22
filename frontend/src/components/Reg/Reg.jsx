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
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    
    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
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
                if (error.response.data.email) {
                    const emailError = error.response.data.email[0];
                    console.error('Ошибка в email:', emailError);
                }
                if (error.response.data.password1) {
                    const password1Error = error.response.data.password1[0];
                    console.error('Ошибка в password1:', password1Error);
                }
                if (error.response.data.password2) {
                    const password2Error = error.response.data.password2[0];
                    console.error('Ошибка в password2:', password2Error);
                }
                if (error.response.data.non_field_errors) {
                    const password2Error = error.response.data.non_field_errors[0];
                    console.error('Ошибка в password2:', password2Error);
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
            {error && <div className={RegPostStyles.errorMessage}>{error}</div>}
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

                    <label htmlFor="password" className={RegPostStyles.RegLabel}>Пароль</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />

                    <label htmlFor="confirmPassword" className={RegPostStyles.RegLabel}>Подтвердите <br /> пароль</label>
                    <input 
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                    />

                    <button
                        className={RegPostStyles.RegButton}>
                            Зарегистрироваться
                    </button>

                    <Link to="/login" className={RegPostStyles.RegLink}>Авторизоваться</Link>
                </form>
            </div>
        </div>
    </div>
    );
}
 
export default Reg;