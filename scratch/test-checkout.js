async function test() {
  const productsRes = await fetch('http://localhost:3008/api/products');
  const productsData = await productsRes.json();
  const product = productsData.products[0];
  console.log('Testing with product:', product.name, product.price);

  const checkoutRes = await fetch('http://localhost:3008/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productId: product.id, quantity: 1, color: 'Prism Holo', size: 'Single Pack' }],
      promoCode: 'GLITCH10',
    }),
  });

  const checkoutData = await checkoutRes.json();
  console.log('Checkout response:', checkoutData);
}

test();
