import React, { useState, useEffect, useRef } from "react";
import mainStyles from '../../styles/MainWindow/mainStyle.module.css';
import axios from 'axios';

const Main = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/v1/')
            .then(res => {
                setTodos(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

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
        <main className={mainStyles.MainContainer}>
            <div className={mainStyles.carouselContainer}>
            <span ref={carouselRef} className={mainStyles.carousel} style={{ transform: `translateX(${position}px)` }}>
                <div ref={itemRef} className={mainStyles.item}></div>
                <div ref={itemRef} className={mainStyles.item}></div>
                <div ref={itemRef} className={mainStyles.item}></div>
            </span>
            <span className={mainStyles.TapeButtons}>
                <button className={mainStyles.arrow} onClick={() => scrollCarousel('left')}>&#60;</button>
                <button className={mainStyles.arrow} onClick={() => scrollCarousel('right')}>&#62;</button>
            </span>
            </div>
            <h2 className={mainStyles.Stock}>НОВИНКА</h2>
            <div className={mainStyles.NewContainerBlocks}>
                {todos.map(item => (
                    <div key={item.id}>
                        <h1>{item.name}</h1>
                        <span>{item.price}</span>
                    </div>
                ))}
            </div>
            <h2 className={mainStyles.NewProduct}>ЛУЧШИЕ ПРЕДЛОЖЕНИЯ</h2>
            <div className={mainStyles.BestContainerBlocks}>
                
            </div>
        </main>
    );
}
 
export default Main;
