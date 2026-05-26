import { useRef } from 'react';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const badgeColors: Record<string, string> = {
  'Terlaris': 'bg-amber-400/20 text-amber-400 border-amber-400/30',
  'Populer': 'bg-blue-400/20 text-blue-400 border-blue-400/30',
  'Baru': 'bg-green-400/20 text-green-400 border-green-400/30',
  'Trending': 'bg-rose-400/20 text-rose-400 border-rose-400/30',
  'Premium': 'bg-violet-400/20 text-violet-400 border-violet-400/30',
  'Rekomendasi Koki': 'bg-orange-400/20 text-orange-400 border-orange-400/30',
  'Musiman': 'bg-teal-400/20 text-teal-400 border-teal-400/30',
  'Favorit': 'bg-pink-400/20 text-pink-400 border-pink-400/30',
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateZ(6px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  const badgeClass = product.badge ? (badgeColors[product.badge] ?? 'bg-white/10 text-white/60 border-white/15') : '';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl overflow-hidden bg-stone-900 border border-white/8 shadow-xl transition-all duration-300 hover:border-amber-400/30 hover:shadow-amber-500/10 hover:shadow-2xl cursor-pointer"
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out, box-shadow 0.3s, border-color 0.3s' }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg border text-xs font-semibold backdrop-blur-sm ${badgeClass}`}>
            {product.badge}
          </div>
        )}

        {/* Quick add overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-stone-900 font-bold text-sm shadow-2xl shadow-amber-500/40 hover:bg-amber-300 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-200"
          >
            <ShoppingCart size={15} />
            Tambah Cepat
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-semibold text-base leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-white/45 text-xs mt-1 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={
                  i < Math.round(product.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-white/20 fill-white/20'
                }
              />
            ))}
          </div>
          <span className="text-white/50 text-xs">
            {product.rating} ({product.review_count.toLocaleString()})
          </span>
        </div>

        {/* Price & Add */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-amber-400 font-black text-lg">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          <button
            onClick={() => onAddToCart(product)}
            className="w-9 h-9 rounded-xl bg-amber-400/15 hover:bg-amber-400 border border-amber-400/30 hover:border-amber-400 flex items-center justify-center text-amber-400 hover:text-stone-900 transition-all duration-200 hover:scale-110 active:scale-90"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
