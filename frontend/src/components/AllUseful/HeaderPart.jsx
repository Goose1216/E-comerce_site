import headStyles from '../../styles/AllUsefulStyles/headerPart.module.css';
import BasketImg from '../../img/icon-basket.png';
import AdminImg from '../../img/icon-admin.png';
import BoxImg from '../../img/icon-box.png';
import BackPict from '../../img/BackPict.png';
import BackPictRight from '../../img/BackPictRight.png';

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getToken, removeToken } from '../../authStorage';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/dj-rest-auth/user/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const HeaderPart = () => {

    const [username, setUserName] = useState('');
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const token = getToken();
          if (token) {
            const response = await api.get('/', {
              headers: {
                'Authorization': `Token ${token}`,
              },
            });
            const userData = response.data;
            setUserName(userData.username);
          }
        } catch (error) {
          setError('Ошибка при получении информации о пользователе');
          console.error('Ошибка при получении информации о пользователе:', error);
        }
      };
  
      fetchUserInfo();
    }, []);
  
    const handleLogout = async (e) => {
      e.preventDefault();
      
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/v1/dj-rest-auth/logout/');
    
        if (response.status === 200) {
          removeToken();
  
          window.location.reload();
  
        } else {
          setError('Не удалось выйти с аккаунта.');
        }
      } catch (error) {
        setError('Не удалось выйти с аккаунта.');
        console.error('Ошибка:', error);
      }
    };
  
    const loggedIn = document.cookie.split(';').some(cookie => cookie.trim().startsWith('token='));
    console.log(loggedIn)
  
  
  
  
  
    const handleMouseEnter = () => {
      setIsMenuOpen(true);
    };
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsMenuOpen(false);
        }
      };
  
      document.addEventListener('click', handleClickOutside);
  
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, []);
  
    const navbarRef = useRef(null);
    const searchBoxRef = useRef(null);
    const headHalfRef = useRef(null);
    const menuRef = useRef(null);
  
  
  
  
    return (
      <header>
          <div className={headStyles.BackPict}><img src={BackPict}/></div>
          <div className={headStyles.BackPictRight}><img src={BackPictRight}/></div>
          <div className={headStyles.headHalf}>
            <div className={headStyles.navbar}>
              <nav className={headStyles.componLeft}>
                <a href="/" className={headStyles.logo}>
                  <p className={headStyles.animation}>Store</p>
                </a>
                <span className={headStyles.geo}>Москва</span>
              </nav>
              <nav className={headStyles.componRight}>
                <a href="#" className={headStyles.menuItem}><img src={BasketImg}/>Корзина</a>
                <div className={headStyles.verticalLine}></div>
                <a href="#" className={headStyles.menuItem}><img src={BoxImg}/>Заказы</a>
                <div className={headStyles.verticalLine}></div>
                {username ? (
                  <span className={headStyles.menuItem} onClick={handleMouseEnter} ref={menuRef}>
                    {username}
                  </span>
                ) : (
                  <Link to="/login" className={headStyles.menuItem}><img src={AdminImg} alt="admin" />Войти</Link>
                )}
              </nav>
                {isMenuOpen && (
                  <div className={headStyles.Admin}>
                    <Link to="/account">
                      <a href="#" className={headStyles.AuthItem}>
                        Личный кабинет
                      </a>
                    </Link>
                    <button className={headStyles.AuthExit} onClick={handleLogout}>
                      Выйти
                    </button>
                  </div>
                )}
            </div>
            <div className={headStyles.searchBox}>
              <input className={headStyles.searchInput} type="text" placeholder='Найти товар'/>
              <a href="#" className={headStyles.searchButton}>Поиск</a>
            </div>
          </div>
      </header>
    );
  }
  
  export default HeaderPart;