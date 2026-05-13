import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory "database"
  const db = {
    users: [
      { id: "admin-1", email: "admin@gourmetos.com", role: "ADMIN", name: "Admin User" },
      { id: "chef-1", email: "chef@gourmetos.com", role: "CHEF", name: "Chef Gordon" },
      { id: "cashier-1", email: "cashier@gourmetos.com", role: "CASHIER", name: "Jane Cashier" },
    ],
    menu: [
      // Starters
      { id: "1", name: "Paneer Tikka Angara", category: "Starters", price: 450, status: "available", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800" },
      { id: "2", name: "Galouti Kebab", category: "Starters", price: 850, status: "available", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800" },
      { id: "3", name: "Dahi Ke Sholey", category: "Starters", price: 350, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },
      { id: "4", name: "Amritsari Kulcha Mini", category: "Starters", price: 250, status: "available", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800" },
      { id: "5", name: "Hara Bhara Kebab", category: "Starters", price: 320, status: "available", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800" },
      { id: "6", name: "Malai Broccoli", category: "Starters", price: 420, status: "available", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800" },
      { id: "7", name: "Chicken 65", category: "Starters", price: 480, status: "available", image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?q=80&w=800" },
      { id: "8", name: "Mutton Seekh Kebab", category: "Starters", price: 750, status: "available", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800" },
      { id: "9", name: "Prawns Koliwada", category: "Starters", price: 950, status: "available", image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=800" },
      { id: "10", name: "Achari Mushroom", category: "Starters", price: 380, status: "available", image: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?q=80&w=800" },
      { id: "11", name: "Tandoori Soya Chaap", category: "Starters", price: 320, status: "available", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800" },
      { id: "12", name: "Lasooni Murgh Tikka", category: "Starters", price: 520, status: "available", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800" },
      { id: "13", name: "Kurkuri Bhindi", category: "Starters", price: 280, status: "available", image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?q=80&w=800" },
      { id: "14", name: "Fish Amritsari", category: "Starters", price: 680, status: "available", image: "https://images.unsplash.com/photo-1626074285741-f7ade9244092?q=80&w=800" },
      { id: "15", name: "Kalmi Kebab", category: "Starters", price: 580, status: "available", image: "https://images.unsplash.com/photo-1626776876729-bab4369a5a54?q=80&w=800" },
      { id: "16", name: "Beetroot Tikki", category: "Starters", price: 340, status: "available", image: "https://images.unsplash.com/photo-1651979308115-46fd40381617?q=80&w=800" },
      { id: "17", name: "Afghani Paneer Tikka", category: "Starters", price: 470, status: "available", image: "https://images.unsplash.com/photo-1567184109171-969977ec308f?q=80&w=800" },
      { id: "18", name: "Bhatti Da Murgh", category: "Starters", price: 550, status: "available", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800" },
      { id: "19", name: "Corn Salt & Pepper", category: "Starters", price: 300, status: "available", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800" },
      { id: "20", name: "Vada Pav Sliders", category: "Starters", price: 220, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },

      // Main Course
      { id: "21", name: "Dal Makhani", category: "Main Course", price: 450, status: "available", image: "https://images.unsplash.com/photo-1546833999-b9f181d216c6?q=80&w=800" },
      { id: "22", name: "Butter Chicken", category: "Main Course", price: 650, status: "available", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800" },
      { id: "23", name: "Paneer Lababdar", category: "Main Course", price: 520, status: "available", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800" },
      { id: "24", name: "Hyderabadi Dum Biryani", category: "Main Course", price: 580, status: "available", image: "https://images.unsplash.com/photo-1589302168068-964694993a4a?q=80&w=800" },
      { id: "25", name: "Rogan Josh", category: "Main Course", price: 850, status: "available", image: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=800" },
      { id: "26", name: "Lucknowi Gosht Biryani", category: "Main Course", price: 920, status: "available", image: "https://images.unsplash.com/photo-1589302168068-964694993a4a?q=80&w=800" },
      { id: "27", name: "Malai Kofta", category: "Main Course", price: 480, status: "available", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800" },
      { id: "28", name: "Laal Maas", category: "Main Course", price: 890, status: "available", image: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=800" },
      { id: "29", name: "Chicken Tikka Masala", category: "Main Course", price: 620, status: "available", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800" },
      { id: "30", name: "Goan Fish Curry", category: "Main Course", price: 780, status: "available", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800" },
      { id: "31", name: "Kadai Paneer", category: "Main Course", price: 490, status: "available", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800" },
      { id: "32", name: "Palak Paneer", category: "Main Course", price: 480, status: "available", image: "https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?q=80&w=800" },
      { id: "33", name: "Bhuna Gosht", category: "Main Course", price: 820, status: "available", image: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=800" },
      { id: "34", name: "Sarson Da Saag", category: "Main Course", price: 380, status: "limited", image: "https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?q=80&w=800" },
      { id: "35", name: "Nihari", category: "Main Course", price: 750, status: "available", image: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=800" },
      { id: "36", name: "Baingan Bharta", category: "Main Course", price: 320, status: "available", image: "https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?q=80&w=800" },
      { id: "37", name: "Methi Matar Malai", category: "Main Course", price: 420, status: "available", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800" },
      { id: "38", name: "Prawn Ghee Roast", category: "Main Course", price: 1150, status: "available", image: "https://images.unsplash.com/photo-1563379091339-0ca4b82183cb?q=80&w=800" },
      { id: "39", name: "Saffron Vegetable Pulao", category: "Main Course", price: 350, status: "available", image: "https://images.unsplash.com/photo-1563379091339-0ca4b82183cb?q=80&w=800" },
      { id: "40", name: "Dahi Bhalla", category: "Main Course", price: 180, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },
      { id: "41", name: "Handi Murgh", category: "Main Course", price: 580, status: "available", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800" },
      { id: "42", name: "Dum Aloo Kashmiri", category: "Main Course", price: 420, status: "available", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800" },
      { id: "43", name: "Kerala Beef Fry", category: "Main Course", price: 650, status: "available", image: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=800" },
      { id: "44", name: "Kadhai Mushroom", category: "Main Course", price: 390, status: "available", image: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?q=80&w=800" },
      { id: "45", name: "Jeera Rice", category: "Main Course", price: 220, status: "available", image: "https://images.unsplash.com/photo-1563379091339-0ca4b82183cb?q=80&w=800" },
      { id: "46", name: "Mutton Korma", category: "Main Course", price: 850, status: "available", image: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=800" },
      { id: "47", name: "Bisi Bele Bath", category: "Main Course", price: 280, status: "available", image: "https://images.unsplash.com/photo-1563379091339-0ca4b82183cb?q=80&w=800" },
      { id: "48", name: "Lemon Rice", category: "Main Course", price: 250, status: "available", image: "https://images.unsplash.com/photo-1563379091339-0ca4b82183cb?q=80&w=800" },
      { id: "49", name: "Chettinad Chicken", category: "Main Course", price: 620, status: "available", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800" },
      { id: "50", name: "Veg Jalfrezi", category: "Main Course", price: 340, status: "available", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800" },

      // Breads & Accents
      { id: "51", name: "Butter Naan", category: "Combos", price: 60, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },
      { id: "52", name: "Garlic Naan", category: "Combos", price: 80, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },
      { id: "53", name: "Laccha Paratha", category: "Combos", price: 70, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },
      { id: "54", name: "Missi Roti", category: "Combos", price: 50, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },
      { id: "55", name: "Rumali Roti", category: "Combos", price: 45, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },
      { id: "56", name: "Cheese Chili Naan", category: "Combos", price: 110, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },
      { id: "57", name: "Stuffed Kulcha", category: "Combos", price: 150, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },
      { id: "58", name: "Appam (2 pcs)", category: "Combos", price: 90, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },
      { id: "59", name: "Tandoori Roti", category: "Combos", price: 40, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },
      { id: "60", name: "Pudina Paratha", category: "Combos", price: 80, status: "available", image: "https://images.unsplash.com/photo-1601050633647-8f8f5f4ad474?q=80&w=800" },

      // Desserts
      { id: "61", name: "Gulab Jamun with Rabri", category: "Desserts", price: 220, status: "available", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800" },
      { id: "62", name: "Ras Malai", category: "Desserts", price: 250, status: "available", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800" },
      { id: "63", name: "Gajar Ka Halwa", category: "Desserts", price: 280, status: "limited", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=800" },
      { id: "64", name: "Kesari Phirni", category: "Desserts", price: 190, status: "available", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800" },
      { id: "65", name: "Kulfi Falooda", category: "Desserts", price: 240, status: "available", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800" },
      { id: "66", name: "Shahi Tukda", category: "Desserts", price: 320, status: "available", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800" },
      { id: "67", name: "Moong Dal Halwa", category: "Desserts", price: 260, status: "available", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=800" },
      { id: "68", name: "Mishti Doi", category: "Desserts", price: 150, status: "available", image: "https://images.unsplash.com/photo-1563379091339-0ca4b82183cb?q=80&w=800" },
      { id: "69", name: "Saffron Jalebi", category: "Desserts", price: 200, status: "available", image: "https://images.unsplash.com/photo-1571935441005-467041f062d1?q=80&w=800" },
      { id: "70", name: "Badam Milk Pudding", category: "Desserts", price: 230, status: "available", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800" },

      // Drinks
      { id: "71", name: "Mango Lassi", category: "Drinks", price: 180, status: "available", image: "https://images.unsplash.com/photo-1571006682858-a5d7751d95c9?q=80&w=800" },
      { id: "72", name: "Masala Chai", category: "Drinks", price: 90, status: "available", image: "https://images.unsplash.com/photo-1571935441005-467041f062d1?q=80&w=800" },
      { id: "73", name: "Fresh Lime Soda", category: "Drinks", price: 120, status: "available", image: "https://images.unsplash.com/photo-1544787210-2211d40a8309?q=80&w=800" },
      { id: "74", name: "Spiced Buttermilk", category: "Drinks", price: 110, status: "available", image: "https://images.unsplash.com/photo-1571006682858-a5d7751d95c9?q=80&w=800" },
      { id: "75", name: "Thandai", category: "Drinks", price: 220, status: "limited", image: "https://images.unsplash.com/photo-1571006682858-a5d7751d95c9?q=80&w=800" },
      { id: "76", name: "Aam Panna", category: "Drinks", price: 150, status: "available", image: "https://images.unsplash.com/photo-1571006682858-a5d7751d95c9?q=80&w=800" },
      { id: "77", name: "Cold Coffee with Ice Cream", category: "Drinks", price: 210, status: "available", image: "https://images.unsplash.com/photo-1571006682858-a5d7751d95c9?q=80&w=800" },
      { id: "78", name: "Filter Coffee", category: "Drinks", price: 110, status: "available", image: "https://images.unsplash.com/photo-1571935441005-467041f062d1?q=80&w=800" },
      { id: "79", name: "Kokum Sherbet", category: "Drinks", price: 140, status: "available", image: "https://images.unsplash.com/photo-1571006682858-a5d7751d95c9?q=80&w=800" },
      { id: "80", name: "Jal Jeera", category: "Drinks", price: 100, status: "available", image: "https://images.unsplash.com/photo-1571006682858-a5d7751d95c9?q=80&w=800" },
      { id: "81", name: "Saffron Badam Milk", category: "Drinks", price: 250, status: "available", image: "https://images.unsplash.com/photo-1571006682858-a5d7751d95c9?q=80&w=800" },
      { id: "82", name: "Rose Sherbet", category: "Drinks", price: 130, status: "available", image: "https://images.unsplash.com/photo-1571006682858-a5d7751d95c9?q=80&w=800" }
    ],
    orders: [] as any[],
    reservations: [] as any[],
    inventory: [
      { id: "i1", item: "Basmati Rice", stock: 150, unit: "kg", minStock: 20 },
      { id: "i2", item: "Kashmiri Chillies", stock: 50, unit: "kg", minStock: 5 },
      { id: "i3", item: "Saffron (Pure Kashmir)", stock: 500, unit: "g", minStock: 50 },
      { id: "i4", item: "Pure Ghee", stock: 100, unit: "kg", minStock: 10 },
      { id: "i5", item: "A2 Paneer", stock: 20, unit: "kg", minStock: 5 },
    ],
    employees: [
      { id: "e1", name: "Gordon Ramsay", role: "Executive Chef", shift: "Morning" },
      { id: "e2", name: "Wolfgang Puck", role: "Head Chef", shift: "Evening" },
    ]
  };

  // Auth mock
  app.post("/api/auth/login", (req, res) => {
    const { email } = req.body;
    const user = db.users.find(u => u.email === email);
    if (user) {
      res.json({ token: "mock-jwt-token", user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Menu API
  app.get("/api/menu", (req, res) => res.json(db.menu));
  app.post("/api/menu", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    db.menu.push(newItem);
    res.json(newItem);
  });

  // Orders API
  app.get("/api/orders", (req, res) => res.json(db.orders));
  app.post("/api/orders", (req, res) => {
    const newOrder = { 
      id: "ORD-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: "pending",
      ...req.body 
    };
    db.orders.push(newOrder);
    res.json(newOrder);
  });
  app.patch("/api/orders/:id", (req, res) => {
    const order = db.orders.find(o => o.id === req.params.id);
    if (order) {
      Object.assign(order, req.body);
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });

  // Reservations
  app.get("/api/reservations", (req, res) => res.json(db.reservations));
  app.post("/api/reservations", (req, res) => {
    const resv = { id: Date.now().toString(), ...req.body };
    db.reservations.push(resv);
    res.json(resv);
  });

  // Inventory
  app.get("/api/inventory", (req, res) => res.json(db.inventory));

  // Analytics helper (Mock AI insight from server side if needed, but skill says call Gemini from frontend)
  // We'll expose simple data for the frontend to digest with Gemini
  app.get("/api/analytics/raw", (req, res) => {
    res.json({
      totalSales: db.orders.length,
      revenue: db.orders.reduce((sum, o) => sum + (o.total || 0), 0) * 85,
      dailyOrders: db.orders.filter(o => {
        const today = new Date().toDateString();
        return new Date(o.createdAt).toDateString() === today;
      }).length,
      bestSellers: db.menu.slice(0, 2),
      lowStock: db.inventory.filter(i => i.stock <= i.minStock)
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
