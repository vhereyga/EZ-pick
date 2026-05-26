import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Zap, LogIn, LogOut, User, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
  activeSection: string;
  onNavClick: (section: string) => void;
  onLogin: () => void;
  onAdminDashboard: () => void;
  onOrderTracking: () => void;
}

const navLinks = [
  { id: 'hero', label: 'Beranda' },
  { id: 'menu', label: 'Menu' },
  { id: 'features', label: 'Keunggulan' },
  { id: 'testimonials', label: 'Testimoni' },
];

export function Navbar({ cartCount, onCartOpen, activeSection, onNavClick, onLogin, onAdminDashboard, onOrderTracking }: NavbarProps) {
  const { user, isAdmin, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    onNavClick(id);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-stone-950/95 backdrop-blur-xl shadow-2xl shadow-black/40 border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <button
            onClick={() => handleNav('hero')}
            className="flex items-center gap-2 group"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/60 transition-all duration-300 group-hover:scale-110">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              EZ<span className="text-amber-400">pick</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === link.id
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-white/70 hover:text-white hover:bg-white/8'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCartOpen}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/30"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Keranjang</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {user && !isAdmin && (
              <button
                onClick={onOrderTracking}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors"
              >
                <Package size={16} />
                Pesanan
              </button>
            )}

            {isAdmin && (
              <button
                onClick={onAdminDashboard}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-400 text-sm font-medium hover:bg-rose-500/30 transition-colors"
              >
                <User size={16} />
                Admin
              </button>
            )}

            {user ? (
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/8 border border-white/10 text-white/80 hover:text-white hover:bg-white/15 text-sm transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/8 border border-white/10 text-white/80 hover:text-white hover:bg-white/15 text-sm transition-colors"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Masuk</span>
              </button>
            )}

            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-stone-950/98 backdrop-blur-xl border-t border-white/5 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === link.id
                  ? 'text-amber-400 bg-amber-400/10'
                  : 'text-white/70 hover:text-white hover:bg-white/8'
              }`}
            >
              {link.label}
            </button>
          ))}
          {user && !isAdmin && (
            <button
              onClick={() => { onOrderTracking(); setMobileOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-400/10 transition-colors"
            >
              Pesanan Saya
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => { onAdminDashboard(); setMobileOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-400/10 transition-colors"
            >
              Dashboard Admin
            </button>
          )}
          <div className="border-t border-white/10 mt-2 pt-2">
            {user ? (
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 transition-colors"
              >
                Keluar
              </button>
            ) : (
              <button
                onClick={() => { onLogin(); setMobileOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 transition-colors"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
