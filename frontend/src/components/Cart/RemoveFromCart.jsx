const RemoveFromCart = async (cartItemPk, cartId, setCartItemsCount) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/cart/remove/${cartItemPk}/`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      const cartResponse = await fetch(`http://localhost:8000/api/v1/cart/?cart_id=${cartId}`);
      const cartData = await cartResponse.json();
      setCartItemsCount(cartData.length);
    } else {
      throw new Error(`HTTP error ${response.status}`);
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
  }
};

export default RemoveFromCart;