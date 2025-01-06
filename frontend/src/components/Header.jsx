import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { getToken, removeToken } from '../authStorage';
import axios from 'axios';
import headStyles from '../styles/MainWindow/headStyle.module.css';
import BasketImg from '../img/icon-basket.png';
import AdminImg from '../img/icon-admin.png';
import BoxImg from '../img/icon-box.png';
import BackPict from '../img/BackPict.png';
import BackPictRight from '../img/BackPictRight.png';
import { useCart } from '../CartContext';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/dj-rest-auth/user/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const Header = () => {
  const [username, setUserName] = useState('');
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const prevScrollY = useRef(0);
  const navbarRef = useRef(null);
  const searchBoxRef = useRef(null);
  const headHalfRef = useRef(null);
  const menuRef = useRef(null);

  const { cartQuantity, setCartQuantity } = useCart();

  const navigate = useNavigate();

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
    fetchCartQuantity();
  }, []);

  const fetchCartQuantity = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/v1/products/cart/get/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        setCartQuantity(response.data.length);
        } catch (error) {
      console.error('Ошибка при получении количества товаров в корзине:', error);
    }
  };

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

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query) {
      navigate(`/catalog?q=${encodeURIComponent(query)}`);
      setQuery(''); // Очистка поля поиска после перенаправления
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e); // Вызываем функцию поиска при нажатии Enter
    }
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

  useEffect(() => {
    const handleScroll = debounce(() => {
      const distanceY = window.scrollY;
      const scrollThreshold = 150;

      if (navbarRef.current && searchBoxRef.current && headHalfRef.current && menuRef.current) {
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
        prevScrollY.current = distanceY;
      }
    }, 0);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header>
      <div className={headStyles.BackPict}><img src={BackPict} alt="background" /></div>
      <div className={headStyles.BackPictRight}><img src={BackPictRight} alt="background right" /></div>
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
            <Link to="/cart" className={headStyles.menuItem}>
              <img src={BasketImg} alt="cart" />
              Корзина
              {cartQuantity > 0 && (
                <span className={headStyles.cartQuantity}>{cartQuantity}</span>
              )}
            </Link>
            <div className={headStyles.verticalLine}></div>
            <a href="#" className={headStyles.menuItem}><img src={BoxImg} alt="box" />Заказы</a>
            <div className={headStyles.verticalLine}></div>
            {username ? (
              <span className={headStyles.menuItem} onClick={handleMouseEnter} ref={menuRef}>
                {username}
              </span>
            ) : (
              <Link to="/login" className={headStyles.menuItem} ref={menuRef}>
                <img src={AdminImg} alt="admin" />
                Войти
              </Link>
            )}
          </nav>
          {isMenuOpen && (
            <div className={headStyles.Admin}>
              <button className={headStyles.AuthExit} onClick={handleLogout}>
                Выйти
              </button>
            </div>
          )}
        </div>
        <div ref={searchBoxRef} className={headStyles.searchBox}>
            <input
                className={headStyles.searchInput}
                type="text"
                placeholder='Найти товар'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress} // Добавляем обработчик нажатия клавиш
            />
            <button type="button" className={headStyles.searchButton} onClick={handleSearch}>Поиск</button>
        </div>
      </div>
      <a href='/catalog' className={headStyles.CatalogContainer}>
        <p className={headStyles.CatalogButton}>Каталог</p>
      </a>
    </header>
  );
}

export default Header;
