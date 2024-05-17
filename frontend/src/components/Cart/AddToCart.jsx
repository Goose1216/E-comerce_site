const AddToCart = async (productId, cartId, cnt_product, setCartItemsCount) => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/product/cart/add/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart_id: cartId,
        product: productId,
        quantity: cnt_product,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const cartResponse = await fetch(`http://localhost:8000/api/v1/product/cart/?cart_id=${cartId}`);
    const cartData = await cartResponse.json();
    setCartItemsCount(cartData.length);
  } catch (error) {
    console.error('Ошибка при добавлении в корзину:', error);
  }
};

export default AddToCart;
