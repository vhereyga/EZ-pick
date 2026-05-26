import { useState } from 'react';
import { X, CreditCard, Wallet, Building, Smartphone, CheckCircle, Loader2, AlertCircle, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CartItem } from '../types';

interface PaymentProps {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

const methods = [
  { id: 'cash', label: 'Bayar di Tempat (COD)', icon: Wallet, desc: 'Bayar saat pesanan tiba' },
  { id: 'transfer', label: 'Transfer Bank', icon: Building, desc: 'BCA, Mandiri, BNI, BRI' },
  { id: 'ewallet', label: 'E-Wallet', icon: Smartphone, desc: 'GoPay, OVO, DANA, ShopeePay' },
  { id: 'card', label: 'Kartu Kredit/Debit', icon: CreditCard, desc: 'Visa, Mastercard, JCB' },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Menunggu Konfirmasi', color: 'bg-yellow-500/20 text-yellow-400' },
  processing: { label: 'Sedang Diproses', color: 'bg-blue-500/20 text-blue-400' },
  shipped: { label: 'Sedang Diantar', color: 'bg-purple-500/20 text-purple-400' },
  completed: { label: 'Selesai', color: 'bg-green-500/20 text-green-400' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-500/20 text-red-400' },
};

export function Payment({ isOpen, items, total, onClose, onSuccess }: PaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState('cash');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!deliveryLocation.trim()) {
      setError('Mohon masukkan alamat pengiriman');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Anda harus login terlebih dahulu');

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total,
          status: 'pending',
          delivery_location: deliveryLocation.trim()
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_purchase: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const { error: paymentError } = await supabase
        .from('payments')
        .insert({ order_id: order.id, method: selectedMethod, amount: total, status: 'pending' });

      if (paymentError) throw paymentError;

      setOrderId(order.id);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memproses pesanan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-stone-950 border-t sm:border border-white/10 sm:rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-5 border-b border-white/10 bg-stone-950 z-10">
          <h2 className="text-xl font-bold text-white">Pembayaran</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Pesanan Berhasil!</h3>
            <p className="text-white/50 text-sm text-center">
              Pesanan Anda sedang diproses. Lacak status pesanan Anda di halaman pesanan.
            </p>
            <div className="p-4 rounded-xl bg-stone-900 border border-white/10 w-full">
              <p className="text-white/50 text-xs mb-1">Nomor Pesanan</p>
              <p className="text-amber-400 font-mono font-bold">#{orderId?.slice(0, 8).toUpperCase()}</p>
            </div>
            <button
              onClick={() => {
                setSuccess(false);
                onSuccess(orderId!);
              }}
              className="w-full py-3 rounded-xl bg-amber-400 text-stone-900 font-bold text-sm hover:bg-amber-300 transition-colors"
            >
              Lihat Pesanan Saya
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Delivery Location */}
            <div className="space-y-2">
              <label className="text-white font-semibold text-sm flex items-center gap-2">
                <MapPin size={14} className="text-amber-400" />
                Alamat Pengiriman
              </label>
              <textarea
                value={deliveryLocation}
                onChange={e => setDeliveryLocation(e.target.value)}
                placeholder="Masukkan alamat lengkap Anda: nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, kode pos..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 resize-none text-sm"
                required
              />
            </div>

            {/* Order summary */}
            <div className="p-4 rounded-2xl bg-stone-900 border border-white/8 space-y-3">
              <h3 className="text-white font-semibold">Ringkasan Pesanan</h3>
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-white/50 text-xs">{item.quantity}x</p>
                  </div>
                  <p className="text-amber-400 text-sm font-semibold">
                    Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
              <div className="pt-3 border-t border-white/10 flex justify-between">
                <span className="text-white/60 text-sm">Total</span>
                <span className="text-amber-400 font-bold text-lg">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Pilih Metode Pembayaran</h3>
              <div className="space-y-2">
                {methods.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedMethod(id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      selectedMethod === id
                        ? 'bg-amber-400/10 border-amber-400/30'
                        : 'bg-stone-900 border-white/8 hover:border-white/15'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedMethod === id ? 'bg-amber-400/20' : 'bg-white/5'
                    }`}>
                      <Icon size={18} className={selectedMethod === id ? 'text-amber-400' : 'text-white/50'} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-medium ${selectedMethod === id ? 'text-amber-400' : 'text-white'}`}>
                        {label}
                      </p>
                      <p className="text-white/40 text-xs">{desc}</p>
                    </div>
                    {selectedMethod === id && (
                      <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                        <CheckCircle size={14} className="text-stone-900" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-stone-900 font-bold text-base shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Bayar Sekarang
                </>
              )}
            </button>

            <p className="text-center text-white/30 text-xs">
              Pesanan aman dan terenkripsi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
