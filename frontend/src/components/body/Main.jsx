import React, { useState, useEffect } from "react";
import mainStyles from '../../styles/MainWindow/mainStyle.module.css';
import Blocks from './Block';
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

    return (
        <main className={mainStyles.MainContainer}>
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
                <Blocks
                    title="Телефон"
                    description="АГА"
                    price="$19.99"
                    imageUrl="ссылка на изображение 1"
                />
                <Blocks
                    title="Телефон2"
                    description="Описание товара 2"
                    price="$29.99"
                    imageUrl="ссылка на изображение 2"
                />
                <Blocks
                    title="Телефон2"
                    description="Описание товара 2"
                    price="$29.99"
                    imageUrl="ссылка на изображение 2"
                />
                <Blocks
                    title="Телефон2"
                    description="Описание товара 2"
                    price="$29.99"
                    imageUrl="ссылка на изображение 2"
                />
                <Blocks
                    title="Телефон2"
                    description="Описание товара 2"
                    price="$29.99"
                    imageUrl="ссылка на изображение 2"
                />
            </div>
        </main>
    );
}
 
export default Main;
