import React from 'react';

function ProductList({ products }) {
  return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {products.map((product, index) => (
              <div key={index} style={{ border: '1px solid #ccc', borderRadius: '5px', width: '200px', margin: '10px', padding: '10px' }}>
                  <h3 style={{ fontSize: '16px' }}>{product.name}</h3>
                  <p>価格: {product.price}</p>
                  <a href={product.url} target="_blank" rel="noopener noreferrer">商品ページへ</a>
              </div>
          ))}
      </div>
  );
}

export default ProductList;
