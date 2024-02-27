import headStyles from '../styles/MainWindow/headStyle.module.css';
import BasketImg from '../img/icon-basket.png';
import AdminImg from '../img/icon-admin.png';
import BoxImg from '../img/icon-box.png';
import BackPict from '../img/BackPict.png'
import BackPictRight from '../img/BackPictRight.png'
import React, { useState, useEffect, useRef } from 'react';
import { throttle } from 'lodash';

const Header = () => {
  const [prevScrollY, setPrevScrollY] = useState(0);
  const navbarRef = useRef(null);
  const searchBoxRef = useRef(null);
  const headHalfRef = useRef(null);

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

  const handleLogin = () => {
    window.open('/login', '_self');
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
              <a onClick={handleLogin} className={headStyles.menuItem}><img src={AdminImg} alt="admin"/>Войти</a>
            </nav>
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