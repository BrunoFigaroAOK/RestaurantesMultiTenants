import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrdersProvider, CartProvider, RestaurantProvider } from './contexts';
import { Home, LandingPage, MenuPage, CashierPage, KitchenPage } from './pages';
import './App.css';

function App() {
  return (
    <RestaurantProvider>
      <OrdersProvider>
        <CartProvider>
          <BrowserRouter>
          <Routes>
            {/* Landing - Página comercial pública */}
            <Route path="/" element={<LandingPage />} />

            {/* Demo - Selección de restaurante */}
            <Route path="/demo" element={<Home />} />

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
    </RestaurantProvider>
  );
}

export default App;
