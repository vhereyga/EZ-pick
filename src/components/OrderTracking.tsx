import { useState, useEffect } from 'react';
import { X, Package, MapPin, Clock, CheckCircle, ChefHat, Truck, AlertCircle, Loader2, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface OrderTrackingProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusSteps = [
  { id: 'pending', label: 'Menunggu Konfirmasi', icon: Clock },
  { id: 'processing', label: 'Sedang Diproses', icon: ChefHat },
  { id: 'shipped', label: 'Sedang Diantar', icon: Truck },
  { id: 'completed', label: 'Selesai', icon: CheckCircle },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500 text-yellow-500',
  processing: 'bg-blue-500 text-blue-500',
  shipped: 'bg-purple-500 text-purple-500',
  completed: 'bg-green-500 text-green-500',
  cancelled: 'bg-red-500 text-red-500',
};

interface Order {
  id: string;
  total: number;
  status: string;
  delivery_location: string;
  created_at: string;
  order_items: {
    quantity: number;
    price_at_purchase: number;
    products: { name: string } | null;
  }[];
}

export function OrderTracking({ isOpen, onClose }: OrderTrackingProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders();
    }
  }, [isOpen, user]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(quantity, price_at_purchase, products(name))')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  const getStatusIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    const index = statusSteps.findIndex(s => s.id === status);
    return index;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-stone-950 border border-white/10 rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {selectedOrder ? 'Detail Pesanan' : 'Pesanan Saya'}
              </h2>
              <p className="text-white/40 text-xs">Lacak status pengiriman</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (selectedOrder) {
                setSelectedOrder(null);
              } else {
                onClose();
              }
            }}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 size={32} className="animate-spin text-amber-400" />
            </div>
          ) : selectedOrder ? (
            <div className="space-y-6">
              {/* Order ID */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/8">
                <p className="text-white/50 text-xs mb-1">Nomor Pesanan</p>
                <p className="text-amber-400 font-mono font-bold text-lg">
                  #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-white/40 text-xs mt-2">
                  {new Date(selectedOrder.created_at).toLocaleString('id-ID')}
                </p>
              </div>

              {/* Delivery Location */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-1">Alamat Pengiriman</p>
                    <p className="text-white text-sm">{selectedOrder.delivery_location || 'Belum diisi'}</p>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/8">
                <p className="text-white font-semibold mb-4">Status Pesanan</p>
                <div className="relative">
                  {selectedOrder.status === 'cancelled' ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                        <AlertCircle size={20} className="text-red-400" />
                      </div>
                      <div>
                        <p className="text-red-400 font-semibold">Pesanan Dibatalkan</p>
                        <p className="text-white/40 text-xs">Pesanan ini telah dibatalkan</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {statusSteps.map((step, index) => {
                        const currentIndex = getStatusIndex(selectedOrder.status);
                        const isActive = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                          <div key={step.id} className="flex items-center gap-4">
                            <div className="relative flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isActive
                                  ? `${statusColors[selectedOrder.status]} bg-opacity-20`
                                  : 'bg-stone-800'
                              }`}>
                                <step.icon size={18} className={isActive ? statusColors[selectedOrder.status].split(' ')[1] : 'text-white/30'} />
                              </div>
                              {index < statusSteps.length - 1 && (
                                <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
                                  index < currentIndex ? 'bg-green-500' : 'bg-stone-800'
                                }`} />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${isActive ? 'text-white' : 'text-white/40'}`}>
                                {step.label}
                              </p>
                              {isCurrent && (
                                <p className="text-xs text-amber-400">Sedang berlangsung</p>
                              )}
                            </div>
                            {isCurrent && (
                              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/8 space-y-3">
                <p className="text-white font-semibold">Item Pesanan</p>
                {selectedOrder.order_items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-white/70">{item.products?.name} x{item.quantity}</span>
                    <span className="text-white">Rp {item.price_at_purchase.toLocaleString('id-ID')}</span>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-white/10 flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-amber-400 font-bold">Rp {selectedOrder.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag size={48} className="text-white/20 mb-4" />
              <p className="text-white/50 font-medium">Belum ada pesanan</p>
              <p className="text-white/30 text-sm mt-1">Pesan sekarang untuk mulai</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="w-full p-4 rounded-2xl bg-stone-900 border border-white/8 hover:border-amber-400/30 transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-white/40 text-xs">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.status]
                        ? `${statusColors[order.status]}/20 ${statusColors[order.status].replace('bg-', 'text-')}`
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {order.status === 'pending' ? 'Menunggu' :
                       order.status === 'processing' ? 'Diproses' :
                       order.status === 'shipped' ? 'Diantar' :
                       order.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm truncate">{order.delivery_location}</p>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/8">
                    <span className="text-white/60 text-sm">{order.order_items?.length || 0} item</span>
                    <span className="text-amber-400 font-bold">Rp {order.total.toLocaleString('id-ID')}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
