import { useEffect, useState } from 'react';
import api from '../utils/api';
import { DashboardLayout } from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

export function Pengumuman() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [date, setDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    fetchNotices();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDetail('');
    setDate('');
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDetail(item.detail);
    setDate(item.date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/pengumuman/${editingId}`, { title, detail, date });
        alert('Pengumuman berhasil diperbarui');
      } else {
        await api.post('/pengumuman', { title, detail, date });
        alert('Pengumuman berhasil diterbitkan');
      }
      resetForm();
      await fetchNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      alert('Gagal menyimpan pengumuman');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      setDeletingId(id);
      try {
        await api.delete(`/pengumuman/${id}`);
        await fetchNotices();
      } catch (error) {
        console.error('Error deleting notice:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredNotices = notices.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.detail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="PUSAT KONTEN & WARTA"
      subtitle="Publikasikan pengumuman terbaru dan kelola informasi warga dalam satu panel terpadu."
      active="Pengumuman"
    >
      <div className="flex flex-col gap-16">
        {/* FORM PENGUMUMAN */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-black shadow-nb-lg p-8 sm:p-12 relative overflow-hidden group transition-all"
        >
          <div className="absolute top-0 right-0 -mt-20 -mr-20 text-black/5 group-hover:text-nb-orange/10 transition-colors duration-500 pointer-events-none">
            <span className="material-symbols-outlined text-[250px] font-bold">campaign</span>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-nb-blue border-3 border-black text-black shadow-nb">
                  <span className="material-symbols-outlined font-bold">{editingId ? 'edit_note' : 'add_box'}</span>
                </div>
                <h3 className="text-3xl font-[900] text-black uppercase italic tracking-tighter font-lexend">
                  {editingId ? 'Edit Pengumuman' : 'Terbit Warta Baru'}
                </h3>
              </div>
              {editingId && (
                <button 
                  onClick={resetForm}
                  className="px-6 py-3 border-3 border-black bg-nb-pink text-[11px] font-[900] uppercase italic tracking-widest text-black hover:shadow-nb transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm font-bold">cancel</span> Batal Edit
                </button>
              )}
            </div>
            
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/40 ml-1 italic">Judul Warta</label>
                  <input 
                    className="w-full px-6 py-4 bg-nb-cream border-3 border-black font-black text-black focus:bg-white focus:shadow-nb-hover transition-all outline-none placeholder:text-black/30 uppercase" 
                    placeholder="MISAL: INFO GOTONG ROYONG..." 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/40 ml-1 italic">Tanggal Pelaksanaan</label>
                  <input 
                    type="date" 
                    className="w-full px-6 py-4 bg-nb-cream border-3 border-black font-black text-black focus:bg-white focus:shadow-nb-hover transition-all cursor-pointer outline-none uppercase" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-black/40 ml-1 italic">Detail Informasi</label>
                <textarea 
                  className="w-full h-48 px-6 py-4 bg-nb-cream border-3 border-black font-black text-black focus:bg-white focus:shadow-nb-hover transition-all outline-none placeholder:text-black/30 resize-none uppercase" 
                  placeholder="TULISKAN DETAIL PENGUMUMAN DI SINI..." 
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  required
                />
              </div>
              <motion.button 
                whileHover={{ x: -4, y: -4 }}
                whileTap={{ x: 0, y: 0 }}
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-6 border-4 border-black font-[900] text-lg uppercase italic shadow-nb hover:shadow-nb-lg transition-all flex items-center justify-center gap-3 ${
                  editingId ? 'bg-nb-purple text-white' : 'bg-nb-orange text-white'
                }`}
              >
                {isSubmitting ? (
                  <><span className="material-symbols-outlined animate-spin font-bold">sync</span> Menyimpan...</>
                ) : (
                  <><span className="material-symbols-outlined font-bold">{editingId ? 'save' : 'send'}</span> {editingId ? 'Simpan Perubahan' : 'Terbitkan Warta'}</>
                )}
              </motion.button>
            </form>
          </div>
        </motion.section>

        {/* LIST PENGUMUMAN */}
        <section id="daftar-pengumuman">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div>
               <h3 className="text-4xl font-[900] text-black uppercase italic tracking-tighter font-lexend">Arsip Warta</h3>
               <p className="text-xl font-black text-black/40 italic">Daftar pengumuman yang sudah terbit.</p>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-black font-bold">search</span>
              <input 
                className="pl-14 pr-6 py-4 bg-white border-4 border-black font-black text-sm focus:shadow-nb-hover transition-all outline-none w-full md:w-80 uppercase placeholder:text-black/30" 
                placeholder="CARI ARSIP..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-24 text-center border-4 border-dashed border-black bg-nb-cream/30">
                <span className="material-symbols-outlined animate-spin text-6xl text-black font-bold">sync</span>
                <p className="mt-4 font-black uppercase italic text-black/40">Menyusun Arsip...</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredNotices.map((item) => (
                  <motion.article 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id} 
                    className={`p-8 bg-white border-4 border-black transition-all group shadow-nb hover:shadow-nb-lg ${
                      editingId === item.id ? 'bg-nb-yellow' : 'hover:-translate-y-2'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-4 py-2 border-2 border-black bg-nb-cream text-black text-[10px] font-black uppercase italic shadow-nb-hover">
                        {item.date}
                      </span>
                      <div className="flex gap-3">
                         <button 
                           onClick={() => handleEdit(item)}
                           className="p-2 border-2 border-black bg-white hover:bg-nb-blue transition-colors shadow-nb-hover hover:shadow-nb"
                         >
                           <span className="material-symbols-outlined text-lg font-bold text-black">edit</span>
                         </button>
                         <button 
                           onClick={() => handleDelete(item.id)}
                           className="p-2 border-2 border-black bg-white hover:bg-nb-pink transition-colors shadow-nb-hover hover:shadow-nb"
                         >
                           <span className="material-symbols-outlined text-lg font-bold text-black">{deletingId === item.id ? 'sync' : 'delete'}</span>
                         </button>
                      </div>
                    </div>
                    <h4 className="text-2xl font-[900] text-black mb-4 leading-tight uppercase italic font-lexend">{item.title}</h4>
                    <p className="font-black text-black/60 leading-tight line-clamp-3 uppercase text-xs italic">{item.detail}</p>
                  </motion.article>
                ))}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}