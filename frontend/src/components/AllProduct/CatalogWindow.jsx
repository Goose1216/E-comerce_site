import catalogStyle from '../../styles/AllProductStyles/CatalogWindowStyle.module.css';
import blockStyle from '../../styles/MainWindow/BlockStyle.module.css';
import SalePict from '../../img/SalePict.png'
import CartImg from '../../img/orange-cart.png';
import CartImgActive from '../../img/green-cart.png';
import AddToCartButton from '../../AddToCartButton.js';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../../CartContext';

const CatalogWindow = () => {

    const [sortPrice, setSortPrice] = useState(false);
    const [sortManufact, setSortManufact] = useState(false);

    const [isActivePrice, setIsActivePrice] = useState(false);
    const [isActiveManufact, setIsActiveManufact] = useState(false);

    const handleMouseEnterPrice = () => {
        setSortPrice(prevState => !prevState);
        setIsActivePrice(prevState => !prevState);
    };

    const handleMouseEnterManufact = () => {
        setSortManufact(prevState => !prevState);
        setIsActiveManufact(prevState => !prevState);
    };

    const handleClickOutside = (event, ref, setState) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setState(false);
        };
    };


    useEffect(() => {
        const handleClick = (event) => {
            handleClickOutside(event, sortWindowRef1, setSortChoice1);
            handleClickOutside(event, sortWindowRef2, setSortChoice2);
        };

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    const [data, setData] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);
    const [absoluteMinPrice, setAbsoluteMinPrice] = useState(0);
    const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(10000000);
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [sortingOption1, setSortingOption1] = useState('Сначала дорогие');
    const [sortingOption2, setSortingOption2] = useState('По бренду');
    const [sortChoice1, setSortChoice1] = useState(false);
    const [sortChoice2, setSortChoice2] = useState(false);
    const location = useLocation();
    const { setCartQuantity } = useCart();

    const sortWindowRef1 = useRef(null);
    const sortWindowRef2 = useRef(null);

    const sortingOptions1 = {
        '-price': 'Сначала дорогие',
        'price': 'Сначала недорогие',
        'name': 'По алфавиту'
    };

    const sortingOptions2 = {
        'brand': 'По бренду',
        'in_stock': 'В наличии'
    };

    const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
        return {
          q: params.get('q') || '',
          brand: params.get('brand') ? params.get('brand').split('-') : [],
        };
    };

    const getSortingKey1 = (value) => Object.keys(sortingOptions1).find(key => sortingOptions1[key] === value);
    const getSortingKey2 = (value) => Object.keys(sortingOptions2).find(key => sortingOptions2[key] === value);

    useEffect(() => {
        fetchData();
    }, [currentPage, sortingOption1, sortingOption2, location.search]);

    const fetchData = () => {
        const params = new URLSearchParams();
        params.set('page', currentPage);
        // params.set('group', getSortingKey2(sortingOption2));
        params.set('sort', getSortingKey1(sortingOption1));
        const priceRange = `${minPrice}-${maxPrice}`;
        params.set('price', priceRange);
        const { q, brand} = getQueryParams();
        if (q) {
          params.set('q', q);
        }
        if (selectedBrands.length > 0) {
          params.set('brand', selectedBrands.join('-'));
        }



        axios.get(`http://127.0.0.1:8000/api/v1/products/list?${params.toString()}`)
            .then(response => {
                setData(response.data.results);
                setNextPage(response.data.next);
                setPrevPage(response.data.previous);
                setTotalPages(response.data.count_pages);
                setBrands(response.data.brands);
                setAbsoluteMinPrice(response.data.min_price);
                setAbsoluteMaxPrice(response.data.max_price);
                if (minPrice === 0) {
                    setMinPrice(response.data.min_price)
                }
                if (maxPrice === 10000000) {
                    setMaxPrice(response.data.max_price)
                }
            })
            .catch(error => console.error('Error fetching data: ', error));
    };

    const handleBrandChange = (brand) => {
        if (selectedBrands.includes(brand)) {
          setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
          setSelectedBrands([...selectedBrands, brand]);
        }
      };

    const handlePrevClick = () => {
        if (prevPage !== null) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (nextPage !== null) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFirstClick = () => {
        setCurrentPage(1);
    };

    const handleLastClick = () => {
        setCurrentPage(totalPages);
    };


    const handlePageClick = (page) => {
        setCurrentPage(page);
    };
    const handleMinPriceChange = (event) => {
        const newMinPrice = parseInt(event.target.value);
        if (newMinPrice < maxPrice - 100) {
            setMinPrice(newMinPrice);
        }
            };

    const handleMaxPriceChange = (event) => {
        const newMaxPrice = parseInt(event.target.value);
        if (newMaxPrice - 100 > minPrice) {
            setMaxPrice(newMaxPrice);
        }
    };

    const handleSortingChange1 = (event) => {
        setSortingOption1(sortingOptions1[event.target.value]);
    };

    const handleSortingChange2 = (event) => {
        setSortingOption2(sortingOptions2[event.target.value]);
    };

    const handleMouseEnter1 = () => setSortChoice1(true);
    const handleMouseEnter2 = () => setSortChoice2(true);

    const handleConfirmPrices = () => {
        fetchData();
    };

    const handleAddToCart = () => {

    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <span
                    key={i}
                    className={currentPage === i ? `${catalogStyle.page_number} ${catalogStyle.active}` : catalogStyle.page_number}
                    onClick={() => handlePageClick(i)}
                >
                    {i}
                </span>
            );
        }
        return pages;
    };



    return (
        <div>
            <div className={catalogStyle.Body}>
                <div className={catalogStyle.filterContainer}>
                    <div className={catalogStyle.Filter} onClick={handleMouseEnterPrice}>
                        <div className={catalogStyle.arrow} style={{ transform: isActivePrice ? 'rotate(180deg)' : 'rotate(0deg)' }}></div>
                        Цена
                    </div>
                    {sortPrice && (
                        <div className={catalogStyle.range_slider_container}>
                            <div className={catalogStyle.range_slider_wrapper}>
                                <div className={catalogStyle.slider_track}></div>
                                <input
                                    type="range"
                                    min={absoluteMinPrice}
                                    max={absoluteMaxPrice}
                                    value={minPrice}
                                    onChange={handleMinPriceChange}
                                />
                                <input
                                    type="range"
                                    min={absoluteMinPrice}
                                    max={absoluteMaxPrice}
                                    value={maxPrice}
                                    onChange={handleMaxPriceChange}
                                />
                            </div>
                            <div className={catalogStyle.slider_values}>
                                <input type="text" value={`От: ${minPrice}`} className={catalogStyle.value} readOnly />
                                <p>---</p>
                                <input type="text" value={`До: ${maxPrice}`} className={catalogStyle.value} readOnly />
                            </div>

                        </div>
                    )}
                    <div className={catalogStyle.Filter} onClick={() => { setSortManufact(!sortManufact); setIsActiveManufact(!isActiveManufact); }}>
                    <div className={catalogStyle.arrow} style={{ transform: isActiveManufact ? 'rotate(180deg)' : 'rotate(0deg)' }}></div>
                    Бренды
                  </div>
                  {sortManufact && (
                    <div className={catalogStyle.brandContainer}>
                      {brands.map((brand) => (
                        <label key={brand} className={catalogStyle.brandItem}>
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                          />
                          {brand}
                        </label>
                      ))}
                    </div>
                  )}
                    <button onClick={handleConfirmPrices} className={catalogStyle.confirmButton}>Подтвердить</button>
                </div>
                <div className={catalogStyle.catalogContainer}>
                    <div className={catalogStyle.UpFilterContainer}>
                        <span className={catalogStyle.Choice}>
                            Сортировка:
                            <span className={catalogStyle.ButtonChoice} ref={sortWindowRef1} onClick={handleMouseEnter1}>
                                <p>{sortingOption1}</p>
                                {sortChoice1 && (
                                    <li className={`${catalogStyle.sortWindow} ${catalogStyle.sortWindowFirst}`}>
                                        <label className={catalogStyle.radio_container}>
                                            <input
                                                type="radio"
                                                value="-price"
                                                checked={sortingOption1 === 'Сначала дорогие'}
                                                onChange={handleSortingChange1}
                                                className={catalogStyle.radio_input}
                                            />
                                            <span className={catalogStyle.radio_custom}></span>
                                            <span className={catalogStyle.radio_label}>Сначала дорогие</span>
                                        </label>
                                        <br />
                                        <br />
                                        <label className={catalogStyle.radio_container}>
                                            <input
                                                type="radio"
                                                value="price"
                                                checked={sortingOption1 === 'Сначала недорогие'}
                                                onChange={handleSortingChange1}
                                                className={catalogStyle.radio_input}
                                            />
                                            <span className={catalogStyle.radio_custom}></span>
                                            <span className={catalogStyle.radio_label}>Сначала недорогие</span>
                                        </label>
                                        <br />
                                        <br />
                                        <label className={catalogStyle.radio_container}>
                                            <input
                                                type="radio"
                                                value="name"
                                                checked={sortingOption1 === 'По алфавиту'}
                                                onChange={handleSortingChange1}
                                                className={catalogStyle.radio_input}
                                            />
                                            <span className={catalogStyle.radio_custom}></span>
                                            <span className={catalogStyle.radio_label}>По алфавиту</span>
                                        </label>
                                    </li>
                                )}
                            </span>
                        </span>
                        <span className={catalogStyle.Choice}>
                            Группировка:
                            <span className={catalogStyle.ButtonChoice} ref={sortWindowRef2} onClick={handleMouseEnter2}>
                                <p>{sortingOption2}</p>
                                {sortChoice2 && (
                                    <li className={`${catalogStyle.sortWindow} ${catalogStyle.sortWindowSecond}`}>
                                        <label className={catalogStyle.radio_container}>
                                            <input
                                                type="radio"
                                                value="brand"
                                                checked={sortingOption2 === 'По бренду'}
                                                onChange={handleSortingChange2}
                                                className={catalogStyle.radio_input}
                                            />
                                            <span className={catalogStyle.radio_custom}></span>
                                            <span className={catalogStyle.radio_label}>По бренду</span>
                                        </label>
                                        <br />
                                        <br />
                                        <label className={catalogStyle.radio_container}>
                                            <input
                                                type="radio"
                                                value="in_stock"
                                                checked={sortingOption2 === 'В наличии'}
                                                onChange={handleSortingChange2}
                                                className={catalogStyle.radio_input}
                                            />
                                            <span className={catalogStyle.radio_custom}></span>
                                            <span className={catalogStyle.radio_label}>В наличии</span>
                                        </label>
                                    </li>
                                )}
                            </span>
                        </span>
                    </div>

                    <div className={catalogStyle.BlockContainer}>
                        {data.map(item => (
                            <div className={catalogStyle.Block} key={item.id}>
                                <div>
                                    <img src={item.image} alt="Изображение товара" />
                                </div>
                                <h1 className={catalogStyle.ProductName}>{item.name}</h1>
                                <span className={item.discount > 0 ? catalogStyle.OldProductPrice : catalogStyle.ProductPrice}>
                                    {item.price_standart.toLocaleString('ru-RU')} ₽
                                </span>
                                 <AddToCartButton
                                   imageSrc={CartImg}
                                   activeImageSrc={CartImgActive}
                                   productId = {item.pk}
                                   countItem = {1}
                                   setCartQuantity = {setCartQuantity}
                                   className={blockStyle.AddToCartButtonCatalog} >
                                   <img src={CartImg} alt="Корзина" />
                                 </AddToCartButton >
                                {item.discount > 0 && (
                                    <div>
                                        <span className={catalogStyle.ProductPrice}>
                                            {item.price.toLocaleString('ru-RU')} ₽
                                        </span>
                                        <div className={catalogStyle.SalePicture}>
                                            <img src={SalePict} alt="Скидка" />
                                        </div>
                                </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={catalogStyle.controls}>
                        <div className={catalogStyle.first_btn} onClick={handleFirstClick}>&lt;&lt;</div>
                        <div className={catalogStyle.prev_btn} onClick={handlePrevClick}>&lt;</div>
                        <div className={catalogStyle.page_numbers}>
                            {renderPageNumbers()}
                        </div>
                        <div className={catalogStyle.next_btn} onClick={handleNextClick}>&gt;</div>
                        <div className={catalogStyle.last_btn} onClick={handleLastClick}>&gt;&gt;</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CatalogWindow;
