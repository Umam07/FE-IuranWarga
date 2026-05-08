import { useEffect, useState, useMemo } from 'react';
import api from '../utils/api';
import { DashboardLayout } from '../components/DashboardLayout';
import { StatCard, StatusDot } from '../components/Shared';
import { monthLabels } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface Warga {
  id: string | number;
  name: string;
  role: string;
  home: string;
  months: string[];
}

export function Payments() {
  const [warga, setWarga] = useState<Warga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInputModal, setShowInputModal] = useState(false);
  const [selectedWargaId, setSelectedWargaId] = useState('');
  const [monthsToPay, setMonthsToPay] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wargaSearch, setWargaSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const MONTHLY_FEE = 5000;

  const fetchWarga = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/warga');
      setWarga(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching warga:', err);
      setError('Gagal memuat data warga.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarga();
  }, []);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWargaId) return;

    try {
      setIsSubmitting(true);
      await api.post('/payments', {
        warga_id: selectedWargaId,
        months_count: monthsToPay
      });
      
      setShowInputModal(false);
      setSelectedWargaId('');
      setMonthsToPay(1);
      fetchWarga();
      alert('Pembayaran berhasil dicatat!');
    } catch (err) {
      console.error('Error submitting payment:', err);
      alert('Gagal mencatat pembayaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'NN';
    return name.trim().split(/\s+/).map((p) => p[0]).join('').substring(0, 2).toUpperCase();
  };

  const filteredWarga = useMemo(() => {
    if (!searchQuery) return warga;
    const lowerQuery = searchQuery.toLowerCase();
    return warga.filter((w) => w.name.toLowerCase().includes(lowerQuery) || w.home.toLowerCase().includes(lowerQuery));
  }, [warga, searchQuery]);

  return (
    <DashboardLayout
      title="Iuran Pengelolaan Lingkungan"
      subtitle="Pantau dan kelola kontribusi warga secara real-time dengan sistem pencatatan transparan."
      active="Pendapatan"
    >
      <div className="grid gap-8 lg:grid-cols-4 mb-12">
        <StatCard title="Total Terkumpul" value="Rp 12.450k" note="+12% bulan lalu" icon="account_balance_wallet" trend="up" />
        <StatCard title="Kepatuhan" value="94,2%" note="142 / 151 rumah" icon="verified_user" trend="up" />
        <StatCard title="Tunggakan" value="Rp 840k" note="12 warga" icon="warning" trend="down" className="bg-nb-pink/10" />
        <StatCard title="Zona Aktif" value="4 Area" note="Lancar" icon="location_on" trend="neutral" />
      </div>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-4 border-black shadow-nb-lg p-8 sm:p-10 transition-all"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between mb-10">
          <div>
            <h3 className="text-3xl font-[900] text-black uppercase italic tracking-tighter font-lexend">Buku Besar Pembayaran</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black bg-nb-green text-black text-[10px] font-black uppercase tracking-widest shadow-nb-hover">
                <div className="w-2 h-2 border-2 border-black bg-black"></div> Lunas
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black bg-nb-yellow text-black text-[10px] font-black uppercase tracking-widest shadow-nb-hover">
                <div className="w-2 h-2 border-2 border-black bg-black"></div> Pending
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black bg-nb-pink text-black text-[10px] font-black uppercase tracking-widest shadow-nb-hover">
                <div className="w-2 h-2 border-2 border-black bg-black"></div> Terlambat
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-black font-bold">search</span>
              <input 
                className="w-full sm:w-80 pl-14 pr-6 py-4 bg-nb-cream border-3 border-black font-black text-sm focus:bg-white focus:shadow-nb-hover transition-all outline-none uppercase placeholder:text-black/30" 
                placeholder="CARI NAMA / RUMAH..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <motion.button 
              whileHover={{ x: -4, y: -4 }}
              whileTap={{ x: 0, y: 0 }}
              className="px-8 py-4 bg-nb-blue text-black border-3 border-black font-[900] text-sm uppercase italic tracking-widest shadow-nb hover:shadow-nb-lg transition-all flex items-center justify-center gap-3"
              onClick={() => { 
                setSelectedWargaId(''); 
                setWargaSearch('');
                setShowInputModal(true); 
              }}
            >
              <span className="material-symbols-outlined font-bold text-lg">add_circle</span>
              Input Iuran
            </motion.button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-2 pb-4 custom-scrollbar">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-left text-[11px] font-[900] uppercase tracking-[0.2em] text-black/40 italic">
                <th className="px-6 pb-2">Identitas Warga</th>
                <th className="px-4 pb-2">Rumah</th>
                {monthLabels.map((month) => (
                  <th key={month} className="px-2 pb-2 text-center">{month}</th>
                ))}
                <th className="px-6 pb-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={15} className="text-center py-20 text-black font-black uppercase italic tracking-widest">
                   <span className="material-symbols-outlined animate-spin text-4xl mb-2 font-bold">sync</span>
                   <p>Memuat database...</p>
                </td></tr>
              ) : filteredWarga.map((row) => (
                <tr key={row.id} className="group transition-all">
                  <td className="bg-white border-y-3 border-l-3 border-black group-hover:bg-nb-yellow/10 px-6 py-5 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border-3 border-black bg-nb-blue shadow-nb-hover font-black text-black text-sm group-hover:scale-110 transition-transform italic">
                        {getInitials(row.name)}
                      </div>
                      <div>
                        <p className="font-[900] text-black tracking-tighter uppercase italic font-lexend leading-tight">{row.name}</p>
                        <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mt-1">{row.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="bg-white border-y-3 border-black group-hover:bg-nb-yellow/10 px-4 py-5 transition-colors">
                    <span className="px-3 py-1.5 bg-nb-cream border-2 border-black text-[11px] font-black text-black uppercase shadow-nb-hover">{row.home}</span>
                  </td>
                  {row.months.map((status: string, index: number) => (
                    <td key={index} className="bg-white border-y-3 border-black group-hover:bg-nb-yellow/10 px-2 py-5 transition-colors">
                      <StatusDot status={status} />
                    </td>
                  ))}
                  <td className="bg-white border-y-3 border-r-3 border-black group-hover:bg-nb-yellow/10 px-6 py-5 text-right transition-colors">
                    <div className="flex justify-end gap-3">
                       <motion.button 
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 bg-white border-2 border-black shadow-nb-hover hover:bg-nb-green transition-all"
                        onClick={() => { 
                          setSelectedWargaId(row.id.toString()); 
                          setWargaSearch(row.name);
                          setShowInputModal(true); 
                        }}
                      >
                        <span className="material-symbols-outlined text-lg font-bold text-black">payments</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 bg-white border-2 border-black shadow-nb-hover hover:bg-nb-blue transition-all"
                      >
                        <span className="material-symbols-outlined text-lg font-bold text-black">info</span>
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      <AnimatePresence>
        {showInputModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowInputModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, x: 20, y: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: 20, y: 20 }}
              className="relative w-full max-w-lg bg-white border-4 border-black p-10 shadow-nb-lg"
            >
              <h3 className="text-3xl font-[900] text-black uppercase italic tracking-tighter font-lexend">Input Iuran Baru</h3>
              <p className="mt-2 text-black/50 font-black uppercase text-[11px] tracking-widest italic">Pencatatan resmi kontribusi lingkungan.</p>
              
              <form onSubmit={handlePaymentSubmit} className="mt-10 space-y-8">
                <div className="space-y-3 relative">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/40 ml-1 italic">Pilih Warga</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-black font-bold z-10">person_search</span>
                    <input 
                      type="text"
                      className="w-full pl-14 pr-12 py-5 bg-nb-cream border-3 border-black font-black text-sm focus:bg-white focus:shadow-nb-hover transition-all outline-none uppercase"
                      placeholder="CARI & PILIH WARGA..."
                      value={wargaSearch}
                      onChange={(e) => {
                        setWargaSearch(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                    />
                    {selectedWargaId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setSelectedWargaId('');
                          setWargaSearch('');
                        }}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-black hover:text-nb-pink transition-colors z-10"
                      >
                        <span className="material-symbols-outlined font-bold text-lg">cancel</span>
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={() => setIsDropdownOpen(false)} 
                        />
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 right-0 top-full mt-2 bg-white border-3 border-black shadow-nb max-h-72 overflow-y-auto z-30 p-2 custom-scrollbar"
                        >
                          {warga
                            .filter(w => 
                              w.name.toLowerCase().includes(wargaSearch.toLowerCase()) || 
                              w.home.toLowerCase().includes(wargaSearch.toLowerCase())
                            )
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((w) => (
                              <button
                                key={w.id}
                                type="button"
                                className={`w-full text-left px-5 py-4 border-2 border-transparent transition-all flex items-center justify-between group uppercase italic ${
                                  selectedWargaId === w.id.toString() 
                                    ? 'bg-nb-blue border-black' 
                                    : 'hover:bg-nb-yellow hover:border-black'
                                }`}
                                onClick={() => {
                                  setSelectedWargaId(w.id.toString());
                                  setWargaSearch(w.name);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                <div>
                                  <p className="font-black text-sm tracking-tight">{w.name}</p>
                                  <p className="text-[10px] opacity-60 font-black tracking-[0.2em]">{w.home}</p>
                                </div>
                                {selectedWargaId === w.id.toString() && (
                                  <span className="material-symbols-outlined text-black font-bold">check_circle</span>
                                )}
                              </button>
                            ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/40 ml-1 italic">Jumlah Bulan</label>
                  <div className="flex items-center bg-nb-cream border-3 border-black p-1">
                    <button 
                      type="button" 
                      onClick={() => setMonthsToPay(Math.max(1, monthsToPay-1))}
                      className="h-12 w-12 flex items-center justify-center bg-white border-2 border-black hover:bg-nb-pink transition-colors shadow-nb-hover"
                    >
                      <span className="material-symbols-outlined font-bold text-xl">remove</span>
                    </button>
                    <input 
                      type="number" 
                      className="bg-transparent border-none text-center flex-1 font-[900] text-black text-xl focus:ring-0" 
                      value={monthsToPay}
                      readOnly
                    />
                    <button 
                      type="button" 
                      onClick={() => setMonthsToPay(Math.min(12, monthsToPay+1))}
                      className="h-12 w-12 flex items-center justify-center bg-white border-2 border-black hover:bg-nb-green transition-colors shadow-nb-hover"
                    >
                      <span className="material-symbols-outlined font-bold text-xl">add</span>
                    </button>
                  </div>
                </div>

                {/* Total Section */}
                <div className="bg-nb-yellow border-4 border-black p-8 shadow-nb relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 text-black/5 group-hover:text-black/10 transition-colors pointer-events-none">
                    <span className="material-symbols-outlined text-[120px] font-bold">payments</span>
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[11px] font-black uppercase tracking-widest text-black">Rincian Pembayaran</span>
                      <div className="px-4 py-1.5 bg-black text-white text-[10px] font-black uppercase border-2 border-black tracking-widest">
                        Rp {MONTHLY_FEE.toLocaleString('id-ID')} / BLN
                      </div>
                    </div>
                    <div className="pt-6 border-t-3 border-black/10 flex justify-between items-end">
                      <div>
                        <p className="text-[11px] font-black text-black/60 uppercase tracking-widest italic">Total Bayar</p>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-sm font-black text-black">Rp</span>
                          <span className="text-4xl font-[900] text-black tracking-tighter font-lexend italic">
                            {(monthsToPay * MONTHLY_FEE).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-[900] text-black uppercase italic bg-white px-2 py-1 border-2 border-black shadow-nb-hover">× {monthsToPay} BULAN</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-6">
                  <button 
                    type="button"
                    className="flex-1 py-5 border-3 border-black bg-white text-black font-black uppercase italic tracking-widest hover:bg-nb-cream transition-all shadow-nb-hover"
                    onClick={() => setShowInputModal(false)}
                  >
                    Batal
                  </button>
                  <motion.button 
                    whileHover={{ x: -4, y: -4 }}
                    whileTap={{ x: 0, y: 0 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-nb-purple text-white border-3 border-black py-5 text-sm font-[900] uppercase italic tracking-widest shadow-nb hover:shadow-nb-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Loading...' : 'Simpan Data'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}