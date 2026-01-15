// ==========================================
// TIPOS PRINCIPALES - MULTI-RESTAURANT PLATFORM
// ==========================================

// Estados posibles de un pedido
export type OrderStatus =
  | 'CREADO'      // Pendiente de aprobación (pedido por mesa)
  | 'APROBADO'    // Aprobado, listo para cocina
  | 'PREPARANDO'  // En preparación
  | 'LISTO'       // Listo para entregar/servir
  | 'ENTREGADO';  // Finalizado

// Tipo de pedido según el canal
export type OrderType = 'MESA' | 'DELIVERY';

// ==========================================
// ENTIDADES DEL RESTAURANTE
// ==========================================

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  address: string;
  phone: string;
  isOpen: boolean;
}

export interface Table {
  id: string;
  restaurantId: string;
  number: number;
  qrCode: string; // URL del QR
  capacity: number;
  isOccupied: boolean;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  order: number;
}

// Tipo de ingrediente/modificador
export type IngredientType = 'removable' | 'extra';

export interface Ingredient {
  id: string;
  name: string;
  type: IngredientType;
  price?: number; // Solo para extras
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  preparationTime?: number; // minutos estimados
  ingredients?: Ingredient[]; // Ingredientes disponibles para personalizar
}

// ==========================================
// PEDIDOS
// ==========================================

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem; // Referencia completa para mostrar info
  quantity: number;
  notes?: string;
  unitPrice: number;
  subtotal: number;
  removedIngredients?: Ingredient[]; // Ingredientes removidos ("sin...")
  extraIngredients?: Ingredient[]; // Ingredientes extra ("extra...")
}

export interface Order {
  id: string;
  restaurantId: string;
  type: OrderType;
  status: OrderStatus;

  // Info del cliente
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;

  // Para pedidos de mesa
  tableId?: string;
  tableNumber?: number;

  // Items del pedido
  items: OrderItem[];
  total: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  preparingAt?: Date;
  readyAt?: Date;
  deliveredAt?: Date;

  // Para detectar pedidos demorados
  estimatedTime?: number; // minutos
}

// ==========================================
// CARRITO (estado temporal del cliente)
// ==========================================

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  removedIngredients?: Ingredient[]; // Ingredientes removidos ("sin...")
  extraIngredients?: Ingredient[]; // Ingredientes extra ("extra...")
}

export interface Cart {
  restaurantId: string;
  items: CartItem[];
  type: OrderType;
  tableId?: string;
  tableNumber?: number;
}

// ==========================================
// CONTEXTOS Y HOOKS
// ==========================================

export interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => boolean;
  approveOrder: (orderId: string) => boolean;
  rejectOrder: (orderId: string) => boolean;
  getOrdersByRestaurant: (restaurantId: string) => Order[];
  getOrdersByStatus: (restaurantId: string, statuses: OrderStatus[]) => Order[];
  getPendingTableOrders: (restaurantId: string) => Order[];
  getKitchenOrders: (restaurantId: string) => Order[];
}

export interface CartContextType {
  cart: Cart | null;
  initCart: (restaurantId: string, type: OrderType, tableId?: string, tableNumber?: number) => void;
  addToCart: (
    menuItem: MenuItem,
    quantity?: number,
    notes?: string,
    removedIngredients?: Ingredient[],
    extraIngredients?: Ingredient[]
  ) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateNotes: (menuItemId: string, notes: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export interface ProductsContextType {
  products: MenuItem[];
  getProductsByRestaurant: (restaurantId: string) => MenuItem[];
  getProductsByCategory: (categoryId: string) => MenuItem[];
  getProductById: (productId: string) => MenuItem | undefined;
  toggleProductAvailability: (productId: string) => void;
  setProductAvailability: (productId: string, isAvailable: boolean) => void;
}
