import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import RegPostStyles from '../../styles/RegWindow/RegStyles.module.css';

import { Link } from 'react-router-dom';

const Reg = () => {
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const navigate = useNavigate();

    const handleLoginChange = (event) => {
        setLogin(event.target.value);
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
        
        if (password !== confirmPassword) {
            setPasswordsMatch(false);
            return;
        }
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/dj-rest-auth/login/', {
                login,
                email,
                password
            });
    
            console.log('Успешная регистрация:', response.data);

            navigate('/login');
            
        } catch (error) {
            console.error('Ошибка регистрации:', error);
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
                        value={login}
                        onChange={handleLoginChange}
                    />

                    <label htmlFor="email" className={RegPostStyles.RegLabel}>Эл. Почта</label>
                    <input
                        type="text"
                        value={email}
                        onChange={handleEmailChange}
                    />

                    <label htmlFor="password" className={RegPostStyles.RegLabel}>Пароль</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />

                    <label htmlFor="confirmPassword" className={RegPostStyles.RegLabel}>Подтвердите <br /> пароль</label>
                    <input 
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                    {!passwordsMatch && <div style={{ color: 'red' }}>Пароли не совпадают</div>}

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