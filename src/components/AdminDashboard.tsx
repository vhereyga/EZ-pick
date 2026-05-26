import { useState, useEffect } from 'react';
import { X, Plus, CreditCard as Edit2, Trash2, Eye, TrendingUp, DollarSign, ShoppingBag, Package, Search, Loader2, AlertCircle, CheckCircle, Image } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

type TabType = 'overview' | 'products' | 'orders';

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [productsRes, ordersRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('id, total, status, delivery_location, created_at, order_items(quantity, price_at_purchase, products(name))').order('created_at', { ascending: false }).limit(50),
    ]);
    if (productsRes.data) setProducts(productsRes.data as Product[]);
    if (ordersRes.data) setOrders(ordersRes.data);
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      setMessage({ type: 'error', text: 'Gagal menghapus produk' });
    } else {
      setProducts(products.filter(p => p.id !== id));
      setMessage({ type: 'success', text: 'Produk berhasil dihapus' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) {
      setMessage({ type: 'error', text: 'Gagal mengupdate status pesanan' });
    } else {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      setMessage({ type: 'success', text: 'Status pesanan berhasil diupdate' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Ringkasan', icon: Eye },
    { id: 'products', label: 'Produk', icon: Package },
    { id: 'orders', label: 'Pesanan', icon: ShoppingBag },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-stone-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Dashboard Admin</h2>
            <p className="text-white/40 text-xs">Kelola produk & pesanan</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
        >
          Keluar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 py-3 border-b border-white/10 bg-stone-950">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as TabType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-amber-400/15 text-amber-400'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className={`mx-6 mt-4 flex items-center gap-2 p-3 rounded-xl ${
          message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Content */}
      <div className="h-[calc(100vh-140px)] overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={32} className="animate-spin text-amber-400" />
          </div>
        ) : activeTab === 'overview' ? (
          <OverviewTab stats={stats} />
        ) : activeTab === 'products' ? (
          <div className="space-y-4">
            {/* Search & Add */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-48">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-900 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
                />
              </div>
              <button
                onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-stone-900 font-semibold text-sm hover:bg-amber-300 transition-colors"
              >
                <Plus size={16} />
                Tambah Produk
              </button>
            </div>

            {/* Products grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="p-4 rounded-2xl bg-stone-900 border border-white/8 hover:border-white/15 transition-colors">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-xl mb-3"
                  />
                  <div className="space-y-1">
                    <p className="text-white font-medium text-sm truncate">{product.name}</p>
                    <p className="text-amber-400 font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span className={`px-2 py-0.5 rounded-full ${product.in_stock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {product.in_stock ? 'Tersedia' : 'Habis'}
                      </span>
                      <span className="capitalize">{product.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 text-xs transition-colors"
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition-colors"
                    >
                      <Trash2 size={12} />
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 text-white/40">
                <ShoppingBag size={40} className="mx-auto mb-3" />
                <p>Belum ada pesanan</p>
              </div>
            ) : (
              orders.map(order => {
                const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
                  pending: { label: 'Menunggu Konfirmasi', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
                  processing: { label: 'Sedang Diproses', bg: 'bg-blue-500/10', text: 'text-blue-400' },
                  shipped: { label: 'Sedang Diantar', bg: 'bg-purple-500/10', text: 'text-purple-400' },
                  completed: { label: 'Selesai', bg: 'bg-green-500/10', text: 'text-green-400' },
                  cancelled: { label: 'Dibatalkan', bg: 'bg-red-500/10', text: 'text-red-400' },
                };
                const cfg = statusConfig[order.status] || statusConfig.pending;

                return (
                  <div key={order.id} className="p-5 rounded-2xl bg-stone-900 border border-white/8 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-white font-bold text-base">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-white/40 text-xs mt-0.5">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-800/50 border border-white/5">
                      <p className="text-white/50 text-xs mb-1">Alamat Pengiriman</p>
                      <p className="text-white text-sm">{order.delivery_location || 'Tidak ada alamat'}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      {order.order_items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-white/60">
                          <span>{item.products?.name} x{item.quantity}</span>
                          <span className="text-white">Rp {item.price_at_purchase.toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-3 border-t border-white/10">
                      <span className="text-white/60">Total</span>
                      <span className="text-amber-400 font-bold text-base">Rp {order.total.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <p className="text-white/50 text-xs mb-2">Ubah Status Pesanan:</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: 'pending', label: 'Menunggu' },
                          { value: 'processing', label: 'Diproses' },
                          { value: 'shipped', label: 'Diantar' },
                          { value: 'completed', label: 'Selesai' },
                          { value: 'cancelled', label: 'Batal' },
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => updateOrderStatus(order.id, opt.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              order.status === opt.value
                                ? 'bg-amber-400 text-stone-900'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Product form modal */}
      <ProductFormModal
        isOpen={showProductForm}
        product={editingProduct}
        onClose={() => setShowProductForm(false)}
        onSave={async (productData) => {
          setSaving(true);
          if (editingProduct) {
            const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
            if (!error) {
              setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } as Product : p));
              setMessage({ type: 'success', text: 'Produk berhasil diupdate' });
            }
          } else {
            const { data, error } = await supabase.from('products').insert(productData).select();
            if (!error && data) {
              setProducts([data[0] as Product, ...products]);
              setMessage({ type: 'success', text: 'Produk berhasil ditambahkan' });
            }
          }
          setSaving(false);
          setShowProductForm(false);
          setTimeout(() => setMessage(null), 3000);
        }}
      />
    </div>
  );
}

function OverviewTab({ stats }: { stats: any }) {
  const cards = [
    { label: 'Total Produk', value: stats.totalProducts, icon: Package, color: 'from-amber-400 to-orange-500' },
    { label: 'Total Pesanan', value: stats.totalOrders, icon: ShoppingBag, color: 'from-sky-400 to-blue-500' },
    { label: 'Pendapatan', value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`, icon: DollarSign, color: 'from-green-400 to-emerald-500' },
    { label: 'Pesanan Pending', value: stats.pendingOrders, icon: TrendingUp, color: 'from-rose-400 to-red-500' },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="p-5 rounded-2xl bg-stone-900 border border-white/8">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
            <Icon size={22} className="text-white" />
          </div>
          <p className="text-white/40 text-xs mb-1">{label}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
}

function ProductFormModal({
  isOpen,
  product,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'food',
    image_url: '',
    badge: '',
    in_stock: true,
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image_url: product.image_url,
        badge: product.badge || '',
        in_stock: product.in_stock,
      });
    } else {
      setForm({ name: '', description: '', price: 0, category: 'food', image_url: '', badge: '', in_stock: true });
    }
  }, [product]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-stone-950 border border-white/10 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <form
          onSubmit={e => { e.preventDefault(); onSave(form); }}
          className="p-6 space-y-4"
        >
          <div className="space-y-2">
            <label className="text-white/70 text-sm">Nama Produk</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-white/70 text-sm">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 resize-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Harga (Rp)</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
                required
                min={0}
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Kategori</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
              >
                <option value="food">Makanan</option>
                <option value="drink">Minuman</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white/70 text-sm">URL Gambar</label>
            <div className="relative">
              <Image size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="url"
                value={form.image_url}
                onChange={e => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Badge (opsional)</label>
              <select
                value={form.badge}
                onChange={e => setForm({ ...form, badge: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
              >
                <option value="">Tidak ada</option>
                <option value="Terlaris">Terlaris</option>
                <option value="Populer">Populer</option>
                <option value="Baru">Baru</option>
                <option value="Trending">Trending</option>
                <option value="Premium">Premium</option>
                <option value="Rekomendasi Koki">Rekomendasi Koki</option>
                <option value="Musiman">Musiman</option>
                <option value="Favorit">Favorit</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Status</label>
              <select
                value={form.in_stock ? 'true' : 'false'}
                onChange={e => setForm({ ...form, in_stock: e.target.value === 'true' })}
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
              >
                <option value="true">Tersedia</option>
                <option value="false">Habis</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-stone-900 font-bold text-base shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {product ? 'Simpan Perubahan' : 'Tambah Produk'}
          </button>
        </form>
      </div>
    </div>
  );
}
