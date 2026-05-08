import { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { MetricCard } from '../components/Shared';
import { ledgerRows } from '../data/mockData';
import { motion } from 'framer-motion';

export function MutasiKas() {
  return (
    <DashboardLayout
      title="Pencatatan Mutasi Kas"
      subtitle="Kelola aliran kas masuk dan keluar lingkungan dengan transparansi penuh."
      active="Mutasi"
    >
      <div className="grid gap-12">
        {/* METRIK */}
        <div className="grid gap-8 sm:grid-cols-2">
          <MetricCard 
            title="Saldo Terakhir" 
            value="Rp 12.450k" 
            description="Kas aktif untuk program warga." 
            icon="savings"
            className="bg-nb-green/10"
          />
          <MetricCard 
            title="Log Transaksi" 
            value="42 Record" 
            description="Mutasi kas masuk & keluar." 
            icon="receipt_long"
            className="bg-nb-blue/10"
          />
        </div>

        {/* FORM MUTASI */}
        <section 
          className="bg-white border-4 border-black shadow-nb-lg p-8 sm:p-12 relative overflow-hidden group transition-all"
        >
          <div className="absolute top-0 right-0 -mt-16 -mr-16 text-black/5 group-hover:text-nb-green/10 transition-colors duration-500 pointer-events-none">
             <span className="material-symbols-outlined text-[200px] font-bold">account_balance</span>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-10">
              <div className="p-4 bg-nb-purple border-3 border-black text-white shadow-nb">
                <span className="material-symbols-outlined font-bold">add_card</span>
              </div>
              <h3 className="text-3xl font-[900] text-black uppercase italic tracking-tighter font-lexend">Pencatatan Mutasi Kas</h3>
            </div>
            
            <div className="space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                 <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/50 ml-1 italic">Jenis Transaksi</label>
                  <select className="w-full px-6 py-4 bg-nb-cream border-3 border-black font-black text-black focus:bg-white focus:shadow-nb-hover transition-all appearance-none outline-none cursor-pointer">
                    <option value="in">Pemasukan (+)</option>
                    <option value="out">Pengeluaran (-)</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/50 ml-1 italic">Nominal (Rp)</label>
                  <input type="number" className="w-full px-6 py-4 bg-nb-cream border-3 border-black font-black text-black focus:bg-white focus:shadow-nb-hover transition-all placeholder:text-black/30 outline-none" placeholder="0" />
                </div>
              </div>
              <div className="space-y-3 text-left">
                <label className="text-[11px] font-black uppercase tracking-widest text-black/50 ml-1 italic">Keterangan Mutasi</label>
                <input className="w-full px-6 py-4 bg-nb-cream border-3 border-black font-black text-black focus:bg-white focus:shadow-nb-hover transition-all placeholder:text-black/30 outline-none" placeholder="Misal: Beli alat kebersihan RT..." />
              </div>
            </div>

            <motion.button 
              whileHover={{ x: -4, y: -4 }}
              whileTap={{ x: 0, y: 0 }}
              className="mt-10 w-full py-6 bg-nb-orange text-white border-4 border-black font-[900] text-lg uppercase italic tracking-widest shadow-nb hover:shadow-nb-lg transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined font-bold">library_add</span> Simpan Transaksi
            </motion.button>
          </div>
        </section>

        {/* LOG BUKU KAS */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
               <h3 className="text-4xl font-[900] text-black uppercase italic tracking-tighter font-lexend">Riwayat Mutasi</h3>
               <p className="text-xl font-black text-black/40 italic">Log transaksi kas paling baru.</p>
            </div>
          </div>
          
          <div className="bg-white border-4 border-black shadow-nb-lg overflow-hidden p-4">
            <div className="space-y-3">
              {ledgerRows.map((item, idx) => (
                <article key={idx} className="flex items-center justify-between p-5 border-3 border-black bg-white hover:bg-nb-yellow hover:-translate-y-1 transition-all group shadow-nb-hover hover:shadow-nb">
                  <div className="flex items-center gap-5">
                    <div className={`h-14 w-14 shrink-0 flex items-center justify-center border-3 border-black font-black text-lg ${item.type === 'Pemasukan' ? 'bg-nb-green' : 'bg-nb-pink'}`}>
                      <span className="material-symbols-outlined font-bold">{item.type === 'Pemasukan' ? 'add_circle' : 'do_not_disturb_on'}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-[900] text-black leading-none mb-2 uppercase italic font-lexend">{item.name}</h4>
                      <p className="text-[11px] font-black text-black/40 uppercase tracking-widest">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-[900] tracking-tighter italic ${item.type === 'Pemasukan' ? 'text-black bg-nb-green/20 px-2' : 'text-black bg-nb-pink/20 px-2'}`}>
                      {item.type === 'Pemasukan' ? '+' : '-'}{item.amount}
                    </p>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">{item.type}</span>
                  </div>
                </article>
              ))}
            </div>
            <button className="w-full mt-6 py-5 border-3 border-black bg-nb-blue text-black font-[900] uppercase italic tracking-widest hover:bg-nb-blue/80 hover:shadow-nb transition-all">
              Tampilkan Semua Log Transaksi
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
