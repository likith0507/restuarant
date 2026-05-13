import React from 'react';
import { 
  Users, 
  LayoutDashboard, 
  UtensilsCrossed, 
  ChefHat, 
  Calendar, 
  Package, 
  FileText, 
  LogOut,
  Bell,
  Search,
  Plus,
  ShieldAlert,
  LogIn,
  User as UserIcon,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { User, UserRole, MenuItem, Order, Reservation, InventoryItem } from './types';
import { getFoodRecommendations, getSalesInsights } from './lib/gemini';
import { api } from './services/api';
import ReactMarkdown from 'react-markdown';

// Mock Data
const SALES_DATA = [
  { name: 'Mon', total: 340000 },
  { name: 'Tue', total: 255000 },
  { name: 'Wed', total: 170000 },
  { name: 'Thu', total: 236300 },
  { name: 'Fri', total: 160650 },
  { name: 'Sat', total: 203150 },
  { name: 'Sun', total: 296650 },
];

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [loading, setLoading] = React.useState(false);

  // Simple local auth mock
  const login = (role: UserRole) => {
    setUser({
      id: "u1",
      email: `${role.toLowerCase()}@gourmetos.com`,
      name: role.charAt(0) + role.slice(1).toLowerCase() + " User",
      role: role
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginView onLogin={login} />;
  }

  return (
    <div className="flex h-screen bg-luxury-black overflow-hidden font-sans">
      <Sidebar 
        role={user.role} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 border-b border-border-subtle flex items-center justify-between px-10 bg-header-black sticky top-0 z-30">
          <div className="flex flex-col">
            <h2 className="text-xl font-serif text-white capitalize leading-none mb-1">{activeTab.replace('-', ' ')}</h2>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Search terminal..." 
                className="bg-white/5 border border-border-subtle rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-gold/30 transition-colors w-64 uppercase tracking-widest text-[10px]"
              />
            </div>
            <button className="relative p-2 text-white/50 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-dark-red rounded-full border-2 border-header-black"></span>
            </button>
            <div className="h-8 w-px bg-border-subtle mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white">{user.name}</p>
                <p className="text-[9px] text-gold uppercase tracking-[0.2em]">{user.role}</p>
              </div>
              <div className="w-9 h-9 rounded bg-dark-red flex items-center justify-center text-xs font-bold border border-gold/20">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              {activeTab === 'dashboard' && <DashboardView />}
              {activeTab === 'menu' && <MenuView />}
              {activeTab === 'orders' && <OrdersView />}
              {activeTab === 'reservations' && <ReservationsView />}
              {activeTab === 'inventory' && <InventoryView />}
              {activeTab === 'reports' && <ReportsView />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

function LoginView({ onLogin }: { onLogin: (role: UserRole) => void }) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-luxury-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.1),transparent_70%)] animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-10 sophisticated-card relative z-10 mx-4 border-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-dark-red rounded-full flex items-center justify-center border border-gold/30 mb-6 shadow-[0_0_20px_rgba(139,0,0,0.4)]">
            <ChefHat className="text-gold w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif text-white tracking-[0.2em] uppercase mb-1">GourmetOS</h1>
          <p className="text-[10px] text-white/30 tracking-[0.3em] uppercase">Private Access Terminal • Authorized Personnel Only</p>
        </div>

        <div className="space-y-4">
          {(['ADMIN', 'MANAGER', 'CHEF', 'CASHIER'] as UserRole[]).map(role => (
            <button 
              key={role}
              onClick={() => onLogin(role)}
              className="w-full bg-white/5 border border-gold/20 text-gold font-bold py-4 rounded-lg hover:bg-gold hover:text-black transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3"
            >
              Login as {role}
            </button>
          ))}
        </div>

        <div className="mt-10 text-center border-t border-border-subtle pt-6">
          <p className="text-[9px] text-white/20 tracking-[0.3em] uppercase mb-2">Restricted Access</p>
          <div className="flex justify-center gap-1">
             <div className="w-1 h-1 bg-dark-red rounded-full"></div>
             <div className="w-1 h-1 bg-gold rounded-full"></div>
             <div className="w-1 h-1 bg-dark-red rounded-full"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Sidebar({ role, activeTab, onTabChange, onLogout }: any) {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { id: 'menu', icon: UtensilsCrossed, label: 'Menu', roles: ['ADMIN', 'MANAGER', 'CHEF'] },
    { id: 'orders', icon: ChefHat, label: 'Orders', roles: ['ADMIN', 'MANAGER', 'CHEF', 'CASHIER'] },
    { id: 'reservations', icon: Calendar, label: 'Reservations', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { id: 'inventory', icon: Package, label: 'Inventory', roles: ['ADMIN', 'MANAGER', 'CHEF'] },
    { id: 'reports', icon: FileText, label: 'Insights', roles: ['ADMIN', 'MANAGER'] },
  ];

  const visibleTabs = tabs.filter(t => t.roles.includes(role));

  return (
    <aside className="w-64 h-screen border-r border-border-subtle bg-sidebar-black flex flex-col z-40 relative">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-dark-red rounded-full flex items-center justify-center border border-gold/30">
          <span className="text-gold font-serif text-xl font-bold">G</span>
        </div>
        <span className="font-serif text-xl tracking-widest text-gold uppercase">Gourmet</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {visibleTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 transition-colors group relative ${
                isActive 
                  ? 'sidebar-link-active' 
                  : 'text-white/40 hover:text-gold'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border-subtle mt-auto">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white/40 hover:text-dark-red hover:bg-dark-red/5 transition-all text-xs font-bold uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Terminate
        </button>
      </div>
    </aside>
  );
}

function DashboardView() {
  const [aiInsight, setAiInsight] = React.useState("");
  const [loadingInsight, setLoadingInsight] = React.useState(false);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);

  React.useEffect(() => {
    api.getOrders().then(setOrders);
    api.getInventory().then(setInventory);
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;

  const generateInsight = async () => {
    setLoadingInsight(true);
    const insight = await getSalesInsights(SALES_DATA);
    setAiInsight(insight || "");
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-10 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, delta: 'All Time', icon: UtensilsCrossed, color: 'text-gold' },
          { label: 'Total Orders', value: orders.length.toString(), delta: 'Life cycle', icon: ChefHat, color: 'text-white' },
          { label: 'Occupancy', value: '84%', delta: 'Active', icon: Calendar, color: 'text-white' },
          { label: 'System Alerts', value: lowStockCount.toString(), delta: 'Low Stock', icon: Bell, color: 'text-dark-red' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`sophisticated-card p-6 ${stat.label === 'System Alerts' && lowStockCount > 0 ? 'bg-dark-red/5 border-dark-red/30' : ''}`}
          >
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className={`text-4xl font-serif ${stat.color}`}>{stat.value}</h3>
              <span className={`text-[10px] font-bold uppercase tracking-widest text-white/20`}>
                {stat.delta}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 sophisticated-card p-8 bg-sidebar-black">
          <div className="flex items-center justify-between mb-10 border-b border-border-subtle pb-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">Revenue Intelligence</h4>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '10px' }} itemStyle={{ color: '#D4AF37' }} />
                <Area type="monotone" dataKey="total" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 sophisticated-card p-8 border-gold/10 flex flex-col">
          <div className="flex items-center gap-3 mb-8 border-b border-border-subtle pb-4">
             <div className="w-8 h-8 rounded-full bg-dark-red flex items-center justify-center border border-gold/20">
                <ChefHat className="text-gold w-4 h-4" />
             </div>
             <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white">Neural Insights</h4>
          </div>
          <div className="flex-1 mb-10 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {aiInsight ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-white/60 leading-relaxed uppercase tracking-[0.1em]">
                   <ReactMarkdown>{aiInsight}</ReactMarkdown>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-20">
                  <ChefHat className="w-12 h-12 mb-2" />
                  <p className="text-[9px] uppercase tracking-[0.4em]">Awaiting Execution...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={generateInsight} disabled={loadingInsight} className="w-full py-4 rounded bg-white/5 border border-gold/20 text-gold font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-black transition-all disabled:opacity-50">
            {loadingInsight ? "Processing Neural Stream..." : "Initiate Audit"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuView() {
  const [items, setItems] = React.useState<MenuItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    api.getMenu().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-96"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center bg-sidebar-black p-8 border border-border-subtle rounded-2xl">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2 uppercase tracking-widest italic">Culinaries</h1>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.4em]">Managing the legacy of taste</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="sophisticated-card group">
            <div className="relative h-72 overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent" />
              <div className="absolute top-6 left-6 flex flex-col gap-1">
                 <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] bg-black/80 px-3 py-1 rounded-sm border border-gold/20">{item.category}</span>
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-serif text-white tracking-wide italic leading-tight">{item.name}</h3>
                <span className="text-xl font-serif text-gold">₹{item.price}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border-subtle pt-6">
                <span className={`text-[9px] font-bold px-3 py-1 rounded border ${item.status === 'available' ? 'text-green-500 border-green-500/20' : 'text-gold border-gold/20'} uppercase tracking-[0.2em]`}>
                  {item.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OrdersView() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    api.getOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
     return <div className="h-96 flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-sidebar-black p-8 border border-border-subtle rounded-2xl">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2 uppercase tracking-widest italic">Live Operations</h1>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.4em]">Kitchen Kernel v2.4 Status: Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {orders.length === 0 ? (
          <div className="col-span-2 py-20 text-center sophisticated-card opacity-30">
             <ChefHat className="w-16 h-16 mx-auto mb-4" />
             <p className="text-[10px] uppercase tracking-[0.5em]">No active operational logs</p>
          </div>
        ) : (
          orders.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="sophisticated-card p-8 border-l-4 border-l-gold">
              <div className="flex justify-between items-start mb-6 border-b border-border-subtle pb-6">
                <div>
                  <h3 className="text-white font-mono text-sm tracking-widest mb-1">{order.id}</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                <span className={`text-[9px] font-bold px-3 py-1 rounded border ${order.status === 'pending' ? 'text-gold border-gold/20' : order.status === 'served' ? 'text-green-500 border-green-500/20' : 'text-white/40 border-white/10'} uppercase tracking-[0.2em]`}>
                  {order.status}
                </span>
              </div>
              <div className="space-y-3 mb-8">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-white/60 uppercase tracking-widest"><span className="text-gold pr-2">{item.quantity}x</span> {item.name}</span>
                    <span className="text-white/40 font-serif">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-border-subtle">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">Total Quantum</span>
                <span className="text-xl font-serif text-gold">₹{order.total}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function ReservationsView() {
  const [reservations, setReservations] = React.useState<Reservation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);

  const fetchReservations = () => {
    setLoading(true);
    api.getReservations().then(data => {
      setReservations(data);
      setLoading(false);
    });
  };

  React.useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return <div className="h-96 flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-sidebar-black p-8 border border-border-subtle rounded-2xl">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2 uppercase tracking-widest italic">Guest Ledger</h1>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.4em]">Capacity Management Protocol</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gold text-black px-8 py-3 rounded uppercase tracking-widest font-bold text-[10px] hover:shadow-gold/20 shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Assign New Table
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="sophisticated-card w-full max-w-2xl overflow-hidden"
            >
              <div className="bg-header-black p-8 border-b border-border-subtle flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <Calendar className="text-gold w-5 h-5" />
                   <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white">Guest Registration Protocol</h2>
                </div>
                <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white uppercase text-[10px] tracking-widest font-bold px-4 py-2 border border-white/10 rounded hover:bg-white/5 transition-all">Close Terminal</button>
              </div>
              <ReservationForm onSuccess={() => { setShowForm(false); fetchReservations(); }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="sophisticated-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-subtle bg-white/5">
              {['Guest Details', 'Schedule', 'Quantum', 'Table Node', 'Status'].map(h => (
                <th key={h} className="px-8 py-4 text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center opacity-20">
                  <p className="text-[10px] uppercase tracking-[0.5em]">Ledger is empty</p>
                </td>
              </tr>
            ) : (
              reservations.map((res, i) => (
                <tr key={res.id} className="border-b border-border-subtle hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
                        <UserIcon className="w-3 h-3 text-white/40" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase tracking-widest">{res.customerName}</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">{res.customerEmail || 'No Email Recorded'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-white/60">
                      <Clock className="w-3 h-3" />
                      <p className="text-xs uppercase tracking-widest">{res.date} • {res.time}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gold font-serif">
                    {res.guests} PAX
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                       <span className="font-mono text-xs text-white/40">T-{res.tableNumber}</span>
                       <span className="text-[8px] uppercase tracking-widest text-white/10 mt-1">Authorized Sector</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <CheckCircle2 className="w-3 h-3 text-green-500" />
                       <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">
                        {res.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReservationForm({ onSuccess }: { onSuccess: () => void }) {
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = {
      customerName: formData.get('name'),
      customerEmail: formData.get('email'),
      customerPhone: formData.get('phone'),
      date: formData.get('date'),
      time: formData.get('time'),
      guests: Number(formData.get('guests')),
      tableNumber: Math.floor(Math.random() * 20) + 1,
      status: 'confirmed'
    };

    await api.addReservation(res);

    setSubmitting(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Guest Identity</label>
          <input name="name" required placeholder="GUEST NAME" className="w-full bg-black border border-border-subtle p-4 rounded text-xs tracking-widest uppercase focus:border-gold outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Liaison Contact (Email)</label>
          <input name="email" type="email" placeholder="IDENTITY@EMAIL.COM" className="w-full bg-black border border-border-subtle p-4 rounded text-xs tracking-widest uppercase focus:border-gold outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Comm-Link (Phone)</label>
          <input name="phone" placeholder="+91 XXX XXX XXXX" className="w-full bg-black border border-border-subtle p-4 rounded text-xs tracking-widest uppercase focus:border-gold outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Guest Count (PAX)</label>
          <input name="guests" type="number" required min="1" max="12" placeholder="TOTAL QUANTUM" className="w-full bg-black border border-border-subtle p-4 rounded text-xs tracking-widest uppercase focus:border-gold outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Activation Date</label>
          <input name="date" type="date" required className="w-full bg-black border border-border-subtle p-4 rounded text-xs tracking-widest uppercase focus:border-gold outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Chronos Slot (Time)</label>
          <input name="time" type="time" required className="w-full bg-black border border-border-subtle p-4 rounded text-xs tracking-widest uppercase focus:border-gold outline-none transition-all" />
        </div>
      </div>
      <button 
        type="submit" 
        disabled={submitting}
        className="w-full py-5 bg-gold text-black font-bold uppercase tracking-[0.5em] text-[10px] rounded hover:shadow-gold/20 shadow-xl transition-all disabled:opacity-50"
      >
        {submitting ? "Indexing Ledger..." : "Commit Reservation To Shell"}
      </button>
    </form>
  );
}

function InventoryView() {
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    api.getInventory().then(data => {
      setInventory(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="h-96 flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-sidebar-black p-8 border border-border-subtle rounded-2xl">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2 uppercase tracking-widest italic">Stock Cellar</h1>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.4em]">Critical Ingredients Registry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventory.map((item, i) => {
          const isLow = item.stock <= item.minStock;
          return (
            <motion.div key={item.id} className={`sophisticated-card p-6 border-t-2 ${isLow ? 'border-t-dark-red bg-dark-red/5' : 'border-t-green-500/50'}`}>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-2">{item.unit}</p>
              <h3 className="text-xl font-serif text-white mb-6 italic">{item.item}</h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-serif text-gold">{item.stock}</p>
                  <p className={`text-[8px] uppercase tracking-[0.2em] font-bold mt-1 ${isLow ? 'text-dark-red' : 'text-green-500'}`}>
                    {isLow ? 'Critical Level' : 'Stable'}
                  </p>
                </div>
                <div className="h-10 w-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="w-full bg-gold transition-all duration-1000" style={{ height: `${Math.min(100, (item.stock / (item.minStock * 2)) * 100)}%` }}></div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ReportsView() { return <div className="py-20 text-center"><FileText className="w-20 h-20 text-white/10 mx-auto mb-4" /><h1 className="text-4xl text-white/20 font-serif lowercase italic">Executive Financial Intelligence</h1><p className="text-[10px] text-white/20 uppercase tracking-[0.5em] mt-4">Authorized Clearance Level Required</p></div>; }
