// src/pages/Home.jsx
// =============================================
// Update: Tambah SearchBar untuk filter produk by nama (Tugas 2)
// =============================================
import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import SearchBar from '../components/SearchBar'; // << Tugas 2: import SearchBar

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // << Tugas 2: state pencarian
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter berdasarkan kategori DAN nama produk (Tugas 2)
  const filteredProducts = products
    .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <Loading />;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Katalog Produk</h2>

      {/* ===== Tugas 2: SearchBar ===== */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Filter Kategori */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '0.5rem 1rem',
            background: selectedCategory === 'all' ? '#1B4F72' : '#EBF5FB',
            color: selectedCategory === 'all' ? 'white' : '#1B4F72',
            border: 'none', borderRadius: '20px', cursor: 'pointer',
          }}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedCategory === cat ? '#1B4F72' : '#EBF5FB',
              color: selectedCategory === cat ? 'white' : '#1B4F72',
              border: 'none', borderRadius: '20px', cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Info jumlah hasil */}
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Menampilkan {filteredProducts.length} produk
        {searchQuery && ` untuk pencarian "${searchQuery}"`}
      </p>

      {/* Pesan jika tidak ada hasil */}
      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p style={{ fontSize: '1.2rem' }}>😕 Produk tidak ditemukan</p>
          <p>Coba kata kunci atau kategori yang berbeda.</p>
        </div>
      )}

      {/* Grid Produk */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
