import { useState } from 'react';
import { X, Mail, Lock, Shield, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLoginProps {
  onClose: () => void;
  onSwitchToUser: () => void;
}

export function AdminLogin({ onClose, onSwitchToUser }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    } else {
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-stone-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/30 mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Login Admin</h2>
          <p className="text-white/50 mt-1">Akses khusus untuk administrator</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-white/70 text-sm font-medium">Email Admin</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@ezpick.id"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-rose-400/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/70 text-sm font-medium">Kata Sandi Admin</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi admin"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-900 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-rose-400/50 transition-colors"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-base shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Shield size={18} />
                Masuk sebagai Admin
              </>
            )}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-stone-950 text-white/30 text-xs">atau</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onSwitchToUser}
            className="w-full py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all font-medium text-sm"
          >
            Login sebagai Pelanggan
          </button>
        </form>
      </div>
    </div>
  );
}
