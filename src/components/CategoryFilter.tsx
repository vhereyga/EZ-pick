import { UtensilsCrossed, Coffee, IceCream } from 'lucide-react';

type Category = 'all' | 'food' | 'drink' | 'dessert';

interface CategoryFilterProps {
  active: Category;
  onChange: (cat: Category) => void;
  counts: Record<string, number>;
}

const categories: { id: Category; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'Semua', icon: UtensilsCrossed },
  { id: 'food', label: 'Makanan', icon: UtensilsCrossed },
  { id: 'drink', label: 'Minuman', icon: Coffee },
  { id: 'dessert', label: 'Dessert', icon: IceCream },
];

export function CategoryFilter({ active, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-sm transition-all duration-200 ${
            active === id
              ? 'bg-amber-400 border-amber-400 text-stone-900 shadow-lg shadow-amber-500/30 scale-105'
              : 'bg-stone-900 border-white/10 text-white/60 hover:border-white/25 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Icon size={15} />
          {label}
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              active === id ? 'bg-stone-900/20' : 'bg-white/8'
            }`}
          >
            {counts[id] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}
