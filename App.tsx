
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, User, Product, DinasName, Transaction, Category } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { 
  Home, 
  Search, 
  ShoppingBag, 
  MapPin, 
  User as UserIcon, 
  CheckCircle, 
  XCircle, 
  Plus, 
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
  Star,
  ArrowRight
} from 'lucide-react';
import { getTravelAssistantResponse } from './services/geminiService';

// View Components
const Navbar = ({ role, setRole, user, onLogout }: { role: UserRole, setRole: (r: UserRole) => void, user: User | null, onLogout: () => void }) => (
  <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">J</div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">JogjaHub</h1>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        <button onClick={() => setRole(UserRole.WISATAWAN)} className={`text-sm font-medium ${role === UserRole.WISATAWAN ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Wisatawan</button>
        <button onClick={() => setRole(UserRole.PELAKU_USAHA)} className={`text-sm font-medium ${role === UserRole.PELAKU_USAHA ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Pelaku Usaha</button>
        <button onClick={() => setRole(UserRole.ADMIN_DINAS)} className={`text-sm font-medium ${role === UserRole.ADMIN_DINAS ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Admin Dinas</button>
        <button onClick={() => setRole(UserRole.SUPER_ADMIN)} className={`text-sm font-medium ${role === UserRole.SUPER_ADMIN ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Super Admin</button>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
            <UserIcon size={16} className="text-slate-600" />
            <span className="text-xs font-semibold text-slate-700">{user.name}</span>
            <button onClick={onLogout} className="text-slate-400 hover:text-red-500 ml-1">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">Login</button>
        )}
      </div>
    </div>
  </nav>
);

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.WISATAWAN);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  // Auto-login logic (simulated for dev)
  useEffect(() => {
    if (!user) {
      setUser({
        id: 'u1',
        name: role === UserRole.WISATAWAN ? 'Wisatawan Jogja' : 
              role === UserRole.PELAKU_USAHA ? 'Batik Berkah' : 
              role === UserRole.ADMIN_DINAS ? 'Admin Dinpar' : 'Super Admin',
        phone: '08123456789',
        role: role,
        dinasAffiliation: role === UserRole.ADMIN_DINAS ? DinasName.PARIWISATA : undefined
      });
    }
  }, [role, user]);

  const handleLogout = () => {
    setUser(null);
  };

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setAiLoading(true);
    const response = await getTravelAssistantResponse(searchQuery);
    setAiMessage(response);
    setAiLoading(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const isApproved = role === UserRole.WISATAWAN ? p.isApproved : true;
    return matchesSearch && matchesCategory && isApproved;
  });

  // Business Actor Logic
  const handleAddProduct = (newProduct: Partial<Product>) => {
    const p: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name || 'Untitled',
      description: newProduct.description || '',
      price: newProduct.price || 0,
      category: newProduct.category || 'Oleh-Oleh',
      subCategory: newProduct.subCategory || 'General',
      dinas: user?.dinasAffiliation || DinasName.KOPERASI_UKM,
      imageUrl: 'https://picsum.photos/seed/new/400/300',
      location: 'Yogyakarta',
      rating: 0,
      isApproved: false,
      status: 'PENDING',
      ownerId: user?.id || 'anonymous'
    };
    setProducts([p, ...products]);
  };

  // Admin Logic
  const updateProductStatus = (id: string, status: 'APPROVED' | 'DISAPPROVED' | 'CORRECTION') => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status, isApproved: status === 'APPROVED' } : p));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role={role} setRole={setRole} user={user} onLogout={handleLogout} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {/* Role Identity Banner */}
        <div className="mb-8 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              role === UserRole.WISATAWAN ? 'bg-blue-100 text-blue-600' :
              role === UserRole.PELAKU_USAHA ? 'bg-green-100 text-green-600' :
              role === UserRole.ADMIN_DINAS ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'
            }`}>
              {role === UserRole.WISATAWAN && <Home size={24} />}
              {role === UserRole.PELAKU_USAHA && <ShoppingBag size={24} />}
              {role === UserRole.ADMIN_DINAS && <LayoutDashboard size={24} />}
              {role === UserRole.SUPER_ADMIN && <Settings size={24} />}
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Mode {role.replace('_', ' ')}</h2>
              <p className="text-xs text-slate-500">Anda masuk sebagai: {user?.name}</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Portal Kolaborasi Dinas DIY</span>
          </div>
        </div>

        {/* --- WISATAWAN VIEW --- */}
        {role === UserRole.WISATAWAN && (
          <div className="space-y-8">
            <section className="text-center max-w-2xl mx-auto space-y-4">
              <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">Jelajahi Jogja dengan <span className="text-indigo-600">Satu Aplikasi</span></h1>
              <p className="text-slate-600">Terintegrasi dengan Dinas Koperasi, Pariwisata, Perhubungan, dan Kebudayaan DIY.</p>
              
              <form onSubmit={handleAiAsk} className="relative group max-w-lg mx-auto">
                <input 
                  type="text" 
                  placeholder="Cari hotel, oleh-oleh, atau tiket museum..."
                  className="w-full pl-12 pr-24 py-4 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-indigo-500/5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-4.5 text-slate-400 group-focus-within:text-indigo-500" size={20} />
                <button type="submit" className="absolute right-2 top-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700">Tanya AI</button>
              </form>
            </section>

            {/* AI Assistant Output */}
            {aiLoading || aiMessage ? (
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-900 mb-1">JogjaHub Guide (AI)</h3>
                    {aiLoading ? (
                      <div className="flex gap-1 mt-2">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    ) : (
                      <p className="text-slate-700 text-sm leading-relaxed">{aiMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Category Filter */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
              {['All', 'Oleh-Oleh', 'Penginapan', 'Wisata', 'Kuliner', 'Museum', 'Event', 'Transportasi Tradisional'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as Category | 'All')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    activeCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  <div className="relative aspect-video">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm">
                      {product.dinas}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">{product.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs mb-4 flex-1">{product.description}</p>
                    <div className="flex items-center text-slate-400 text-[10px] mb-4">
                      <MapPin size={12} className="mr-1" />
                      {product.location}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-lg font-bold text-slate-900">Rp {product.price.toLocaleString()}</span>
                      <button 
                        onClick={() => { setSelectedProduct(product); setShowPayment(true); }}
                        className="bg-slate-900 text-white p-2 rounded-xl hover:bg-indigo-600 transition"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- BUSINESS ACTOR VIEW --- */}
        {role === UserRole.PELAKU_USAHA && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Plus className="text-indigo-600" /> Input Produk Baru
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Nama Barang/Jasa</label>
                    <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: Tiket Workshop Batik" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Kategori</label>
                    <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                      <option>Oleh-Oleh</option>
                      <option>Penginapan</option>
                      <option>Wisata</option>
                      <option>Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Harga (Rp)</label>
                    <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Upload Foto</label>
                    <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer transition">
                      <Plus size={24} />
                      <span className="text-[10px] font-bold mt-2">TAMBAH GAMBAR</span>
                    </div>
                  </div>
                  <button onClick={() => handleAddProduct({})} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition">AJUKAN KURASI</button>
                  <p className="text-[10px] text-slate-400 text-center italic mt-2">Produk akan tampil setelah disetujui Admin Dinas terkait.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-bold text-lg">Kelola Produk Saya</h3>
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Produk</th>
                      <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Kategori</th>
                      <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Status</th>
                      <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-[10px]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.filter(p => p.ownerId === user?.id || p.ownerId === 'owner_1').map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-bold text-slate-800">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{p.category}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            p.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                            p.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-indigo-600 font-bold text-xs">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- ADMIN VIEW --- */}
        {(role === UserRole.ADMIN_DINAS || role === UserRole.SUPER_ADMIN) && (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Menunggu Kurasi</p>
                    <p className="text-2xl font-black text-amber-600">{products.filter(p => p.status === 'PENDING').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><ShoppingBag size={20} /></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Produk Aktif</p>
                    <p className="text-2xl font-black text-green-600">{products.filter(p => p.status === 'APPROVED').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"><CheckCircle size={20} /></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Transaksi</p>
                    <p className="text-2xl font-black text-indigo-600">Rp 42.5M</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600"><MapPin size={20} /></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Wisatawan Aktif</p>
                    <p className="text-2xl font-black text-purple-600">12.4K</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600"><UserIcon size={20} /></div>
                </div>
             </div>

             <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">Antrian Kurasi Produk Binaan</h3>
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1.5 bg-slate-100 rounded-lg font-bold text-slate-600">Semua</button>
                    <button className="text-xs px-3 py-1.5 bg-indigo-50 rounded-lg font-bold text-indigo-600">Menunggu</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Produk & Dinas</th>
                        <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Pemilik</th>
                        <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Harga</th>
                        <th className="px-6 py-4 text-center font-bold uppercase tracking-wider text-[10px]">Keputusan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                              <div>
                                <p className="font-bold text-slate-800">{p.name}</p>
                                <p className="text-[10px] font-bold text-indigo-600">{p.dinas}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium">Binaan ID #{p.ownerId}</td>
                          <td className="px-6 py-4 font-bold">Rp {p.price.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              {p.status === 'PENDING' ? (
                                <>
                                  <button onClick={() => updateProductStatus(p.id, 'APPROVED')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition shadow-sm"><CheckCircle size={18} /></button>
                                  <button onClick={() => updateProductStatus(p.id, 'CORRECTION')} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition shadow-sm"><MessageSquare size={18} /></button>
                                  <button onClick={() => updateProductStatus(p.id, 'DISAPPROVED')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm"><XCircle size={18} /></button>
                                </>
                              ) : (
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                  p.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>{p.status}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* --- PAYMENT MODAL SIMULATION --- */}
      {showPayment && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 text-center border-b border-slate-100 relative">
              <button onClick={() => setShowPayment(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-900"><XCircle size={24} /></button>
              <h3 className="text-xl font-bold text-slate-900">Pembayaran Terintegrasi</h3>
              <p className="text-xs text-slate-500">No. Transaksi: JH-{Math.floor(Math.random() * 90000) + 10000}</p>
            </div>
            <div className="p-8 flex flex-col items-center">
              <div className="w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 relative border-4 border-slate-50 p-2">
                {/* Simulated QR Code */}
                <div className="grid grid-cols-8 grid-rows-8 gap-0.5 w-full h-full opacity-70">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`w-full h-full ${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-transparent'}`}></div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center border border-slate-100">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">JH</div>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2 mb-8">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Bayar</p>
                <p className="text-3xl font-black text-slate-900">Rp {selectedProduct.price.toLocaleString()}</p>
                <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold text-xs bg-indigo-50 px-3 py-1 rounded-full">
                  <CheckCircle size={14} /> 
                  <span>Realtime Verification Active</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  alert('Pembayaran Berhasil! Tiket/Bukti telah dikirim ke WA Anda.');
                  setShowPayment(false);
                }}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
              >
                KONFIRMASI PEMBAYARAN <ArrowRight size={20} />
              </button>
              <div className="mt-6 flex gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png" className="h-4 object-contain opacity-50" />
                <div className="h-4 w-[1px] bg-slate-200"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Transfer & VA</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">J</div>
            <span className="font-bold text-slate-800">JogjaHub</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition">Koperasi & UKM</a>
            <a href="#" className="hover:text-indigo-600 transition">Pariwisata</a>
            <a href="#" className="hover:text-indigo-600 transition">Perhubungan</a>
            <a href="#" className="hover:text-indigo-600 transition">Kebudayaan</a>
            <a href="#" className="hover:text-indigo-600 transition">Kominfo</a>
          </div>
          <p className="text-xs text-slate-400">© 2024 Pemerintah Daerah Istimewa Yogyakarta</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
