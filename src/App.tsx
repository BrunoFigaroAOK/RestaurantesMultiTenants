import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrdersProvider, CartProvider } from './contexts';
import { Home, MenuPage, CashierPage, KitchenPage } from './pages';
import './App.css';

function App() {
  return (
    <OrdersProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Home - Selección de restaurante */}
            <Route path="/" element={<Home />} />

            {/* Menú Delivery (sin mesa) */}
            <Route path="/:restaurantId/menu" element={<MenuPage />} />

            {/* Menú por Mesa (QR) */}
            <Route path="/:restaurantId/mesa/:tableNumber" element={<MenuPage />} />

            {/* Vista Caja */}
            <Route path="/:restaurantId/caja" element={<CashierPage />} />

            {/* Vista Cocina */}
            <Route path="/:restaurantId/cocina" element={<KitchenPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </OrdersProvider>
  );
}

export default App;
