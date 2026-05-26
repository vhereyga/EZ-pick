import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Siti Rahayu',
    role: 'Food Blogger',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'EZpick selalu menghadirkan cita rasa Indonesia yang otentik! Nasi Goreng Spesial-nya enak banget seperti buatan nenek. Sangat direkomendasikan!',
  },
  {
    name: 'Budi Santoso',
    role: 'Software Engineer',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'Sebagai yang sering kerja lembur, EZpick adalah penyelamat. Makanan selalu tiba hangat, es kopi susunya enak banget, dan pengirimannya cepat!',
  },
  {
    name: 'Dewi Kusuma',
    role: 'Graphic Designer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'Aplikasinya keren dan foto makanannya sesuai dengan yang diterima! Kue Lapis Legit-nya wajib dicoba — lembut, wangi, dan Worth every penny!',
  },
  {
    name: 'Ahmad Fauzi',
    role: 'Mahasiswa',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'Gratis ongkir mengubah hidup saya. Saya pesan Mie Goreng Seafood hampir setiap hari dan tidak pernah mengecewakan. Porsi besar dan harga terjangkau.',
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-stone-900/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(234,88,12,0.06)_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
            Testimoni
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Disukai oleh{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              12.000+
            </span>{' '}
            foodies
          </h2>
          <p className="text-white/45 max-w-xl mx-auto">
            Pelanggan nyata, ulasan nyata. Lihat kenapa orang Indonesia memilih EZpick setiap hari.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(({ name, role, avatar, rating, text }) => (
            <div
              key={name}
              className="group relative p-6 rounded-2xl bg-stone-950 border border-white/8 hover:border-amber-400/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
            >
              <Quote size={24} className="text-amber-400/30 mb-4" />

              <p className="text-white/60 text-sm leading-relaxed mb-6">
                "{text}"
              </p>

              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={avatar}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/30"
                />
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-white/35 text-xs">{role}</p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 mt-3">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
