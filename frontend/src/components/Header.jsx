import headStyles from '../styles/MainWindow/headStyle.module.css';
import BasketImg from '../img/icon-basket.png';
import AdminImg from '../img/icon-admin.png';
import BoxImg from '../img/icon-box.png';
import BackPict from '../img/BackPict.png';
import BackPictRight from '../img/BackPictRight.png';

import React, { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };


  const [prevScrollY, setPrevScrollY] = useState(0);
  const navbarRef = useRef(null);
  const searchBoxRef = useRef(null);
  const headHalfRef = useRef(null);

  const loggedIn = document.cookie.split(';').some(cookie => cookie.trim().startsWith('token='));

  console.log(loggedIn)

  useEffect(() => {
    const handleScroll = debounce(() => {
      const distanceY = window.scrollY;
      const scrollThreshold = 150;

      if (navbarRef.current && searchBoxRef.current && headHalfRef.current) {
        if (distanceY > scrollThreshold) {
          headHalfRef.current.classList.add(headStyles.stickyHeader);
          navbarRef.current.classList.add(headStyles.stickyHeader);
          searchBoxRef.current.classList.add(headStyles.stickyHeader);
          menuRef.current.classList.add(headStyles.stickyHeader);
          headHalfRef.current.style.height = '70px';
        } else {
          headHalfRef.current.classList.remove(headStyles.stickyHeader);
          navbarRef.current.classList.remove(headStyles.stickyHeader);
          searchBoxRef.current.classList.remove(headStyles.stickyHeader);
          menuRef.current.classList.remove(headStyles.stickyHeader);
          headHalfRef.current.style.height = '100px';
        }
        setPrevScrollY(distanceY);
      }
    }, 0);
    

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollY]);


  const [error, setError] = useState('');

  const handleLogout = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/dj-rest-auth/logout/');
  
      console.log(response)
  
      if (response.status !== 200) return;
  
      removeToken();

      window.location.reload();
  
    } catch (error) {
      setError('Не удалось выйти с аккаунта.');
      console.error('Ошибка:', error);
    }
  };
  
  const removeToken = () => {
    const expiryDate = new Date(0).toUTCString();
    document.cookie = 'token=;expires=' + expiryDate + ';path=/';
  
    console.log('Token removed');
  };

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

  return (
    <header>
        <div className={headStyles.BackPict}><img src={BackPict}/></div>
        <div className={headStyles.BackPictRight}><img src={BackPictRight}/></div>
        <div ref={headHalfRef} className={headStyles.headHalf}>
          <div ref={navbarRef} className={headStyles.navbar}>
            <nav className={headStyles.componLeft}>
              <a href="/" className={headStyles.logo}>
                <p className={headStyles.animation}>Store</p>
              </a>
              <span className={headStyles.geo}>Москва</span>
            </nav>
            <nav className={headStyles.other}>
              <span className={headStyles.otherPoint}>Контакты</span>
              <span className={headStyles.otherPoint}>О Нас</span>
              <span className={headStyles.otherPoint}>Юридическое соглашение</span>
            </nav>
            <nav className={headStyles.componRight}>
              <a href="#" className={headStyles.menuItem}><img src={BasketImg}/>Корзина</a>
              <div className={headStyles.verticalLine}></div>
              <a href="#" className={headStyles.menuItem}><img src={BoxImg}/>Заказы</a>
              <div className={headStyles.verticalLine}></div>
              {loggedIn ? (
                  <span
                    className={headStyles.menuItem}
                    onClick={handleMouseEnter}
                    ref={menuRef}
                  >
                    <img src={AdminImg} alt="admin" />
                    Админ
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
          <div ref={searchBoxRef} className={headStyles.searchBox}>
            <input className={headStyles.searchInput} type="text" placeholder='Найти товар'/>
            <a href="#" className={headStyles.searchButton}>Поиск</a>
          </div>
        </div>
    </header>
  );
}

export default Header;
