// src/pages/Cart.jsx
// =============================================
// Update: Tambah tombol + dan - untuk update quantity (Tugas 3)
// =============================================
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, totalPrice, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ fontSize: '3rem', margin: 0 }}>🛒</p>
        <h2>Keranjang Kosong</h2>
        <p style={{ color: '#666' }}>Belum ada produk di keranjang Anda.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Keranjang Belanja</h2>

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            borderBottom: '1px solid #eee',
            flexWrap: 'wrap',
          }}
        >
          {/* Gambar produk */}
          <img
            src={item.image}
            alt={item.title}
            style={{ width: '65px', height: '65px', objectFit: 'contain', borderRadius: '6px' }}
          />

          {/* Info produk */}
          <div style={{ flex: 1, minWidth: '140px' }}>
            <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>{item.title}</h4>
            <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>
              ${item.price.toFixed(2)} / pcs
            </p>
          </div>

          {/* ===== Tugas 3: Kontrol Quantity ===== */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f5f5f5',
              borderRadius: '8px',
              padding: '0.2rem 0.4rem',
            }}
          >
            {/* Tombol kurang (-) */}
            <button
              onClick={() => updateQuantity(item.id, -1)}
              title="Kurangi"
              style={{
                width: '30px',
                height: '30px',
                background: item.quantity === 1 ? '#ffc7c7' : '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              −
            </button>

            {/* Jumlah */}
            <span
              style={{
                minWidth: '28px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              {item.quantity}
            </span>

            {/* Tombol tambah (+) */}
            <button
              onClick={() => updateQuantity(item.id, +1)}
              title="Tambah"
              style={{
                width: '30px',
                height: '30px',
                background: '#27AE60',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <p style={{ fontWeight: 'bold', minWidth: '70px', textAlign: 'right', margin: 0 }}>
            ${(item.price * item.quantity).toFixed(2)}
          </p>

          {/* Tombol hapus */}
          <button
            onClick={() => removeItem(item.id)}
            title="Hapus item"
            style={{
              background: 'none',
              border: '1px solid #e74c3c',
              color: '#e74c3c',
              padding: '0.4rem 0.7rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Hapus
          </button>
        </div>
      ))}

      {/* Summary & Checkout */}
      <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
        <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.25rem' }}>
          Total item: {items.reduce((s, i) => s + i.quantity, 0)} pcs
        </p>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.4rem' }}>
          Total: <span style={{ color: '#E67E22' }}>${totalPrice.toFixed(2)}</span>
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            onClick={clearCart}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              color: '#e74c3c',
              border: '1px solid #e74c3c',
              borderRadius: '6px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Kosongkan Keranjang
          </button>
          <button
            onClick={() => alert('Checkout berhasil! Terima kasih 🎉')}
            style={{
              padding: '0.75rem 2rem',
              background: '#27AE60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
