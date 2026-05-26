import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Menu } from './components/Menu';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { Cart } from './components/Cart';
import { Toast } from './components/Toast';
import { Login } from './components/Login';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { Payment } from './components/Payment';
import { OrderTracking } from './components/OrderTracking';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useCart } from './hooks/useCart';
import type { Product } from './types';

type AuthModal = 'none' | 'user' | 'admin';

function AppContent() {
  const [activeSection, setActiveSection] = useState('hero');
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });
  const [authModal, setAuthModal] = useState<AuthModal>('none');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);

  const cart = useCart();
  const { user } = useAuth();

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      cart.addItem(product);
      setToast({ message: `${product.name} ditambahkan ke keranjang!`, visible: true });
    },
    [cart]
  );

  const handleDismissToast = useCallback(() => {
    setToast(t => ({ ...t, visible: false }));
  }, []);

  const handleCheckout = useCallback(() => {
    if (!user) {
      setAuthModal('user');
      cart.setIsOpen(false);
      return;
    }
    cart.setIsOpen(false);
    setShowPayment(true);
  }, [user, cart]);

  const handlePaymentSuccess = useCallback(() => {
    cart.clearCart();
    setShowPayment(false);
    setShowOrderTracking(true);
    setToast({ message: 'Pesanan berhasil! Terima kasih telah berbelanja di EZpick.', visible: true });
  }, [cart]);

  return (
    <div className="min-h-screen bg-stone-950 font-sans">
      <Navbar
        cartCount={cart.count}
        onCartOpen={() => cart.setIsOpen(true)}
        activeSection={activeSection}
        onNavClick={scrollToSection}
        onLogin={() => setAuthModal('user')}
        onAdminDashboard={() => setShowAdminDashboard(true)}
        onOrderTracking={() => setShowOrderTracking(true)}
      />

      <main>
        <Hero onOrderNow={() => scrollToSection('menu')} />
        <Menu onAddToCart={handleAddToCart} />
        <Features />
        <Testimonials />
      </main>

      <Footer />

      <Cart
        isOpen={cart.isOpen}
        items={cart.items}
        total={cart.total}
        onClose={() => cart.setIsOpen(false)}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
        onCheckout={handleCheckout}
      />

      <Payment
        isOpen={showPayment}
        items={cart.items}
        total={cart.total}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />

      <OrderTracking
        isOpen={showOrderTracking}
        onClose={() => setShowOrderTracking(false)}
      />

      {authModal === 'user' && (
        <Login
          onClose={() => setAuthModal('none')}
          onSwitchToAdmin={() => setAuthModal('admin')}
        />
      )}

      {authModal === 'admin' && (
        <AdminLogin
          onClose={() => setAuthModal('none')}
          onSwitchToUser={() => setAuthModal('user')}
        />
      )}

      {showAdminDashboard && (
        <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
      )}

      <Toast
        message={toast.message}
        visible={toast.visible}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
