// src/pages/Cart.jsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import dayjs from 'dayjs';
import { z } from 'zod';

const CheckoutSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  alamat: z.string().min(10, 'Alamat minimal 10 karakter'),
  telepon: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .regex(/^[0-9]+$/, 'Nomor telepon hanya boleh angka'),
});

const styles = `
  .checkout-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
  }
  .checkout-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    width: 100%;
    max-width: 480px;
    margin: 1rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  }
  .checkout-title {
    margin: 0 0 0.25rem;
    font-size: 1.2rem;
    color: #1B4F72;
    font-weight: 600;
  }
  .checkout-subtitle {
    margin: 0 0 1.5rem;
    font-size: 0.85rem;
    color: #999;
  }
  .field-group {
    margin-bottom: 1.1rem;
  }
  .field-label {
    display: block;
    margin-bottom: 0.4rem;
    font-size: 0.82rem;
    font-weight: 600;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .field-input {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border-radius: 8px;
    font-size: 0.95rem;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: inherit;
  }
  .field-input:focus {
    border-color: #1B4F72 !important;
    box-shadow: 0 0 0 3px rgba(27,79,114,0.1);
  }
  .field-input.error {
    border: 1.5px solid #e74c3c;
  }
  .field-input.normal {
    border: 1.5px solid #ddd;
  }
  .error-msg {
    color: #e74c3c !important;
    font-size: 0.8rem !important;
    margin-top: 0.3rem !important;
    display: block !important;
    font-weight: 500 !important;
  }
  .btn-row {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  .btn-cancel {
    flex: 1; padding: 0.8rem;
    background: #f5f5f5; color: #666;
    border: none; border-radius: 8px;
    font-size: 0.95rem; cursor: pointer;
    font-family: inherit;
    transition: background 0.2s;
  }
  .btn-cancel:hover { background: #ebebeb; }
  .btn-confirm {
    flex: 2; padding: 0.8rem;
    background: #1B4F72; color: white;
    border: none; border-radius: 8px;
    font-size: 0.95rem; cursor: pointer;
    font-family: inherit;
    font-weight: 600;
    letter-spacing: 0.02em;
    transition: background 0.2s;
  }
  .btn-confirm:hover { background: #154060; }
  .success-wrapper {
    text-align: center;
    padding: 3rem 1.5rem;
    max-width: 480px;
    margin: 0 auto;
  }
  .success-icon {
    width: 64px; height: 64px;
    background: #e8f8f0;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.25rem;
  }
  .success-icon svg { width: 32px; height: 32px; }
  .success-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1B4F72;
    margin: 0 0 0.5rem;
  }
  .success-desc {
    color: #888;
    font-size: 0.9rem;
    margin: 0 0 1.5rem;
  }
  .success-card {
    background: #f8fbfe;
    border: 1px solid #d0e8f5;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    text-align: left;
    margin-bottom: 1.5rem;
  }
  .success-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.4rem 0;
    border-bottom: 1px solid #e8f0f7;
    font-size: 0.9rem;
    gap: 1rem;
  }
  .success-row:last-child { border-bottom: none; }
  .success-row-label { color: #888; min-width: 80px; }
  .success-row-value { color: #1B4F72; font-weight: 500; text-align: right; }
  .success-time {
    font-size: 0.8rem;
    color: #aaa;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #e8f0f7;
  }
  .btn-back {
    padding: 0.8rem 2.5rem;
    background: #1B4F72; color: white;
    border: none; border-radius: 8px;
    font-size: 0.95rem; cursor: pointer;
    font-weight: 600; font-family: inherit;
    transition: background 0.2s;
  }
  .btn-back:hover { background: #154060; }
`;

export default function Cart() {
  const { items, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderTime, setOrderTime] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [form, setForm] = useState({ nama: '', alamat: '', telepon: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleCheckout = () => {
    const result = CheckoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((e) => {
        fieldErrors[e.path[0]] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }
    const now = dayjs().format('DD MMMM YYYY, HH:mm');
    setOrderTime(now);
    setOrderTotal(totalPrice);
    setOrderSuccess(true);
    clearCart();
  };

  if (orderSuccess) {
    return (
      <>
        <style>{styles}</style>
        <div className="success-wrapper">
          <div className="success-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#27AE60" opacity="0.15"/>
              <path d="M9 16.5L13.5 21L23 11" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="success-title">Pesanan Diterima!</h2>
          <p className="success-desc">Terima kasih, pesananmu sedang kami proses.</p>
          <div className="success-card">
            <div className="success-row">
              <span className="success-row-label">Nama</span>
              <span className="success-row-value">{form.nama}</span>
            </div>
            <div className="success-row">
              <span className="success-row-label">Alamat</span>
              <span className="success-row-value">{form.alamat}</span>
            </div>
            <div className="success-row">
              <span className="success-row-label">Telepon</span>
              <span className="success-row-value">{form.telepon}</span>
            </div>
            <div className="success-row" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1.5px solid #d0e8f5' }}>
              <span className="success-row-label" style={{ fontWeight: '600', color: '#1B4F72' }}>Total Bayar</span>
              <span className="success-row-value" style={{ fontSize: '1.1rem', color: '#E67E22', fontWeight: '700' }}>${orderTotal.toFixed(2)}</span>
            </div>
            <div className="success-time">Waktu Order: {orderTime}</div>
          </div>
          <button className="btn-back"
            onClick={() => { setOrderSuccess(false); setForm({ nama: '', alamat: '', telepon: '' }); }}>
            Kembali ke Toko
          </button>
        </div>
      </>
    );
  }

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
    <>
      <style>{styles}</style>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Keranjang Belanja</h2>

        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid #eee', flexWrap: 'wrap' }}>
            <img src={item.image} alt={item.title} style={{ width: '65px', height: '65px', objectFit: 'contain', borderRadius: '6px' }} />
            <div style={{ flex: 1, minWidth: '140px' }}>
              <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>{item.title}</h4>
              <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>${item.price.toFixed(2)} / pcs</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f5f5f5', borderRadius: '8px', padding: '0.2rem 0.4rem' }}>
              <button onClick={() => updateQuantity(item.id, -1)}
                style={{ width: '30px', height: '30px', background: item.quantity === 1 ? '#ffc7c7' : '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1.1rem', cursor: 'pointer' }}>−</button>
              <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, +1)}
                style={{ width: '30px', height: '30px', background: '#27AE60', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1.1rem', cursor: 'pointer' }}>+</button>
            </div>
            <p style={{ fontWeight: 'bold', minWidth: '70px', textAlign: 'right', margin: 0 }}>${(item.price * item.quantity).toFixed(2)}</p>
            <button onClick={() => removeItem(item.id)}
              style={{ background: 'none', border: '1px solid #e74c3c', color: '#e74c3c', padding: '0.4rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Hapus
            </button>
          </div>
        ))}

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.25rem' }}>Total item: {items.reduce((s, i) => s + i.quantity, 0)} pcs</p>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.4rem' }}>Total: <span style={{ color: '#E67E22' }}>${totalPrice.toFixed(2)}</span></h3>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button onClick={clearCart}
              style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' }}>
              Kosongkan
            </button>
            <button onClick={() => setShowForm(true)}
              style={{ padding: '0.75rem 2rem', background: '#1B4F72', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: '600' }}>
              Checkout
            </button>
          </div>
        </div>

        {showForm && (
          <div className="checkout-overlay">
            <div className="checkout-card">
              <h3 className="checkout-title">Informasi Pengiriman</h3>
              <p className="checkout-subtitle">Lengkapi data di bawah untuk menyelesaikan pesanan</p>

              <div className="field-group">
                <label className="field-label">Nama Lengkap</label>
                <input
                  name="nama" value={form.nama} onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className={`field-input ${errors.nama ? 'error' : 'normal'}`}
                />
                {errors.nama && <span className="error-msg">{errors.nama}</span>}
              </div>

              <div className="field-group">
                <label className="field-label">Alamat Pengiriman</label>
                <textarea
                  name="alamat" value={form.alamat} onChange={handleChange}
                  placeholder="Masukkan alamat lengkap" rows={3}
                  className={`field-input ${errors.alamat ? 'error' : 'normal'}`}
                  style={{ resize: 'vertical' }}
                />
                {errors.alamat && <span className="error-msg">{errors.alamat}</span>}
              </div>

              <div className="field-group">
                <label className="field-label">Nomor Telepon</label>
                <input
                  name="telepon" value={form.telepon} onChange={handleChange}
                  placeholder="Contoh: 08123456789"
                  className={`field-input ${errors.telepon ? 'error' : 'normal'}`}
                />
                {errors.telepon && <span className="error-msg">{errors.telepon}</span>}
              </div>

              <div className="btn-row">
                <button className="btn-cancel" onClick={() => { setShowForm(false); setErrors({}); }}>Batal</button>
                <button className="btn-confirm" onClick={handleCheckout}>Konfirmasi Pesanan</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
