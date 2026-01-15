import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">🍽️</span>
            <span className="brand-name">OrderFlow</span>
          </div>
          <div className="nav-links">
            <a href="#como-funciona" className="nav-link">Cómo funciona</a>
            <a href="#beneficios" className="nav-link">Beneficios</a>
            <Link to="/demo" className="nav-link nav-cta">
              Probar Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Digitalizá la gestión de pedidos de tu restaurante
            </h1>
            <p className="hero-subtitle">
              Menú digital con QR, gestión de delivery, cocina y caja integrados
              en una sola plataforma. Sin comisiones, sin intermediarios.
            </p>
            <div className="hero-ctas">
              <Link to="/demo" className="btn-primary">
                Probar Demo Gratis
              </Link>
              <a href="#como-funciona" className="btn-secondary">
                Ver cómo funciona
              </a>
            </div>
            <div className="hero-trust">
              <span className="trust-check">✓</span>
              <span>Sin tarjeta de crédito</span>
              <span className="trust-separator">•</span>
              <span className="trust-check">✓</span>
              <span>Setup en minutos</span>
              <span className="trust-separator">•</span>
              <span className="trust-check">✓</span>
              <span>Soporte incluido</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-mockup">
              <div className="mockup-screen">
                <div className="mockup-header">
                  <span className="mockup-dot"></span>
                  <span className="mockup-dot"></span>
                  <span className="mockup-dot"></span>
                </div>
                <div className="mockup-content">
                  <div className="mockup-order">
                    <span className="order-badge new">Nuevo</span>
                    <span className="order-info">Mesa 3 - $4,500</span>
                  </div>
                  <div className="mockup-order">
                    <span className="order-badge cooking">Preparando</span>
                    <span className="order-info">Delivery - $2,800</span>
                  </div>
                  <div className="mockup-order">
                    <span className="order-badge ready">Listo</span>
                    <span className="order-info">Mesa 7 - $6,200</span>
                  </div>
                </div>
              </div>
              <div className="mockup-qr">
                <div className="qr-placeholder">QR</div>
                <span>Escanear menú</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="how-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Simple y efectivo</span>
            <h2 className="section-title">¿Cómo funciona?</h2>
            <p className="section-subtitle">
              Un flujo de trabajo diseñado para optimizar cada pedido
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">📱</div>
              <h3>Cliente escanea QR</h3>
              <p>
                Cada mesa tiene su código QR. El cliente accede al menú digital
                desde su celular, sin descargar nada.
              </p>
            </div>

            <div className="step-connector">
              <div className="connector-line"></div>
              <div className="connector-arrow">→</div>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">🧾</div>
              <h3>Pedido llega a Caja</h3>
              <p>
                El staff recibe el pedido en tiempo real, puede aprobarlo,
                modificarlo o agregarlo manualmente.
              </p>
            </div>

            <div className="step-connector">
              <div className="connector-line"></div>
              <div className="connector-arrow">→</div>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">👨‍🍳</div>
              <h3>Cocina prepara</h3>
              <p>
                La cocina ve los pedidos aprobados en su pantalla Kanban,
                actualiza estados y marca cuando están listos.
              </p>
            </div>

            <div className="step-connector">
              <div className="connector-line"></div>
              <div className="connector-arrow">→</div>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">✅</div>
              <h3>Entrega y cierre</h3>
              <p>
                El pedido se entrega en mesa o por delivery. Todo queda
                registrado para tu control.
              </p>
            </div>
          </div>

          <div className="channels-highlight">
            <div className="channel-card">
              <span className="channel-icon">🪑</span>
              <div className="channel-info">
                <h4>Pedidos en Mesa</h4>
                <p>QR por mesa, aprobación manual</p>
              </div>
            </div>
            <div className="channel-plus">+</div>
            <div className="channel-card">
              <span className="channel-icon">🛵</span>
              <div className="channel-info">
                <h4>Delivery</h4>
                <p>Menú online, aprobación automática</p>
              </div>
            </div>
            <div className="channel-equals">=</div>
            <div className="channel-card highlight">
              <span className="channel-icon">🎯</span>
              <div className="channel-info">
                <h4>Todo integrado</h4>
                <p>Una sola plataforma</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Who Section */}
      <section className="audience-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Para todos los rubros</span>
            <h2 className="section-title">¿Para quién es OrderFlow?</h2>
            <p className="section-subtitle">
              Diseñado para negocios gastronómicos de todos los tamaños
            </p>
          </div>

          <div className="audience-grid">
            <div className="audience-card">
              <div className="audience-emoji">🍝</div>
              <h3>Restaurantes</h3>
              <p>Gestión completa de mesas, carta digital y control de cocina</p>
              <ul className="audience-features">
                <li>QR por mesa</li>
                <li>Carta actualizable</li>
                <li>Historial de pedidos</li>
              </ul>
            </div>

            <div className="audience-card">
              <div className="audience-emoji">🍺</div>
              <h3>Bares</h3>
              <p>Agilizá el servicio en barras y mesas con pedidos digitales</p>
              <ul className="audience-features">
                <li>Pedidos rápidos</li>
                <li>Múltiples barras</li>
                <li>Happy hour fácil</li>
              </ul>
            </div>

            <div className="audience-card">
              <div className="audience-emoji">🍔</div>
              <h3>Hamburgueserías</h3>
              <p>Optimizá el flujo de pedidos take-away y delivery</p>
              <ul className="audience-features">
                <li>Mostrador + delivery</li>
                <li>Combos y extras</li>
                <li>Tiempos estimados</li>
              </ul>
            </div>

            <div className="audience-card">
              <div className="audience-emoji">🍕</div>
              <h3>Pizzerías</h3>
              <p>Controlá el horno y los despachos sin complicaciones</p>
              <ul className="audience-features">
                <li>Cola de horno</li>
                <li>Delivery integrado</li>
                <li>Variantes simples</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="benefits-section">
        <div className="section-container">
          <div className="section-header light">
            <span className="section-tag">Resultados reales</span>
            <h2 className="section-title">Beneficios para tu negocio</h2>
            <p className="section-subtitle">
              Lo que OrderFlow puede hacer por tu restaurante
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <span>🎯</span>
              </div>
              <div className="benefit-content">
                <h3>Menos errores</h3>
                <p>
                  Los pedidos llegan escritos directo del cliente. Chau a los
                  malentendidos y comandas ilegibles.
                </p>
              </div>
              <div className="benefit-stat">
                <span className="stat-number">-80%</span>
                <span className="stat-label">errores de pedido</span>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <span>⚡</span>
              </div>
              <div className="benefit-content">
                <h3>Más velocidad</h3>
                <p>
                  Pedido directo a cocina sin intermediarios. Menos espera
                  para el cliente, más rotación de mesas.
                </p>
              </div>
              <div className="benefit-stat">
                <span className="stat-number">+40%</span>
                <span className="stat-label">velocidad de servicio</span>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <span>😊</span>
              </div>
              <div className="benefit-content">
                <h3>Mejor experiencia</h3>
                <p>
                  Clientes piden cuando quieren, ven fotos del menú y no
                  esperan al mozo para ordenar.
                </p>
              </div>
              <div className="benefit-stat">
                <span className="stat-number">+60%</span>
                <span className="stat-label">satisfacción cliente</span>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <span>💰</span>
              </div>
              <div className="benefit-content">
                <h3>Sin comisiones</h3>
                <p>
                  A diferencia de las apps de delivery, OrderFlow no cobra
                  porcentaje por pedido. El margen es tuyo.
                </p>
              </div>
              <div className="benefit-stat">
                <span className="stat-number">0%</span>
                <span className="stat-label">comisión por venta</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2>Probá OrderFlow ahora</h2>
            <p>
              Explorá el demo interactivo y descubrí cómo OrderFlow puede
              transformar la operación de tu restaurante.
            </p>
            <Link to="/demo" className="btn-primary btn-large">
              Acceder al Demo
            </Link>
            <span className="cta-hint">
              Sin registro • Acceso inmediato • 3 restaurantes de ejemplo
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="brand-icon">🍽️</span>
            <span className="brand-name">OrderFlow</span>
          </div>
          <p className="footer-tagline">
            Plataforma de gestión de pedidos para restaurantes
          </p>
          <div className="footer-links">
            <Link to="/demo">Demo</Link>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#beneficios">Beneficios</a>
          </div>
          <p className="footer-copy">
            © 2024 OrderFlow. MVP Demo - Proyecto de demostración.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
