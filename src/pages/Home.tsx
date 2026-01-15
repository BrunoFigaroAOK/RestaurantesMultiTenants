import React from 'react';
import { Link } from 'react-router-dom';
import { restaurants } from '../data/mockData';
import { Card, Badge } from '../components/ui';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>RestaurantApp</h1>
        <p>Plataforma Multi-Restaurant para Gestión de Pedidos</p>
      </header>

      <section className="home-section">
        <h2>Restaurantes</h2>
        <div className="restaurant-grid">
          {restaurants.map(restaurant => (
            <Card key={restaurant.id} className="restaurant-card" variant="elevated">
              <div className="restaurant-info">
                <div className="restaurant-header">
                  <h3>{restaurant.name}</h3>
                  <Badge variant={restaurant.isOpen ? 'success' : 'danger'}>
                    {restaurant.isOpen ? 'Abierto' : 'Cerrado'}
                  </Badge>
                </div>
                <p className="restaurant-address">{restaurant.address}</p>
                <p className="restaurant-phone">{restaurant.phone}</p>
              </div>

              <div className="restaurant-links">
                <h4>Accesos</h4>
                <div className="link-group">
                  <span className="link-label">Cliente:</span>
                  <Link to={`/${restaurant.id}/menu`} className="link-item">
                    Menú Delivery
                  </Link>
                  <Link to={`/${restaurant.id}/mesa/1`} className="link-item">
                    Mesa 1 (QR)
                  </Link>
                </div>
                <div className="link-group">
                  <span className="link-label">Staff:</span>
                  <Link to={`/${restaurant.id}/caja`} className="link-item link-staff">
                    Caja
                  </Link>
                  <Link to={`/${restaurant.id}/cocina`} className="link-item link-staff">
                    Cocina
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="home-section demo-section">
        <h2>Demo MVP</h2>
        <Card variant="outlined">
          <p>
            Esta es una demostración del flujo completo de pedidos para un sistema
            multi-restaurant. Incluye:
          </p>
          <ul>
            <li><strong>Pedido por Mesa (QR):</strong> El cliente accede al menú escaneando un QR. El pedido queda pendiente de aprobación.</li>
            <li><strong>Pedido Delivery:</strong> El cliente completa sus datos y el pedido se aprueba automáticamente.</li>
            <li><strong>Vista Caja:</strong> Aprobar/rechazar pedidos de mesa, cargar pedidos manuales.</li>
            <li><strong>Vista Cocina:</strong> Gestionar estados de preparación de pedidos.</li>
          </ul>
        </Card>
      </section>
    </div>
  );
};

export default Home;
