import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartQuantity, setCartQuantity] = useState(0);

    return (
        <CartContext.Provider value={{ cartQuantity, setCartQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
