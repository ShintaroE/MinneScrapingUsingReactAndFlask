import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // CSSファイルを読み込む

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('price'); // デフォルトで金額順

  const fetchProducts = async () => {
    if (keyword.trim() === '') {
      setError('検索ワードを入力してください');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/search?keyword=${keyword}`, {
        timeout: 10000000 //タイムアウト設定
      });
      setProducts(response.data);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        console.error('リクエストがタイムアウトしました', error);
      } else {
        console.error('データの取得に失敗しました', error);
      }
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
    setError(null);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedProducts = products.slice().sort((a, b) => {
    if (sortOption === 'price') {
      return parseFloat(a.price.replace(/[^0-9.-]+/g, '')) - parseFloat(b.price.replace(/[^0-9.-]+/g, ''));
    } else if (sortOption === 'favoritecount') {
      return parseInt(b.favoritecount.replace(/[^0-9]/g, '')) - parseInt(a.favoritecount.replace(/[^0-9]/g, ''));
    }
    return 0;
  });

  const prices = products.map(product =>
    parseFloat(product.price.replace(/[^0-9.-]+/g, ''))
  );

  const maxPrice = Math.max(...prices).toLocaleString();
  const minPrice = Math.min(...prices).toLocaleString();
  const avgPrice = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2).toLocaleString();

  return (
    <div className="container">
      <h1 className="title">Minne 商品検索</h1>
      <div className="searchContainer">
        <input 
          type="text" 
          value={keyword} 
          onChange={handleInputChange} 
          placeholder="検索ワードを入力" 
          className="input" 
        />
        <button className="button" onClick={fetchProducts}>検索</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="sortContainer">
        <label htmlFor="sort" className="label">並べ替え:</label>
        <select id="sort" value={sortOption} onChange={handleSortChange} className="select">
          <option value="price">金額順</option>
          <option value="favoritecount">いいね数順</option>
        </select>
      </div>
      {loading ? (
        <p>データを取得しています...</p>
      ) : (
        <>
          <div className="stats">
            <p>最高金額: {maxPrice}円</p>
            <p>最低金額: {minPrice}円</p>
            <p>平均金額: {avgPrice}円</p>
          </div>
          <ProductList products={sortedProducts} />
        </>
      )}
    </div>
  );
}

function ProductList({ products }) {
  if (products.length === 0) return null;

  return (
    <div className="listContainer">
      <div className="productList">
        {products.map((product, index) => (
          <div key={index} className="productItem">
            <img src={product.img} alt={product.name} className="productImage" />
            <h3 className="productName">{product.name}</h3>
            <p className="productPrice">価格: {product.price}</p>
            <p className="productRating">評価: {product.ratingcount}</p>
            <p className="productReview">レビュー数: {product.reviewcount}</p>
            <p className="productFavorite">いいね数: {product.favoritecount}</p>
            <a className="productLink" href={product.url} target="_blank" rel="noopener noreferrer">商品ページへ</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
