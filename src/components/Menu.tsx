import { useState, useMemo } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { CategoryFilter } from './CategoryFilter';
import { ProductCard } from './ProductCard';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types';

type Category = 'all' | 'food' | 'drink' | 'dessert';

interface MenuProps {
  onAddToCart: (product: Product) => void;
}

export function Menu({ onAddToCart }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const { products, loading, error } = useProducts(activeCategory);

  const counts = useMemo(() => {
    const all = products;
    return {
      all: all.length,
      food: all.filter(p => p.category === 'food').length,
      drink: all.filter(p => p.category === 'drink').length,
      dessert: all.filter(p => p.category === 'dessert').length,
    };
  }, [products]);

  return (
    <section id="menu" className="py-24 bg-stone-950 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,rgba(251,191,36,0.04)_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
            Menu Kami
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Mau makan apa{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              hari ini?
            </span>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">
            Dari makanan berat hingga minuman menyegarkan — setiap hidangan dibuat dengan penuh cinta.
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-10">
          <CategoryFilter
            active={activeCategory}
            onChange={cat => setActiveCategory(cat)}
            counts={counts}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3 text-white/40">
              <Loader2 size={32} className="animate-spin text-amber-400" />
              <p className="text-sm">Memuat menu lezat...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3 text-white/40">
              <AlertCircle size={32} className="text-red-400" />
              <p className="text-sm">Gagal memuat menu. Silakan coba lagi.</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
