// src/components/SearchBar.jsx
// =============================================
// Tugas 2: Komponen SearchBar untuk filter produk
// =============================================

export default function SearchBar({ value, onChange }) {
  return (
    <div
      style={{
        position: 'relative',
        marginBottom: '1.5rem',
        maxWidth: '480px',
      }}
    >
      {/* Ikon kaca pembesar */}
      <span
        style={{
          position: 'absolute',
          left: '0.9rem',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1rem',
          color: '#999',
          pointerEvents: 'none',
        }}
      >
        🔍
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari produk berdasarkan nama..."
        style={{
          width: '100%',
          padding: '0.65rem 1rem 0.65rem 2.5rem',
          border: '1.5px solid #ccc',
          borderRadius: '25px',
          fontSize: '0.95rem',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#1B4F72')}
        onBlur={(e) => (e.target.style.borderColor = '#ccc')}
      />

      {/* Tombol clear jika ada teks */}
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#999',
            fontSize: '1.1rem',
            lineHeight: 1,
            padding: 0,
          }}
          title="Hapus pencarian"
        >
          ×
        </button>
      )}
    </div>
  );
}
