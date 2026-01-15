# RestaurantApp - Plataforma Multi-Restaurant

Plataforma web para gestión de pedidos gastronómicos multi-tenant. Cada restaurante funciona de forma independiente con su propio menú, mesas y sistema de pedidos.

## Características

### Canales de Pedido

1. **Pedido por Mesa (QR)**
   - El cliente escanea un QR que identifica restaurante y mesa
   - Accede al menú del restaurante
   - Selecciona productos y cantidades
   - Ingresa su nombre
   - El pedido queda en estado `CREADO` (pendiente de aprobación)

2. **Pedido por Delivery**
   - El cliente accede al menú sin QR
   - Completa nombre, teléfono y dirección
   - El pedido entra directamente en estado `APROBADO`

### Vistas del Sistema

- **Vista Cliente (Menú)**: Interfaz para que los clientes realicen pedidos
- **Vista Caja**: Aprobar/rechazar pedidos de mesa, cargar pedidos manuales
- **Vista Cocina**: Gestionar estados de preparación con vista Kanban

### Estados del Pedido

```
CREADO → APROBADO → PREPARANDO → LISTO → ENTREGADO
```

## Tech Stack

- **React 19** + TypeScript
- **Vite** para build/dev server
- **React Router** para navegación
- **Context API** para estado global
- CSS con diseño responsive

## Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build
```

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── ui/          # Button, Card, Badge, Input
│   ├── menu/        # MenuItemCard, CategorySection, Cart
│   └── orders/      # OrderCard
├── contexts/        # OrdersContext, CartContext
├── data/            # Mock data (restaurantes, menús, mesas)
├── pages/           # Páginas principales
│   ├── customer/    # MenuPage (delivery y mesa)
│   ├── cashier/     # CashierPage
│   └── kitchen/     # KitchenPage
├── types/           # Tipos TypeScript
└── utils/           # Utilidades (formateo, etc.)
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home - Selección de restaurante |
| `/:restaurantId/menu` | Menú para delivery |
| `/:restaurantId/mesa/:tableNumber` | Menú por mesa (QR) |
| `/:restaurantId/caja` | Vista de caja |
| `/:restaurantId/cocina` | Vista de cocina |

## Datos de Demo

La aplicación incluye datos mock de 3 restaurantes:
- **La Parrilla de Juan** - Parrilla argentina
- **Sushi Master** - Cocina japonesa
- **Pizzería Napoli** - Pizzería italiana

## Próximos Pasos (Escalabilidad)

- Integración con backend real (API REST/GraphQL)
- Autenticación de usuarios
- Notificaciones en tiempo real (WebSockets)
- Sistema de pagos
- Panel de administración
- Reportes y analytics
