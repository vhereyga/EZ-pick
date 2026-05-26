import { Zap, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Zap size={18} className="text-white fill-white" />
              </div>
              <span className="text-xl font-black text-white">
                EZ<span className="text-amber-400">pick</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Platform pesan antar F&B terbaik Indonesia. Segar, cepat, dan selalu lezat.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl bg-stone-900 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 hover:bg-stone-800 transition-all"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-5">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">
              Tautan Cepat
            </h4>
            <ul className="space-y-3">
              {['Menu', 'Tentang Kami', 'Karir', 'Blog', 'Jadi Mitra'].map(link => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/40 text-sm hover:text-amber-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-5">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">
              Bantuan
            </h4>
            <ul className="space-y-3">
              {['Pusat Bantuan', 'Lacak Pesanan', 'Kebijakan Refund', 'Kebijakan Privasi', 'Syarat & Ketentuan'].map(link => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/40 text-sm hover:text-amber-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">
              Kontak
            </h4>
            <ul className="space-y-4">
              {[
                { icon: Mail, text: 'halo@ezpick.id' },
                { icon: Phone, text: '+62 21-1234-5678' },
                { icon: MapPin, text: 'Jakarta, Indonesia' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-900 border border-white/8 flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-amber-400" />
                  </div>
                  <span className="text-white/40 text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-sm">
            &copy; 2026 EZpick. Semua hak dilindungi.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/25 text-xs">Sistem berjalan normal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
