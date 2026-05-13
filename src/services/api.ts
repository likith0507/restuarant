import { Order, MenuItem, Reservation, InventoryItem } from '../types';

// Initial Mock Data
const INITIAL_MENU: MenuItem[] = [
  { id: "1", name: "Paneer Tikka Angara", category: "Starters", price: 450, status: "available", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800" },
  { id: "2", name: "Galouti Kebab", category: "Starters", price: 850, status: "available", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800" },
  { id: "3", name: "Dahi Ke Sholey", category: "Starters", price: 350, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },
  { id: "21", name: "Dal Makhani", category: "Main Course", price: 450, status: "available", image: "https://images.unsplash.com/photo-1546833999-b9f181d216c6?q=80&w=800" },
  { id: "22", name: "Butter Chicken", category: "Main Course", price: 650, status: "available", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800" },
  { id: "24", name: "Hyderabadi Dum Biryani", category: "Main Course", price: 580, status: "available", image: "https://images.unsplash.com/photo-1589302168068-964694993a4a?q=80&w=800" },
  { id: "61", name: "Gulab Jamun with Rabri", category: "Desserts", price: 220, status: "available", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800" },
  { id: "71", name: "Mango Lassi", category: "Drinks", price: 180, status: "available", image: "https://images.unsplash.com/photo-1571006682858-a5d7751d95c9?q=80&w=800" },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "i1", item: "Basmati Rice", stock: 150, unit: "kg", minStock: 20 },
  { id: "i2", item: "Kashmiri Chillies", stock: 50, unit: "kg", minStock: 5 },
  { id: "i3", item: "Saffron (Pure Kashmir)", stock: 500, unit: "g", minStock: 50 },
  { id: "i4", item: "Pure Ghee", stock: 100, unit: "kg", minStock: 10 },
  { id: "i5", item: "A2 Paneer", stock: 20, unit: "kg", minStock: 5 },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-X192",
    createdAt: new Date().toISOString(),
    items: [{ menuItemId: "1", name: "Paneer Tikka Angara", price: 450, quantity: 2 }],
    status: "served",
    total: 900,
    type: "dine-in"
  }
];

class DataService {
  private getData<T>(key: string, initial: T): T {
    const saved = localStorage.getItem(`gourmetos_${key}`);
    return saved ? JSON.parse(saved) : initial;
  }

  private setData<T>(key: string, data: T) {
    localStorage.setItem(`gourmetos_${key}`, JSON.stringify(data));
  }

  async getMenu(): Promise<MenuItem[]> {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) return res.json();
    } catch {}
    return this.getData('menu', INITIAL_MENU);
  }

  async getInventory(): Promise<InventoryItem[]> {
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) return res.json();
    } catch {}
    return this.getData('inventory', INITIAL_INVENTORY);
  }

  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) return res.json();
    } catch {}
    return this.getData('orders', INITIAL_ORDERS);
  }

  async getReservations(): Promise<Reservation[]> {
    try {
      const res = await fetch('/api/reservations');
      if (res.ok) return res.json();
    } catch {}
    return this.getData('reservations', []);
  }

  async addReservation(resv: any): Promise<Reservation> {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resv)
      });
      if (res.ok) return res.json();
    } catch {}
    
    const reservations = this.getReservationsSync();
    const newResv = { id: Date.now().toString(), ...resv };
    this.setData('reservations', [...reservations, newResv]);
    return newResv;
  }

  private getReservationsSync(): Reservation[] {
    return this.getData('reservations', []);
  }
}

export const api = new DataService();
