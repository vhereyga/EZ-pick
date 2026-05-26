import { useRef, useEffect } from 'react';
import { ArrowRight, Star, Clock, Shield, ChevronDown } from 'lucide-react';

interface HeroProps {
  onOrderNow: () => void;
}

export function Hero({ onOrderNow }: HeroProps) {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(${x * 1.2}px, ${y * 1.2}px)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${x * -0.8}px, ${y * -0.8}px)`;
      }
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1200px) rotateY(${x * 0.08}deg) rotateX(${-y * 0.06}deg) translateZ(10px)`;
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-stone-950"
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(251,191,36,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(234,88,12,0.10)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_80%,rgba(12,10,9,1)_100%)]" />
      </div>

      {/* Animated orbs */}
      <div
        ref={orb1Ref}
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl transition-transform duration-700 ease-out pointer-events-none"
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-orange-500/8 blur-3xl transition-transform duration-700 ease-out pointer-events-none"
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/8 text-amber-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Pesan Sekarang, Siap dalam 15 menit
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
                Makanan Segar,{' '}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    Diantar
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-60" />
                </span>{' '}
                <br className="hidden sm:block" />
                Dengan Cepat
              </h1>
              <p className="text-lg text-white/55 max-w-lg leading-relaxed">
                Nikmati aneka hidangan lezat Indonesia — makanan tradisional, minuman segar, dan dessert spesial langsung ke pintu Anda.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onOrderNow}
                className="group flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-stone-900 font-bold text-base shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Pesan Sekarang
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-2 px-7 py-4 rounded-2xl border border-white/15 text-white font-semibold text-base hover:bg-white/8 hover:border-white/25 transition-all duration-200">
                Lihat Menu
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: Star, value: '4.9/5', label: '12K+ Ulasan' },
                { icon: Clock, value: '15 min', label: 'Rata-rata Pengiriman' },
                { icon: Shield, value: '100%', label: 'Terjamin Aman' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{value}</div>
                    <div className="text-white/40 text-xs">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 3D floating card */}
          <div className="flex justify-center lg:justify-end">
            <div
              ref={cardRef}
              className="relative w-full max-w-md transition-transform duration-200 ease-out"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Main food card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10">
                <img
                  src="https://images.pexels.com/photos/5835353/pexels-photo-5835353.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Nasi Goreng Spesial"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">
                        Terlaris
                      </p>
                      <h3 className="text-white text-xl font-bold">Nasi Goreng Spesial</h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-white/60 text-xs">2,341 ulasan</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 text-2xl font-black">Rp 25.000</p>
                      <button
                        onClick={onOrderNow}
                        className="mt-2 px-4 py-1.5 rounded-xl bg-amber-400 text-stone-900 text-xs font-bold hover:bg-amber-300 transition-colors"
                      >
                        Tambah ke Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating tags */}
              <div
                className="absolute -top-4 -left-4 px-4 py-2 rounded-2xl bg-stone-900/90 backdrop-blur-xl border border-white/10 shadow-xl"
                style={{ transform: 'translateZ(30px)' }}
              >
                <p className="text-white text-xs font-medium">🔥 Trending Hari Ini</p>
              </div>
              <div
                className="absolute -bottom-4 -right-4 px-4 py-2 rounded-2xl bg-green-500/20 backdrop-blur-xl border border-green-400/30 shadow-xl"
                style={{ transform: 'translateZ(40px)' }}
              >
                <p className="text-green-400 text-xs font-semibold">✓ Pesanan Berhasil!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs uppercase tracking-widest">Gulir</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
}
