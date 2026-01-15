import type { Restaurant, Table, MenuCategory, MenuItem, Order } from '../types';

// ==========================================
// RESTAURANTES
// ==========================================

export const restaurants: Restaurant[] = [
  {
    id: 'rest-001',
    name: 'La Parrilla de Juan',
    slug: 'la-parrilla-de-juan',
    address: 'Av. Corrientes 1234, CABA',
    phone: '+54 11 4555-1234',
    isOpen: true,
  },
  {
    id: 'rest-002',
    name: 'Sushi Master',
    slug: 'sushi-master',
    address: 'Av. Santa Fe 2345, CABA',
    phone: '+54 11 4666-5678',
    isOpen: true,
  },
  {
    id: 'rest-003',
    name: 'Pizzería Napoli',
    slug: 'pizzeria-napoli',
    address: 'Av. Cabildo 789, CABA',
    phone: '+54 11 4777-9012',
    isOpen: false,
  },
];

// ==========================================
// MESAS
// ==========================================

export const tables: Table[] = [
  // La Parrilla de Juan
  { id: 'table-001', restaurantId: 'rest-001', number: 1, qrCode: '/rest-001/mesa/1', capacity: 4, isOccupied: false },
  { id: 'table-002', restaurantId: 'rest-001', number: 2, qrCode: '/rest-001/mesa/2', capacity: 4, isOccupied: true },
  { id: 'table-003', restaurantId: 'rest-001', number: 3, qrCode: '/rest-001/mesa/3', capacity: 2, isOccupied: false },
  { id: 'table-004', restaurantId: 'rest-001', number: 4, qrCode: '/rest-001/mesa/4', capacity: 6, isOccupied: false },
  { id: 'table-005', restaurantId: 'rest-001', number: 5, qrCode: '/rest-001/mesa/5', capacity: 8, isOccupied: false },

  // Sushi Master
  { id: 'table-006', restaurantId: 'rest-002', number: 1, qrCode: '/rest-002/mesa/1', capacity: 2, isOccupied: false },
  { id: 'table-007', restaurantId: 'rest-002', number: 2, qrCode: '/rest-002/mesa/2', capacity: 4, isOccupied: false },
  { id: 'table-008', restaurantId: 'rest-002', number: 3, qrCode: '/rest-002/mesa/3', capacity: 4, isOccupied: false },

  // Pizzería Napoli
  { id: 'table-009', restaurantId: 'rest-003', number: 1, qrCode: '/rest-003/mesa/1', capacity: 4, isOccupied: false },
  { id: 'table-010', restaurantId: 'rest-003', number: 2, qrCode: '/rest-003/mesa/2', capacity: 6, isOccupied: false },
];

// ==========================================
// CATEGORÍAS DE MENÚ
// ==========================================

export const menuCategories: MenuCategory[] = [
  // La Parrilla de Juan
  { id: 'cat-001', restaurantId: 'rest-001', name: 'Entradas', order: 1 },
  { id: 'cat-002', restaurantId: 'rest-001', name: 'Parrilla', order: 2 },
  { id: 'cat-003', restaurantId: 'rest-001', name: 'Guarniciones', order: 3 },
  { id: 'cat-004', restaurantId: 'rest-001', name: 'Bebidas', order: 4 },
  { id: 'cat-005', restaurantId: 'rest-001', name: 'Postres', order: 5 },

  // Sushi Master
  { id: 'cat-006', restaurantId: 'rest-002', name: 'Rolls Clásicos', order: 1 },
  { id: 'cat-007', restaurantId: 'rest-002', name: 'Rolls Premium', order: 2 },
  { id: 'cat-008', restaurantId: 'rest-002', name: 'Niguiris', order: 3 },
  { id: 'cat-009', restaurantId: 'rest-002', name: 'Bebidas', order: 4 },

  // Pizzería Napoli
  { id: 'cat-010', restaurantId: 'rest-003', name: 'Pizzas Clásicas', order: 1 },
  { id: 'cat-011', restaurantId: 'rest-003', name: 'Pizzas Especiales', order: 2 },
  { id: 'cat-012', restaurantId: 'rest-003', name: 'Empanadas', order: 3 },
  { id: 'cat-013', restaurantId: 'rest-003', name: 'Bebidas', order: 4 },
];

// ==========================================
// ITEMS DEL MENÚ
// ==========================================

export const menuItems: MenuItem[] = [
  // La Parrilla de Juan - Entradas
  { id: 'item-001', restaurantId: 'rest-001', categoryId: 'cat-001', name: 'Provoleta', description: 'Provolone a la parrilla con orégano', price: 4500, isAvailable: true, preparationTime: 10 },
  { id: 'item-002', restaurantId: 'rest-001', categoryId: 'cat-001', name: 'Empanadas (x3)', description: 'Carne cortada a cuchillo', price: 3500, isAvailable: true, preparationTime: 8 },
  { id: 'item-003', restaurantId: 'rest-001', categoryId: 'cat-001', name: 'Tabla de achuras', description: 'Chorizo, morcilla, chinchu y mollejas', price: 8500, isAvailable: true, preparationTime: 15 },

  // La Parrilla de Juan - Parrilla
  { id: 'item-004', restaurantId: 'rest-001', categoryId: 'cat-002', name: 'Bife de chorizo', description: '400g de corte premium', price: 12500, isAvailable: true, preparationTime: 25 },
  { id: 'item-005', restaurantId: 'rest-001', categoryId: 'cat-002', name: 'Ojo de bife', description: '350g con hueso', price: 14000, isAvailable: true, preparationTime: 25 },
  { id: 'item-006', restaurantId: 'rest-001', categoryId: 'cat-002', name: 'Entraña', description: '300g corte jugoso', price: 11000, isAvailable: true, preparationTime: 20 },
  { id: 'item-007', restaurantId: 'rest-001', categoryId: 'cat-002', name: 'Vacío', description: '400g con cuero crocante', price: 10500, isAvailable: false, preparationTime: 30 },
  { id: 'item-008', restaurantId: 'rest-001', categoryId: 'cat-002', name: 'Parrillada para 2', description: 'Asado, vacío, chorizo, morcilla y achuras', price: 22000, isAvailable: true, preparationTime: 35 },

  // La Parrilla de Juan - Guarniciones
  { id: 'item-009', restaurantId: 'rest-001', categoryId: 'cat-003', name: 'Papas fritas', description: 'Porción generosa', price: 3000, isAvailable: true, preparationTime: 12 },
  { id: 'item-010', restaurantId: 'rest-001', categoryId: 'cat-003', name: 'Ensalada mixta', description: 'Lechuga, tomate, cebolla', price: 2500, isAvailable: true, preparationTime: 5 },
  { id: 'item-011', restaurantId: 'rest-001', categoryId: 'cat-003', name: 'Puré de papas', description: 'Casero y cremoso', price: 2800, isAvailable: true, preparationTime: 5 },

  // La Parrilla de Juan - Bebidas
  { id: 'item-012', restaurantId: 'rest-001', categoryId: 'cat-004', name: 'Vino Malbec', description: 'Botella 750ml', price: 8500, isAvailable: true, preparationTime: 2 },
  { id: 'item-013', restaurantId: 'rest-001', categoryId: 'cat-004', name: 'Agua mineral', description: '500ml', price: 1200, isAvailable: true, preparationTime: 1 },
  { id: 'item-014', restaurantId: 'rest-001', categoryId: 'cat-004', name: 'Gaseosa', description: 'Línea Coca-Cola 500ml', price: 1500, isAvailable: true, preparationTime: 1 },

  // La Parrilla de Juan - Postres
  { id: 'item-015', restaurantId: 'rest-001', categoryId: 'cat-005', name: 'Flan casero', description: 'Con dulce de leche y crema', price: 3500, isAvailable: true, preparationTime: 5 },
  { id: 'item-016', restaurantId: 'rest-001', categoryId: 'cat-005', name: 'Panqueques', description: 'Con dulce de leche', price: 3800, isAvailable: true, preparationTime: 10 },

  // Sushi Master - Rolls Clásicos
  { id: 'item-017', restaurantId: 'rest-002', categoryId: 'cat-006', name: 'Philadelphia Roll', description: 'Salmón, queso crema, palta (10 piezas)', price: 6500, isAvailable: true, preparationTime: 15 },
  { id: 'item-018', restaurantId: 'rest-002', categoryId: 'cat-006', name: 'California Roll', description: 'Kanikama, palta, pepino (10 piezas)', price: 5500, isAvailable: true, preparationTime: 12 },
  { id: 'item-019', restaurantId: 'rest-002', categoryId: 'cat-006', name: 'Sake Roll', description: 'Salmón y palta (10 piezas)', price: 6000, isAvailable: true, preparationTime: 12 },

  // Sushi Master - Rolls Premium
  { id: 'item-020', restaurantId: 'rest-002', categoryId: 'cat-007', name: 'Dragon Roll', description: 'Langostino, palta, salsa unagi (10 piezas)', price: 9500, isAvailable: true, preparationTime: 18 },
  { id: 'item-021', restaurantId: 'rest-002', categoryId: 'cat-007', name: 'Rainbow Roll', description: 'Mix de pescados sobre California (10 piezas)', price: 10500, isAvailable: true, preparationTime: 20 },
  { id: 'item-022', restaurantId: 'rest-002', categoryId: 'cat-007', name: 'Spicy Tuna Roll', description: 'Atún picante, tempura bits (10 piezas)', price: 8500, isAvailable: false, preparationTime: 15 },

  // Sushi Master - Niguiris
  { id: 'item-023', restaurantId: 'rest-002', categoryId: 'cat-008', name: 'Niguiri Salmón (x2)', description: 'Salmón fresco sobre arroz', price: 3500, isAvailable: true, preparationTime: 8 },
  { id: 'item-024', restaurantId: 'rest-002', categoryId: 'cat-008', name: 'Niguiri Atún (x2)', description: 'Atún rojo sobre arroz', price: 4000, isAvailable: true, preparationTime: 8 },
  { id: 'item-025', restaurantId: 'rest-002', categoryId: 'cat-008', name: 'Niguiri Langostino (x2)', description: 'Langostino cocido sobre arroz', price: 4500, isAvailable: true, preparationTime: 8 },

  // Sushi Master - Bebidas
  { id: 'item-026', restaurantId: 'rest-002', categoryId: 'cat-009', name: 'Té verde', description: 'Té japonés caliente', price: 1800, isAvailable: true, preparationTime: 3 },
  { id: 'item-027', restaurantId: 'rest-002', categoryId: 'cat-009', name: 'Sake', description: 'Sake frío 180ml', price: 4500, isAvailable: true, preparationTime: 2 },
  { id: 'item-028', restaurantId: 'rest-002', categoryId: 'cat-009', name: 'Cerveza Asahi', description: 'Lata 500ml', price: 3500, isAvailable: true, preparationTime: 1 },

  // Pizzería Napoli - Pizzas Clásicas
  { id: 'item-029', restaurantId: 'rest-003', categoryId: 'cat-010', name: 'Muzzarella', description: 'Salsa, muzzarella y orégano', price: 7500, isAvailable: true, preparationTime: 20 },
  { id: 'item-030', restaurantId: 'rest-003', categoryId: 'cat-010', name: 'Napolitana', description: 'Muzzarella, tomate y ajo', price: 8000, isAvailable: true, preparationTime: 20 },
  { id: 'item-031', restaurantId: 'rest-003', categoryId: 'cat-010', name: 'Fugazzeta', description: 'Muzzarella y cebolla', price: 8500, isAvailable: true, preparationTime: 22 },

  // Pizzería Napoli - Pizzas Especiales
  { id: 'item-032', restaurantId: 'rest-003', categoryId: 'cat-011', name: 'Cuatro Quesos', description: 'Muzzarella, roquefort, parmesano, fontina', price: 10500, isAvailable: true, preparationTime: 22 },
  { id: 'item-033', restaurantId: 'rest-003', categoryId: 'cat-011', name: 'Calabresa', description: 'Muzzarella y longaniza calabresa', price: 9500, isAvailable: true, preparationTime: 22 },
  { id: 'item-034', restaurantId: 'rest-003', categoryId: 'cat-011', name: 'Jamón y Morrones', description: 'Muzzarella, jamón y morrones asados', price: 9500, isAvailable: true, preparationTime: 22 },

  // Pizzería Napoli - Empanadas
  { id: 'item-035', restaurantId: 'rest-003', categoryId: 'cat-012', name: 'Empanada Carne', description: 'Carne cortada a cuchillo', price: 1200, isAvailable: true, preparationTime: 10 },
  { id: 'item-036', restaurantId: 'rest-003', categoryId: 'cat-012', name: 'Empanada J&Q', description: 'Jamón y queso', price: 1200, isAvailable: true, preparationTime: 10 },
  { id: 'item-037', restaurantId: 'rest-003', categoryId: 'cat-012', name: 'Empanada Caprese', description: 'Tomate, muzzarella y albahaca', price: 1300, isAvailable: true, preparationTime: 10 },

  // Pizzería Napoli - Bebidas
  { id: 'item-038', restaurantId: 'rest-003', categoryId: 'cat-013', name: 'Cerveza artesanal', description: 'Pinta 500ml', price: 3500, isAvailable: true, preparationTime: 1 },
  { id: 'item-039', restaurantId: 'rest-003', categoryId: 'cat-013', name: 'Gaseosa línea', description: '500ml', price: 1500, isAvailable: true, preparationTime: 1 },
  { id: 'item-040', restaurantId: 'rest-003', categoryId: 'cat-013', name: 'Agua saborizada', description: '500ml', price: 1800, isAvailable: true, preparationTime: 1 },
];

// ==========================================
// PEDIDOS INICIALES (para demo)
// ==========================================

export const initialOrders: Order[] = [
  {
    id: 'order-001',
    restaurantId: 'rest-001',
    type: 'MESA',
    status: 'CREADO',
    customerName: 'Carlos García',
    tableId: 'table-002',
    tableNumber: 2,
    items: [
      {
        id: 'oi-001',
        menuItemId: 'item-004',
        menuItem: menuItems.find(i => i.id === 'item-004')!,
        quantity: 2,
        unitPrice: 12500,
        subtotal: 25000,
      },
      {
        id: 'oi-002',
        menuItemId: 'item-009',
        menuItem: menuItems.find(i => i.id === 'item-009')!,
        quantity: 1,
        unitPrice: 3000,
        subtotal: 3000,
      },
    ],
    total: 28000,
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // hace 5 minutos
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 'order-002',
    restaurantId: 'rest-001',
    type: 'MESA',
    status: 'APROBADO',
    customerName: 'María López',
    tableId: 'table-003',
    tableNumber: 3,
    items: [
      {
        id: 'oi-003',
        menuItemId: 'item-001',
        menuItem: menuItems.find(i => i.id === 'item-001')!,
        quantity: 1,
        unitPrice: 4500,
        subtotal: 4500,
      },
      {
        id: 'oi-004',
        menuItemId: 'item-008',
        menuItem: menuItems.find(i => i.id === 'item-008')!,
        quantity: 1,
        unitPrice: 22000,
        subtotal: 22000,
      },
    ],
    total: 26500,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10),
    approvedAt: new Date(Date.now() - 1000 * 60 * 10),
    estimatedTime: 35,
  },
  {
    id: 'order-003',
    restaurantId: 'rest-001',
    type: 'DELIVERY',
    status: 'PREPARANDO',
    customerName: 'Juan Pérez',
    customerPhone: '+54 11 5555-1234',
    customerAddress: 'Av. Rivadavia 1234, Piso 5 A',
    items: [
      {
        id: 'oi-005',
        menuItemId: 'item-002',
        menuItem: menuItems.find(i => i.id === 'item-002')!,
        quantity: 2,
        unitPrice: 3500,
        subtotal: 7000,
      },
      {
        id: 'oi-006',
        menuItemId: 'item-006',
        menuItem: menuItems.find(i => i.id === 'item-006')!,
        quantity: 1,
        unitPrice: 11000,
        subtotal: 11000,
      },
    ],
    total: 18000,
    createdAt: new Date(Date.now() - 1000 * 60 * 25),
    updatedAt: new Date(Date.now() - 1000 * 60 * 8),
    approvedAt: new Date(Date.now() - 1000 * 60 * 25),
    preparingAt: new Date(Date.now() - 1000 * 60 * 8),
    estimatedTime: 20,
  },
  {
    id: 'order-004',
    restaurantId: 'rest-001',
    type: 'MESA',
    status: 'LISTO',
    customerName: 'Ana Rodríguez',
    tableId: 'table-004',
    tableNumber: 4,
    items: [
      {
        id: 'oi-007',
        menuItemId: 'item-005',
        menuItem: menuItems.find(i => i.id === 'item-005')!,
        quantity: 1,
        unitPrice: 14000,
        subtotal: 14000,
      },
    ],
    total: 14000,
    createdAt: new Date(Date.now() - 1000 * 60 * 40),
    updatedAt: new Date(Date.now() - 1000 * 60 * 3),
    approvedAt: new Date(Date.now() - 1000 * 60 * 38),
    preparingAt: new Date(Date.now() - 1000 * 60 * 35),
    readyAt: new Date(Date.now() - 1000 * 60 * 3),
    estimatedTime: 25,
  },
  // Pedido demorado para demo
  {
    id: 'order-005',
    restaurantId: 'rest-001',
    type: 'DELIVERY',
    status: 'APROBADO',
    customerName: 'Roberto Sánchez',
    customerPhone: '+54 11 6666-7890',
    customerAddress: 'Callao 567, 3B',
    items: [
      {
        id: 'oi-008',
        menuItemId: 'item-003',
        menuItem: menuItems.find(i => i.id === 'item-003')!,
        quantity: 1,
        unitPrice: 8500,
        subtotal: 8500,
      },
    ],
    total: 8500,
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // hace 45 min - demorado!
    updatedAt: new Date(Date.now() - 1000 * 60 * 43),
    approvedAt: new Date(Date.now() - 1000 * 60 * 43),
    estimatedTime: 15,
  },
];

// ==========================================
// FUNCIONES HELPER
// ==========================================

export const getRestaurantById = (id: string): Restaurant | undefined =>
  restaurants.find(r => r.id === id);

export const getRestaurantBySlug = (slug: string): Restaurant | undefined =>
  restaurants.find(r => r.slug === slug);

export const getTablesByRestaurant = (restaurantId: string): Table[] =>
  tables.filter(t => t.restaurantId === restaurantId);

export const getTableByNumber = (restaurantId: string, tableNumber: number): Table | undefined =>
  tables.find(t => t.restaurantId === restaurantId && t.number === tableNumber);

export const getCategoriesByRestaurant = (restaurantId: string): MenuCategory[] =>
  menuCategories.filter(c => c.restaurantId === restaurantId).sort((a, b) => a.order - b.order);

export const getMenuItemsByRestaurant = (restaurantId: string): MenuItem[] =>
  menuItems.filter(i => i.restaurantId === restaurantId);

export const getMenuItemsByCategory = (categoryId: string): MenuItem[] =>
  menuItems.filter(i => i.categoryId === categoryId);

export const getMenuItemById = (id: string): MenuItem | undefined =>
  menuItems.find(i => i.id === id);
