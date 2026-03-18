// src/App.jsx
// =============================================
// Update: Tambah route /product/:id untuk ProductDetail (Tugas 1)
// =============================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail'; // << Tugas 1

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/product/:id' element={<ProductDetail />} /> {/* << Tugas 1 */}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
