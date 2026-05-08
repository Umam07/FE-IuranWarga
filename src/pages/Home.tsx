import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import api from '../utils/api';

// ─── Stat Counter Animation ────────────────────────────────────────────────
const AnimatedCounter = ({ target, prefix = '', suffix = '', duration = 2 }: { target: number; prefix?: string; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString('id-ID')}{suffix}</span>;
};

// ─── Ticker Marquee ────────────────────────────────────────────────────────
const Ticker = () => {
  const items = [
    '🟢 KONDISI LINGKUNGAN: MANTAP',
    '📅 KERJA BAKTI: 24 OKTOBER',
    '💰 SALDO KAS: RP 58.3 JUTA',
    '🏠 WARGA AKTIF: 247 KK',
    '✅ TINGKAT IURAN: 84%',
    '🌿 PENGHIJAWAN: SELESAI',
  ];
  return (
    <div className="overflow-hidden bg-nb-yellow border-y-4 border-black py-4 relative z-20">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="flex gap-20 whitespace-nowrap"
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-black text-xl font-black tracking-tighter uppercase">{item}</span>
        ))}
      </motion.div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────
const Home = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'semua' | 'pengumuman' | 'jadwal'>('semua');
  
  // Agenda Attendance State
  const [hasConfirmed, setHasConfirmed] = useState(() => {
    return localStorage.getItem('agenda_confirmed') === 'true';
  });
  const [attendeeCount, setAttendeeCount] = useState(128);

  useEffect(() => {
    if (hasConfirmed) {
      setAttendeeCount(129); // Mock increment if already confirmed
      localStorage.setItem('agenda_confirmed', 'true');
    }
  }, [hasConfirmed]);

  const handleConfirmAttendance = () => {
    if (!hasConfirmed) {
      setAttendeeCount(prev => prev + 1);
      setHasConfirmed(true);
    }
  };
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.get('/pengumuman');
        setNotices(response.data);
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await api.get(`/warga/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      setSearchResults([]); 
    } finally {
      setIsSearching(false);
    }
  };

  const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show:   { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  } as const;

  const filteredNotices = notices.filter(n => {
    if (activeTab === 'semua') return true;
    if (activeTab === 'jadwal') return n.category === 'jadwal';
    return n.category !== 'jadwal';
  });

  return (
    <div
      className="bg-nb-cream text-black antialiased min-h-screen selection:bg-nb-yellow selection:text-black"
      style={{ fontFamily: "'Inter', 'Lexend', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #fef6e4; border-left: 3px solid black; }
        ::-webkit-scrollbar-thumb { background: black; border: 2px solid black; }
        ::-webkit-scrollbar-thumb:hover { background: #ff5c00; }
      `}</style>

      {/* NAV */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b-4 border-black bg-white"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 border-3 border-black bg-nb-purple flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined text-white text-[20px] font-bold">cleaning_services</span>
            </div>
            <span style={{ fontFamily: 'Lexend, sans-serif' }} className="font-black text-xl text-black tracking-tight">
              Warga<span className="bg-nb-yellow px-1">Bersih</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Layanan', 'Keuangan', 'Jadwal', 'Bantuan'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm font-black text-black hover:text-nb-orange transition-colors tracking-wide underline decoration-4 decoration-nb-blue underline-offset-4">
                {item}
              </a>
            ))}
          </div>
          <motion.a
            whileHover={{ scale: 1.05, x: -2, y: -2 }}
            whileTap={{ scale: 0.95, x: 2, y: 2 }}
            href="#/login"
            className="flex items-center gap-2 px-6 py-2.5 border-3 border-black bg-nb-orange font-black text-sm text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] font-bold">lock</span>
            Login Pengurus
          </motion.a>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=2000"
            alt="Perumahan"
            className="w-full h-full object-cover grayscale opacity-20"
          />
          <div className="absolute inset-0 bg-nb-cream/40" />
        </motion.div>
        
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-nb-blue/20 border-4 border-black rotate-12 -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-nb-pink/20 border-4 border-black -rotate-6 -z-10" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 mb-8 px-6 py-2 border-3 border-black bg-nb-white font-black text-xs uppercase tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <span className="w-2 h-2 bg-nb-green border border-black animate-ping" />
            Portal Transparansi Warga
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Lexend, sans-serif' }}
            className="text-6xl md:text-[7.5rem] font-[900] text-black leading-[0.85] tracking-tighter mb-8 uppercase"
          >
            LINGKUNGAN<br />
            <span className="bg-nb-yellow border-4 border-black px-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block my-2 italic">TRANSPARAN.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-black text-xl md:text-2xl font-black mb-12 max-w-2xl mx-auto leading-tight italic"
          >
            Pantau status iuran, riwayat pembayaran, dan informasi terkini perumahan
            dalam satu tampilan yang jujur dan blak-blakan.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleSearch}
            className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-3 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto"
          >
            <div className="flex-1 flex items-center gap-3 px-4 bg-nb-cream border-2 border-black">
              <span className="material-symbols-outlined text-black font-bold">search</span>
              <input
                className="w-full py-4 bg-transparent border-none focus:outline-none text-black text-lg placeholder:text-black/50 font-black"
                placeholder="CARI NAMA ATAU NO. RUMAH..."
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02, x: -2, y: -2 }}
              whileTap={{ scale: 0.98, x: 2, y: 2 }}
              type="submit"
              disabled={isSearching}
              className="bg-nb-blue border-4 border-black px-10 py-4 font-black text-lg text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {isSearching
                ? <><span className="material-symbols-outlined animate-spin font-bold">sync</span>MENCARI...</>
                : <><span className="material-symbols-outlined font-bold">manage_search</span>CEK STATUS</>
              }
            </motion.button>
          </motion.form>
        </motion.div>
      </section>

      <Ticker />

      {/* SEARCH RESULTS */}
      <AnimatePresence>
        {searchResults !== null && (
          <motion.section
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-4xl mx-auto px-6 py-12 relative z-20 -mt-6"
          >
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="flex justify-between items-center px-7 py-5 border-b-4 border-black bg-nb-blue">
                <h3 className="font-[900] text-black flex items-center gap-2.5 text-xl uppercase italic" style={{ fontFamily: 'Lexend, sans-serif' }}>
                  <span className="material-symbols-outlined font-bold">manage_search</span>
                  HASIL PENCARIAN
                </h3>
                <button onClick={() => setSearchResults(null)}
                  className="text-black hover:bg-nb-pink p-2 border-2 border-black transition-colors">
                  <span className="material-symbols-outlined font-bold">close</span>
                </button>
              </div>
              <div className="p-7 max-h-[600px] overflow-y-auto space-y-6 bg-nb-cream">
                {searchResults.length === 0 ? (
                  <div className="text-center py-16 border-4 border-dashed border-black bg-white">
                    <p className="font-black text-xl text-black">TIDAK DITEMUKAN!</p>
                  </div>
                ) : searchResults.map((warga, index) => {
                  const paid = warga.payments.filter((p: any) => p.status === 'paid').length;
                  const pct = Math.round((paid / warga.payments.length) * 100);
                  return (
                    <div key={warga.id} className="border-4 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 border-4 border-black flex items-center justify-center font-[900] text-3xl text-black bg-nb-green">
                            {warga.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-2xl text-black uppercase" style={{ fontFamily: 'Lexend, sans-serif' }}>{warga.name}</h4>
                            <div className="mt-2 flex gap-3">
                              <span className="bg-nb-yellow border-2 border-black px-3 py-1 text-xs font-black italic">{warga.home}</span>
                              <span className="bg-nb-purple text-white border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest">{warga.role}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black text-white px-6 py-2 border-2 border-black">
                          <div className="text-4xl font-[900] italic" style={{ fontFamily: 'Lexend, sans-serif' }}>{pct}%</div>
                          <div className="text-[10px] font-black uppercase">LUNAS</div>
                        </div>
                      </div>
                      <div className="h-6 border-4 border-black bg-nb-cream overflow-hidden">
                        <div className={`h-full border-r-4 border-black ${pct >= 80 ? 'bg-nb-green' : 'bg-nb-pink'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

     {/* STATS */}
<section className="max-w-7xl mx-auto px-6 py-16" id="layanan">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    {[
      { label: 'WARGA AKTIF',   value: 247,  suffix: ' KK',  icon: 'groups',          color: 'bg-nb-blue' },
      { label: 'TINGKAT IURAN', value: 84,   suffix: '%',    icon: 'trending_up',     color: 'bg-nb-green' },
      { label: 'SALDO KAS',     value: 58.3, suffix: ' JT',  icon: 'account_balance', color: 'bg-nb-purple', prefix: 'RP ' },
      { label: 'AGENDA AKTIF',  value: 5,    suffix: ' ITEM', icon: 'event',          color: 'bg-nb-yellow' },
    ].map((s, i) => (
      <motion.div 
        key={i} 
        variants={itemVariants} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, amount: 0.2 }}
        // PERUBAHAN DI SINI: Ganti transition-all dengan transition-shadow, tambahkan transform-gpu
        className="bg-white border-4 border-black p-6 flex flex-col gap-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300 transform-gpu will-change-transform"
      >
        <div className={`w-14 h-14 border-4 border-black ${s.color} flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
          <span className="material-symbols-outlined text-black text-[28px] font-bold">{s.icon}</span>
        </div>
        <div>
          <div className="text-4xl font-[900] text-black italic" style={{ fontFamily: 'Lexend, sans-serif' }}>
            <AnimatedCounter target={s.value} prefix={s.prefix ?? ''} suffix={s.suffix} />
          </div>
          <div className="text-sm font-black text-black/60 mt-1 uppercase tracking-widest">{s.label}</div>
        </div>
      </motion.div>
    ))}
  </div>
</section>

      {/* MAIN GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Finance Card */}
          <div id="keuangan" className="md:col-span-7 border-4 border-black p-8 relative overflow-hidden bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nb-blue/10 border-4 border-black rotate-12 translate-x-1/2 -translate-y-1/2" />
            <p className="bg-nb-yellow border-2 border-black inline-block px-3 py-1 font-black text-xs uppercase mb-6">RINGKASAN KEUANGAN</p>
            <h2 className="text-5xl font-[900] text-black italic mb-10" style={{ fontFamily: 'Lexend, sans-serif' }}>TRANSPARANSI DANA</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
              <div className="border-4 border-black p-6 bg-nb-green shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-black text-xs uppercase mb-2">PEMASUKAN</p>
                <p className="text-3xl font-[900]" style={{ fontFamily: 'Lexend, sans-serif' }}>RP 142.5 JT</p>
              </div>
              <div className="border-4 border-black p-6 bg-nb-pink shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-black text-xs uppercase mb-2">PENGELUARAN</p>
                <p className="text-3xl font-[900]" style={{ fontFamily: 'Lexend, sans-serif' }}>RP 84.2 JT</p>
              </div>
            </div>

            <div className="bg-nb-cream p-6 border-4 border-black mb-8">
              <div className="flex justify-between font-black text-xs mb-3 italic uppercase">
                <span>RASIO PENGELUARAN</span>
                <span>59.2%</span>
              </div>
              <div className="h-8 border-4 border-black bg-white">
                <div className="h-full bg-nb-blue border-r-4 border-black" style={{ width: '59.2%' }} />
              </div>
            </div>

            <div className="border-4 border-black bg-nb-purple text-white p-8 flex flex-col md:flex-row justify-between items-center gap-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <p className="font-black text-xs uppercase opacity-70">SALDO KAS AKTIF</p>
                <p className="text-4xl font-[900] italic" style={{ fontFamily: 'Lexend, sans-serif' }}>RP 58.300.000</p>
              </div>
              <button className="bg-white text-black border-4 border-black px-8 py-4 font-black uppercase hover:bg-nb-yellow transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                LIHAT DETAIL
              </button>
            </div>
          </div>

          {/* Agenda Card */}
          <div className="md:col-span-5 border-4 border-black p-8 bg-nb-orange text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
            
            <span className="bg-white text-black border-2 border-black px-4 py-2 font-black text-xs uppercase mb-8 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">AGENDA MENDATANG</span>
            <h3 className="text-4xl font-[900] italic mb-6 leading-tight uppercase" style={{ fontFamily: 'Lexend, sans-serif' }}>KERJA BAKTI AKBAR & PENGHIJAUAN</h3>
            <p className="text-xl font-black mb-8 leading-tight">WAKTU: MINGGU, 24 OKT<br />LOKASI: TAMAN PUSAT</p>
            
            {/* Attendance Counter */}
            <div className="bg-black/20 border-2 border-white/30 p-4 mb-8 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['A', 'B', 'C', 'D'].map((initial, i) => (
                    <div key={i} className={`w-10 h-10 border-2 border-black flex items-center justify-center font-black text-sm
                      ${i === 0 ? 'bg-nb-yellow' : i === 1 ? 'bg-nb-blue' : i === 2 ? 'bg-nb-pink' : 'bg-nb-green'} text-black`}>
                      {initial}
                    </div>
                  ))}
                  <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center font-black text-black text-[10px]">
                    +{attendeeCount - 4}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-[900] italic leading-none">{attendeeCount}</div>
                  <div className="text-[10px] font-black uppercase tracking-wider opacity-80">WARGA SIAP HADIR</div>
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: hasConfirmed ? 1 : 1.02, x: hasConfirmed ? 0 : -2, y: hasConfirmed ? 0 : -2 }}
              whileTap={{ scale: hasConfirmed ? 1 : 0.98, x: hasConfirmed ? 0 : 2, y: hasConfirmed ? 0 : 2 }}
              onClick={handleConfirmAttendance}
              disabled={hasConfirmed}
              className={`w-full py-6 font-black text-xl uppercase transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3
                ${hasConfirmed 
                  ? 'bg-nb-green text-black border-4 border-black cursor-default' 
                  : 'bg-black text-white border-4 border-white hover:bg-nb-blue'}`}
            >
              {hasConfirmed ? (
                <>
                  <span className="material-symbols-outlined font-bold">check_circle</span>
                  TERKONFIRMASI
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined font-bold">how_to_reg</span>
                  KONFIRMASI HADIR
                </>
              )}
            </motion.button>

            {hasConfirmed && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-4 font-black text-xs uppercase italic bg-black/40 py-2 border border-white/20"
              >
                Terima kasih! Sampai jumpa di lokasi.
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="max-w-7xl mx-auto px-6 pb-24" id="jadwal">
        <h2 className="text-5xl font-[900] text-black italic mb-12 uppercase" style={{ fontFamily: 'Lexend, sans-serif' }}>WARTA LINGKUNGAN</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {loading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="h-64 border-4 border-black bg-nb-cream animate-pulse" />)
          ) : filteredNotices.map((notice: any, idx: number) => (
            <motion.div
              key={idx}
              onClick={() => setSelectedNotice(notice)}
              whileHover={{ y: -10 }}
              className="border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group"
            >
              <p className="font-black text-xs text-black/50 uppercase mb-4 italic">{notice.date}</p>
              <h3 className="text-2xl font-[900] text-black uppercase mb-4 group-hover:text-nb-orange" style={{ fontFamily: 'Lexend, sans-serif' }}>{notice.title}</h3>
              <p className="font-bold text-black/70 mb-8 line-clamp-3">{notice.detail}</p>
              <div className="pt-6 border-t-4 border-black flex justify-between items-center font-black uppercase text-xs">
                <span>BACA DETAIL</span>
                <span className="material-symbols-outlined font-bold">arrow_forward</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-4 border-black bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-4 border-black bg-nb-purple" />
            <span className="font-[900] text-2xl uppercase italic" style={{ fontFamily: 'Lexend, sans-serif' }}>WARGABERSIH</span>
          </div>
          <p className="font-black text-black/50">© {new Date().getFullYear()} PORTAL WARGA TRANSPARAN</p>
        </div>
      </footer>

      {/* MODAL */}
      <AnimatePresence>
        {selectedNotice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNotice(null)} className="absolute inset-0 bg-black/60" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-white border-4 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
              <button onClick={() => setSelectedNotice(null)} className="absolute top-6 right-6 border-2 border-black p-2 hover:bg-nb-pink transition-colors font-bold uppercase text-xs">CLOSE [X]</button>
              <p className="font-black text-nb-orange uppercase mb-4 italic">{selectedNotice.date}</p>
              <h3 className="text-4xl font-[900] uppercase mb-8 italic" style={{ fontFamily: 'Lexend, sans-serif' }}>{selectedNotice.title}</h3>
              <p className="font-bold text-lg leading-relaxed mb-10">{selectedNotice.detail}</p>
              <button onClick={() => setSelectedNotice(null)} className="bg-nb-blue border-4 border-black px-10 py-4 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">SELESAI</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;