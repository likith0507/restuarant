export type UserRole = "ADMIN" | "MANAGER" | "CASHIER" | "CHEF" | "CUSTOMER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  status: "available" | "limited" | "out-of-stock";
  image: string;
}

export interface Order {
  id: string;
  items: { menuItemId: string; quantity: number; price: number; name: string }[];
  total: number;
  status: "pending" | "preparing" | "ready" | "served" | "completed" | "cancelled";
  type: "dine-in" | "takeaway" | "online";
  tableNumber?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string;
  time: string;
  guests: number;
  tableNumber: string | number;
  status: "confirmed" | "pending" | "cancelled";
}

export interface InventoryItem {
  id: string;
  item: string;
  stock: number;
  unit: string;
  minStock: number;
}
