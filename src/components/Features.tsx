import { Clock, Shield, Star, Truck, ChefHat, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Pengiriman 15 Menit',
    desc: 'Makanan hangat di depan pintu Anda dalam hitungan menit. Kurir kami selalu siap.',
    color: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-500/20',
  },
  {
    icon: Shield,
    title: 'Kualitas Terjamin',
    desc: 'Setiap produk dijamin kebersihan dan kualitasnya. Diproses dengan standar higiene tinggi.',
    color: 'from-green-400 to-emerald-500',
    glow: 'shadow-green-500/20',
  },
  {
    icon: Star,
    title: 'Penjual Terpilih',
    desc: 'Semua mitra kuliner kami diseleksi ketat dengan rating minimal 4.5 bintang.',
    color: 'from-sky-400 to-blue-500',
    glow: 'shadow-sky-500/20',
  },
  {
    icon: Truck,
    title: 'Gratis Ongkir',
    desc: 'Nikmati gratis ongkir untuk semua pesanan. Tanpa biaya tersembunyi.',
    color: 'from-rose-400 to-red-500',
    glow: 'shadow-rose-500/20',
  },
  {
    icon: ChefHat,
    title: 'Pilihan Chef',
    desc: 'Menu dirancang oleh chef profesional untuk pengalaman kuliner terbaik.',
    color: 'from-orange-400 to-amber-500',
    glow: 'shadow-orange-500/20',
  },
  {
    icon: Smartphone,
    title: 'Lacak Pesanan',
    desc: 'Lacak pesanan Anda secara real-time dari dapur hingga ke depan pintu.',
    color: 'from-teal-400 to-cyan-500',
    glow: 'shadow-teal-500/20',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-stone-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(251,191,36,0.04)_0%,transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
            Kenapa EZpick
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Semua yang Anda butuhkan,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              dengan cara EZ
            </span>
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            Kami memikirkan setiap detail sehingga Anda tidak perlu repot.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color, glow }) => (
            <div
              key={title}
              className={`group relative p-6 rounded-2xl bg-stone-900 border border-white/8 hover:border-white/15 transition-all duration-300 hover:shadow-2xl ${glow} hover:-translate-y-1`}
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-5`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
