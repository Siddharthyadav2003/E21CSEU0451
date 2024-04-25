import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let retries = 3;
      while (retries > 0) {
        try {
          const response = await axios.get('http://20.244.56.144/test/companies/AMZ/categories/Laptop/products?top=10&minPrice=1&maxPrice=10000');
          setProducts(response.data);
          setLoading(false);
          return; 
        } catch (error) {
          console.error('Failed to fetch products:', error.response);
          retries--;
          if (retries === 0) {
            setError('Failed to fetch products. Please try again later.');
            setLoading(false);
          }
        }
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <h1>Top Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.productId}>
            <p>Name: {product.productName}</p>
            <p>Price: {product.price}</p>
            <p>Rating: {product.rating}</p>
            <p>Discount: {product.discount}</p>
            <p>Availability: {product.availability}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
