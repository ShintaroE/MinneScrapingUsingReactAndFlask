import React, { useState } from 'react';
import axios from 'axios';

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
      const response = await axios.get(`http://127.0.0.1:5000/api/search?keyword=${keyword}` , {
        timeout : 10000000 //タイムアウト設定
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

  // ソート処理
  const sortedProducts = products.slice().sort((a, b) => {
    if (sortOption === 'price') {
      return parseFloat(a.price.replace(/[^0-9.-]+/g, '')) - parseFloat(b.price.replace(/[^0-9.-]+/g, ''));
    } else if (sortOption === 'favoritecount') {
      return parseInt(b.favoritecount.replace(/[^0-9]/g, '')) - parseInt(a.favoritecount.replace(/[^0-9]/g, ''));
    }
    return 0;
  });

  // 金額に関する計算
  const prices = products.map(product =>
    parseFloat(product.price.replace(/[^0-9.-]+/g, ''))
  );

  const maxPrice = Math.max(...prices).toLocaleString();
  const minPrice = Math.min(...prices).toLocaleString();
  const avgPrice = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2).toLocaleString();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Minne 商品検索</h1>
      <div style={styles.searchContainer}>
        <input 
          type="text" 
          value={keyword} 
          onChange={handleInputChange} 
          placeholder="検索ワードを入力" 
          style={styles.input} 
        />
        <button style={styles.button} onClick={fetchProducts}>検索</button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.sortContainer}>
        <label htmlFor="sort" style={styles.label}>並べ替え:</label>
        <select id="sort" value={sortOption} onChange={handleSortChange} style={styles.select}>
          <option value="price">金額順</option>
          <option value="favoritecount">いいね数順</option>
        </select>
      </div>
      {loading ? (
        <p>データを取得しています...</p>
      ) : (
        <>
          <div style={styles.stats}>
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
    <div style={styles.listContainer}>
      <div style={styles.productList}>
        {products.map((product, index) => (
          <div key={index} style={styles.productItem}>
            <img src={product.img} alt={product.name} style={styles.productImage} />
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.productPrice}>価格: {product.price}</p>
            <p style={styles.productRating}>評価: {product.ratingcount}</p>
            <p style={styles.productReview}>レビュー数: {product.reviewcount}</p>
            <p style={styles.productFavorite}>いいね数: {product.favoritecount}</p>
            <a style={styles.productLink} href={product.url} target="_blank" rel="noopener noreferrer">商品ページへ</a>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    backgroundImage: 'linear-gradient(to right, #6a11cb, #2575fc)',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    color: '#fff',
  },
  title: {
    fontSize: '36px',
    marginBottom: '20px',
  },
  searchContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '18px',
    width: '300px',
    marginRight: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '18px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: '#ff4c4c',
    fontSize: '16px',
    marginTop: '10px',
  },
  sortContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginRight: '10px',
    fontSize: '18px',
  },
  select: {
    padding: '5px',
    fontSize: '18px',
    borderRadius: '5px',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
    fontSize: '18px',
    color: '#eee',
  },
  listContainer: {
    marginTop: '20px',
    textAlign: 'left',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  productItem: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    color: '#333',
  },
  productImage: {
    width: '100%',
    height: 'auto',
    marginBottom: '10px',
    borderRadius: '8px',
  },
  productName: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  productPrice: {
    fontSize: '16px',
    color: '#007bff',
  },
  productRating: {
    fontSize: '16px',
    color: '#28a745',
  },
  productReview: {
    fontSize: '16px',
    color: '#28a745',
  },
  productFavorite: {
    fontSize: '16px',
    color: '#ff6347',
  },
  productLink: {
    marginTop: '10px',
    display: 'inline-block',
    padding: '8px 12px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#28a745',
    borderRadius: '5px',
    textDecoration: 'none',
  }
};

export default App;
