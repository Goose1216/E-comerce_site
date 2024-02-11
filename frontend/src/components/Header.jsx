import headStyles from '../styles/MainWindow/headStyle.module.css';
import BasketImg from '../img/icon-basket.png';
import AdminImg from '../img/icon-admin.png';
import BoxImg from '../img/icon-box.png';
import React, { useState, useEffect, useRef } from 'react';

const Header = () => {
  const [position, setPosition] = useState(0);
  const carouselRef = useRef(null);
  const itemRef = useRef(null);
  const carouselItems = ['1', '2', '3'];

  const scrollCarousel = (direction) => {
    const itemWidth = itemRef.current.offsetWidth;
    const containerWidth = carouselRef.current.offsetWidth;
    const scrollAmount = containerWidth;

    let newPosition;

    if (direction === 'left') {
      newPosition = position + scrollAmount;
    } else {
      newPosition = position - scrollAmount;
    }

    if (newPosition > 0) {
      newPosition = -(itemWidth * (carouselItems.length - 1));
    } else if (newPosition < -(itemWidth * (carouselItems.length - 1))) {
      newPosition = 0;
    }

    setPosition(newPosition);
  };

  
  return (
    <header>
        <div className={headStyles.navbar}>
          <nav className={headStyles.compon}>
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
          <nav className={headStyles.compon}>
            <a href="#" className={headStyles.menuItem}><img src={BasketImg}/>Корзина</a>
            <div className={headStyles.verticalLine}></div>
            <a href="#" className={headStyles.menuItem}><img src={BoxImg}/>Заказы</a>
            <div className={headStyles.verticalLine}></div>
            <a href="#" className={headStyles.menuItem}><img src={AdminImg}/>Войти</a>
          </nav>
        </div>
        <div className={headStyles.searchBox}>
          <input className={headStyles.searchInput} type="text" placeholder='Найти товар'/>
          <a href="#" className={headStyles.searchButton}>Поиск</a>
        </div>
        <div className={headStyles.carouselContainer}>
          <span ref={carouselRef} className={headStyles.carousel} style={{ transform: `translateX(${position}px)` }}>
              <div ref={itemRef} className={headStyles.item}></div>
              <div ref={itemRef} className={headStyles.item}></div>
              <div ref={itemRef} className={headStyles.item}></div>
          </span>
          <span className={headStyles.TapeButtons}>
            <button className={headStyles.arrow} onClick={() => scrollCarousel('left')}>&#60;</button>
            <button className={headStyles.arrow} onClick={() => scrollCarousel('right')}>&#62;</button>
          </span>
        </div>
    </header>
  );
}

export default Header;
