import headStyles from '../styles/MainWindow/headStyle.module.css';
import BasketImg from '../img/icon-basket.png';
import AdminImg from '../img/icon-admin.png';
import BoxImg from '../img/icon-box.png';
import BackPict from '../img/BackPict.png';
import BackPictRight from '../img/BackPictRight.png';

import React, { useState, useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };


  const [prevScrollY, setPrevScrollY] = useState(0);
  const navbarRef = useRef(null);
  const searchBoxRef = useRef(null);
  const headHalfRef = useRef(null);

  const loggedIn = localStorage.getItem('token') !== null;

  console.log(loggedIn)

  useEffect(() => {
    const handleScroll = throttle(() => {
      const distanceY = window.scrollY;
      const scrollThreshold = 150;
      const scrollChange = distanceY - prevScrollY;
    
      if (navbarRef.current && searchBoxRef.current) {
        if (distanceY > scrollThreshold) {
          headHalfRef.current.classList.add(headStyles.stickyHeader);
          navbarRef.current.classList.add(headStyles.stickyHeader);
          searchBoxRef.current.classList.add(headStyles.stickyHeader);
          headHalfRef.current.style.height = `${70 - scrollChange / 5}px`;
        } else {
          headHalfRef.current.classList.remove(headStyles.stickyHeader);
          navbarRef.current.classList.remove(headStyles.stickyHeader);
          searchBoxRef.current.classList.remove(headStyles.stickyHeader);
          headHalfRef.current.style.height = '100px';
        }
        setPrevScrollY(distanceY);
      }
    }, 200);
    

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

      if (response.status != 200) return

      localStorage.removeItem('token');

      window.location.reload();

    } catch (error) {
      setError('Не удалось выйти с аккаунта.');
      console.error('Ошибка:', error);
    }
  };

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
                  <a href="#"
                    className={headStyles.menuItem}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img src={AdminImg} alt="admin" />
                    Админ
                  </a>
                ) : (
                  <Link to="/login" className={headStyles.menuItem}><img src={AdminImg} alt="admin" />Войти</Link>
                )}
            </nav>
              {isMenuOpen && (
                <div className={headStyles.Admin} onMouseEnter={handleMouseEnter}>
                  <Link to="/account">
                    <a href="#" className={headStyles.menuItem}>
                      Личный кабинет
                    </a>
                  </Link>
                  <a href="#" className={headStyles.menuItem} onClick={handleLogout}>
                    Выйти
                  </a>
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