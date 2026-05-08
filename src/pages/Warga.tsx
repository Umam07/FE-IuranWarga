import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Warga {
  id: number;
  name: string;
  home: string;
  role: string;
  phone?: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function Warga() {
  const [wargaList, setWargaList] = useState<Warga[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWarga, setEditingWarga] = useState<Warga | null>(null);
  const [formData, setFormData] = useState({ name: '', home: '', role: 'Warga tetap', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const limit = 10;

  const fetchWarga = async (page: number, search: string = '') => {
    try {
      setLoading(true);
      const response = await api.get('/warga', {
        params: { page, limit, query: search }
      });
      setWargaList(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error('Error fetching warga:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarga(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchWarga(1, searchTerm);
  };

  const handleOpenModal = (warga?: Warga) => {
    if (warga) {
      setEditingWarga(warga);
      setFormData({ 
        name: warga.name, 
        home: warga.home, 
        role: warga.role,
        phone: warga.phone || '' 
      });
    } else {
      setEditingWarga(null);
      setFormData({ name: '', home: '', role: 'Warga tetap', phone: '' });
    }
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus warga ini? Semua data pembayaran juga akan dihapus.')) {
      try {
        await api.delete(`/warga/${id}`);
        fetchWarga(currentPage, searchTerm);
      } catch (error) {
        console.error('Error deleting warga:', error);
        alert('Gagal menghapus warga');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingWarga) {
        await api.put(`/warga/${editingWarga.id}`, formData);
      } else {
        await api.post('/warga', formData);
      }
      setShowModal(false);
      fetchWarga(currentPage, searchTerm);
    } catch (error) {
      console.error('Error saving warga:', error);
      alert('Gagal menyimpan data warga');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Manajemen Warga"
      subtitle="Kelola data penduduk, status hunian, dan informasi kontak secara terpusat dan efisien."
      active="Warga"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-4 border-black shadow-nb-lg overflow-hidden relative"
      >
        <div className="p-8 border-b-4 border-black flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-nb-cream/30">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-2xl group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-black font-bold">search</span>
            <input 
              type="text" 
              placeholder="CARI NAMA ATAU NOMOR RUMAH..." 
              className="w-full pl-14 pr-6 py-5 bg-white border-3 border-black font-black text-sm focus:shadow-nb-hover transition-all outline-none uppercase placeholder:text-black/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <div className="flex items-center gap-4">
             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-4 border-3 border-black bg-white hover:bg-nb-yellow transition-all shadow-nb-hover">
              <span className="material-symbols-outlined font-bold text-black">filter_list</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-4 border-3 border-black bg-white hover:bg-nb-blue transition-all shadow-nb-hover">
              <span className="material-symbols-outlined font-bold text-black">download</span>
            </motion.button>
            <motion.button 
              onClick={() => handleOpenModal()}
              whileHover={{ x: -4, y: -4 }} 
              whileTap={{ x: 0, y: 0 }} 
              className="flex items-center gap-3 px-8 py-5 bg-nb-orange text-white border-3 border-black hover:shadow-nb-lg transition-all text-sm font-[900] uppercase italic tracking-widest shadow-nb"
            >
              <span className="material-symbols-outlined font-bold text-lg">person_add</span>
              Tambah Warga
            </motion.button>
          </div>
        </div>

        <div className="overflow-x-auto px-6 py-8 custom-scrollbar">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-left text-[11px] font-[900] uppercase tracking-[0.2em] text-black/40 italic">
                <th className="px-6 py-2">Nama Warga</th>
                <th className="px-6 py-2">No. Rumah</th>
                <th className="px-6 py-2">Status Hunian</th>
                <th className="px-6 py-2">Kontak Aktif</th>
                <th className="px-6 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <span className="material-symbols-outlined animate-spin text-5xl text-black font-bold">sync</span>
                      <p className="text-sm text-black font-[900] uppercase italic tracking-widest">Sinkronisasi Database...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {wargaList.map((warga) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={warga.id} 
                      className="group transition-all"
                    >
                      <td className="px-6 py-5 bg-white border-y-3 border-l-3 border-black group-hover:bg-nb-blue/5 transition-colors">
                        <div className="flex items-center gap-5">
                          <div className="h-12 w-12 border-3 border-black bg-nb-blue shadow-nb-hover flex items-center justify-center font-[900] text-black text-lg italic transition-transform group-hover:scale-110">
                            {warga.name.charAt(0)}
                          </div>
                          <span className="font-[900] text-black uppercase italic tracking-tighter font-lexend">{warga.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 bg-white border-y-3 border-black group-hover:bg-nb-blue/5 transition-colors">
                        <span className="px-3 py-1.5 bg-nb-cream border-2 border-black text-[11px] font-black text-black uppercase shadow-nb-hover italic">{warga.home}</span>
                      </td>
                      <td className="px-6 py-5 bg-white border-y-3 border-black group-hover:bg-nb-blue/5 transition-colors">
                        <span className="inline-flex px-3 py-1.5 border-2 border-black font-black text-[10px] uppercase tracking-widest bg-nb-purple text-white shadow-nb-hover">
                          {warga.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 bg-white border-y-3 border-black group-hover:bg-nb-blue/5 transition-colors">
                         <div className="flex items-center gap-3 text-black/60">
                           <span className="material-symbols-outlined text-lg font-bold">call</span>
                           <span className="text-sm font-black italic">{warga.phone || '0812-xxxx-xxxx'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5 bg-white border-y-3 border-r-3 border-black group-hover:bg-nb-blue/5 transition-colors text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button 
                            onClick={() => handleOpenModal(warga)}
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }} 
                            className="p-2.5 border-2 border-black bg-white hover:bg-nb-yellow transition-all shadow-nb-hover"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-lg font-bold text-black">edit</span>
                          </motion.button>
                          <motion.button 
                            onClick={() => handleDelete(warga.id)}
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }} 
                            className="p-2.5 border-2 border-black bg-white hover:bg-nb-pink transition-all shadow-nb-hover"
                            title="Hapus"
                          >
                            <span className="material-symbols-outlined text-lg font-bold text-black">delete</span>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="p-8 border-t-4 border-black flex flex-col sm:flex-row items-center justify-between gap-6 bg-nb-cream/20">
            <p className="text-[11px] font-black text-black/40 uppercase tracking-[0.2em] italic">
              Record: <span className="text-black mx-1">{wargaList.length}</span> / <span className="text-black mx-1">{meta.total}</span> Warga Terdaftar
            </p>
            <div className="flex items-center gap-3">
              <motion.button 
                whileHover={{ x: -4 }}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className="p-3 border-3 border-black bg-white text-black hover:bg-nb-yellow transition-all disabled:opacity-30 shadow-nb-hover"
              >
                <span className="material-symbols-outlined font-bold">chevron_left</span>
              </motion.button>
              
              <div className="flex items-center gap-2">
                {[...Array(meta.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-12 w-12 border-3 border-black text-sm font-[900] transition-all uppercase italic ${
                      currentPage === i + 1 
                        ? 'bg-nb-orange text-white shadow-nb -translate-y-1' 
                        : 'bg-white text-black hover:bg-nb-cream shadow-nb-hover'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <motion.button 
                whileHover={{ x: 4 }}
                onClick={() => setCurrentPage(prev => Math.min(meta.totalPages, prev + 1))}
                disabled={currentPage === meta.totalPages || loading}
                className="p-3 border-3 border-black bg-white text-black hover:bg-nb-yellow transition-all disabled:opacity-30 shadow-nb-hover"
              >
                <span className="material-symbols-outlined font-bold">chevron_right</span>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal Edit/Tambah Warga */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white border-4 border-black shadow-nb-lg overflow-hidden"
            >
              <div className="p-6 border-b-4 border-black bg-nb-blue flex justify-between items-center">
                <h3 className="text-xl font-[900] uppercase italic tracking-tighter text-black font-lexend">
                  {editingWarga ? 'Edit Data Warga' : 'Tambah Warga Baru'}
                </h3>
                <button onClick={() => setShowModal(false)} className="h-10 w-10 border-2 border-black bg-white hover:bg-nb-pink flex items-center justify-center shadow-nb-hover transition-all">
                  <span className="material-symbols-outlined font-bold">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/50 italic">Nama Lengkap</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-white border-3 border-black font-black text-sm focus:shadow-nb-hover outline-none uppercase"
                    placeholder="CONTOH: ADITYA SURYA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/50 italic">Nomor Telepon (WhatsApp)</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 py-4 bg-white border-3 border-black font-black text-sm focus:shadow-nb-hover outline-none uppercase"
                    placeholder="CONTOH: 081234567890"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-black/50 italic">No. Rumah</label>
                    <input 
                      required
                      type="text" 
                      value={formData.home}
                      onChange={(e) => setFormData({ ...formData, home: e.target.value })}
                      className="w-full px-5 py-4 bg-white border-3 border-black font-black text-sm focus:shadow-nb-hover outline-none uppercase"
                      placeholder="CONTOH: B1-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-black/50 italic">Status Hunian</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-5 py-4 bg-white border-3 border-black font-black text-sm focus:shadow-nb-hover outline-none uppercase appearance-none"
                    >
                      <option value="Warga tetap">Warga Tetap</option>
                      <option value="Kepala keluarga">Kepala Keluarga</option>
                      <option value="Koordinator blok">Koordinator Blok</option>
                      <option value="Warga kontrak">Warga Kontrak</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 border-3 border-black bg-white font-black uppercase italic text-sm hover:bg-nb-cream transition-all shadow-nb-hover"
                  >
                    Batal
                  </button>
                  <button 
                    disabled={submitting}
                    type="submit"
                    className="flex-1 py-4 border-3 border-black bg-nb-orange text-white font-black uppercase italic text-sm hover:shadow-nb transition-all shadow-nb-hover disabled:opacity-50"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan Data'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

