import { useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import type { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export function Cart({
  isOpen,
  items,
  total,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-stone-950 border-l border-white/8 shadow-2xl transition-transform duration-400 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-amber-400" />
            <h2 className="text-white font-bold text-lg">Pesanan Anda</h2>
            {items.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 text-xs font-semibold">
                {items.length} item
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center pt-16">
              <div className="w-20 h-20 rounded-2xl bg-stone-900 border border-white/8 flex items-center justify-center">
                <ShoppingBag size={32} className="text-white/20" />
              </div>
              <div>
                <p className="text-white/50 font-medium">Keranjang Anda kosong</p>
                <p className="text-white/25 text-sm mt-1">Tambahkan beberapa hidangan lezat!</p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 text-sm font-medium hover:bg-amber-400/25 transition-colors"
              >
                Lihat Menu
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3 rounded-2xl bg-stone-900 border border-white/6 hover:border-white/12 transition-colors"
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white font-medium text-sm leading-snug line-clamp-2">
                      {item.product.name}
                    </p>
                    <button
                      onClick={() => onRemove(item.product.id)}
                      className="flex-shrink-0 text-white/25 hover:text-red-400 transition-colors mt-0.5"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-amber-400 font-bold text-sm">
                      Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-white text-sm font-semibold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-amber-400/20 hover:bg-amber-400/40 flex items-center justify-center text-amber-400 transition-colors"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-white/8 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/50">
                <span>Subtotal</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-white/50">
                <span>Pengiriman</span>
                <span className="text-green-400">Gratis</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/8">
                <span>Total</span>
                <span className="text-amber-400">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-stone-900 font-bold text-base shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Checkout
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
