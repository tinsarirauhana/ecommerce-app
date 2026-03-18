// src/pages/ProductDetail.jsx
// =============================================
// Tugas 1: Halaman detail produk berdasarkan ID
// Menggunakan useParams dari react-router-dom
// =============================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';

export default function ProductDetail() {
  const { id } = useParams(); // Ambil ID dari URL (misal: /product/3)
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    // Reset tombol setelah 2 detik
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loading />;
  if (error) return <p style={{ color: 'red', padding: '2rem' }}>Error: {error}</p>;
  if (!product) return <p style={{ padding: '2rem' }}>Produk tidak ditemukan.</p>;

  // Fungsi untuk render bintang rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < fullStars ? '#F39C12' : '#ccc', fontSize: '1.2rem' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '1.5rem',
          padding: '0.5rem 1.2rem',
          background: 'none',
          border: '1px solid #1B4F72',
          color: '#1B4F72',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        ← Kembali
      </button>

      <div
        style={{
          display: 'flex',
          gap: '2.5rem',
          flexWrap: 'wrap',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          padding: '2rem',
        }}
      >
        {/* Gambar Produk */}
        <div
          style={{
            flex: '0 0 280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9f9f9',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{ width: '100%', maxHeight: '280px', objectFit: 'contain' }}
          />
        </div>

        {/* Info Produk */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          {/* Badge Kategori */}
          <span
            style={{
              display: 'inline-block',
              background: '#EBF5FB',
              color: '#1B4F72',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              textTransform: 'capitalize',
              marginBottom: '0.75rem',
            }}
          >
            {product.category}
          </span>

          {/* Judul */}
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.4rem', color: '#1a1a1a', lineHeight: 1.4 }}>
            {product.title}
          </h2>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div>{renderStars(product.rating?.rate)}</div>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              {product.rating?.rate} ({product.rating?.count} ulasan)
            </span>
          </div>

          {/* Harga */}
          <p
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#E67E22',
              margin: '0 0 1.25rem',
            }}
          >
            ${product.price.toFixed(2)}
          </p>

          {/* Deskripsi */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#444' }}>Deskripsi Produk</h4>
            <p style={{ color: '#555', lineHeight: 1.7, margin: 0 }}>{product.description}</p>
          </div>

          {/* Tombol Aksi */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                padding: '0.85rem 1.5rem',
                background: added ? '#27AE60' : '#1B4F72',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
            >
              {added ? '✓ Ditambahkan!' : '+ Tambah ke Keranjang'}
            </button>
            <button
              onClick={() => navigate('/cart')}
              style={{
                flex: 1,
                padding: '0.85rem 1.5rem',
                background: 'white',
                color: '#1B4F72',
                border: '2px solid #1B4F72',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Lihat Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
