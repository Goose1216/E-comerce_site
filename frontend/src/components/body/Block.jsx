import blockStyle from '../../styles/MainWindow/BlockStyle.module.css'
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

const Block = ({ title, description, price}) => {
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
    <div className={blockStyle.BlockContainer}>
      {todos.map(item => (
        <div className={blockStyle.Block} key={item.id}>
          <div>
            <img src={item.image} alt="Изображение товара" />
          </div>
          <h1 className={blockStyle.ProductName}>{item.name}</h1>
          <span className={blockStyle.ProductPrice}>{item.price} ₽</span>
        </div>
      ))}
    </div>
  );
};

export default Block;