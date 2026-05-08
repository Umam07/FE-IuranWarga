import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { MetricCard } from '../components/Shared';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { monthLabels } from '../data/mockData';

interface SummaryData {
  totalWarga: number;
  kasBulanIni: number;
  tunggakan: number;
  saldoAkhir: number;
}

interface Activity {
  id: number;
  name: string;
  home: string;
  month: number;
  updated_at: string;
}

interface MonthlyStat {
  month: number;
  total: number;
}

export function Ringkasan() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<MonthlyStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/summary');
      setSummary(response.data.summary);
      setActivities(response.data.recentActivity);
      setStats(response.data.monthlyStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)}k`;
    return `Rp ${val}`;
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} jam lalu`;
    return `${Math.floor(diffMins / 1440)} hari lalu`;
  };

  const maxStat = stats.length > 0 ? Math.max(...stats.map(s => s.total), 1) : 1;

  return (
    <DashboardLayout
      title="Ringkasan Dashboard"
      subtitle="Gambaran umum kondisi keuangan dan data warga di lingkungan Anda."
      active="Ringkasan"
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Warga" 
          value={loading ? "..." : (summary?.totalWarga || 0).toString()} 
          description="Warga terdaftar aktif di sistem." 
          icon="group"
          className="bg-nb-blue/10"
        />
        <MetricCard 
          title="Kas Bulan Ini" 
          value={loading ? "..." : formatCurrency(summary?.kasBulanIni || 0)} 
          description="Pemasukan dari iuran terkumpul." 
          icon="payments"
          className="bg-nb-green/10"
        />
        <MetricCard 
          title="Tunggakan" 
          value={loading ? "..." : formatCurrency(summary?.tunggakan || 0)} 
          description="Iuran yang belum terlunasi." 
          icon="warning"
          className="bg-nb-yellow/10"
        />
        <MetricCard 
          title="Saldo Akhir" 
          value={loading ? "..." : formatCurrency(summary?.saldoAkhir || 0)} 
          description="Total saldo kas saat ini." 
          icon="account_balance_wallet"
          className="bg-nb-black !text-white"
        />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        {/* Kas Card - Chart */}
        <motion.section 
          whileHover={{ x: -4, y: -4 }}
          className="lg:col-span-7 bg-white p-8 border-4 border-black shadow-nb-lg relative overflow-hidden group transition-all"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-nb-purple border-3 border-black text-white shadow-nb">
                <span className="material-symbols-outlined font-bold">trending_up</span>
              </div>
              <div>
                <h3 className="text-2xl font-[900] text-black uppercase italic tracking-tighter font-lexend">Statistik Iuran</h3>
                <p className="text-[11px] font-black text-black/40 uppercase tracking-[0.2em] mt-1">Januari - Desember 2024</p>
              </div>
            </div>
          </div>
          
          <div className="h-80 flex items-end justify-between gap-2 px-2 pb-6 border-b-4 border-black">
            {monthLabels.map((label, idx) => {
              const stat = stats.find(s => s.month === idx);
              const height = stat ? (stat.total / maxStat) * 100 : 0;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                  <div className="relative w-full flex flex-col items-center justify-end h-full">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: idx * 0.05 }}
                      className="w-full bg-nb-blue border-t-3 border-x-3 border-black group-hover/bar:bg-nb-yellow transition-colors relative"
                    >
                      {stat && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 font-black opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {formatCurrency(stat.total)}
                        </div>
                      )}
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-black uppercase italic tracking-tighter">{label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-nb-blue border-2 border-black"></div>
              <span className="text-[10px] font-black uppercase italic">Pemasukan Terverifikasi</span>
            </div>
          </div>
        </motion.section>

        {/* Activity Feed */}
        <motion.section 
          whileHover={{ x: -4, y: -4 }}
          className="lg:col-span-5 bg-white p-8 border-4 border-black shadow-nb-lg transition-all"
        >
          <div className="flex items-center gap-5 mb-10">
            <div className="p-4 bg-nb-orange border-3 border-black text-white shadow-nb">
              <span className="material-symbols-outlined font-bold">history</span>
            </div>
            <h3 className="text-2xl font-[900] text-black uppercase italic tracking-tighter font-lexend">Aktivitas Terkini</h3>
          </div>
          <div className="space-y-5">
            {loading ? (
              <div className="py-10 text-center">
                <span className="material-symbols-outlined animate-spin text-4xl mb-2 font-bold">sync</span>
                <p className="text-black font-black uppercase italic tracking-widest text-sm">Memuat aktivitas...</p>
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-5 p-5 border-3 border-black bg-white hover:bg-nb-yellow hover:-translate-y-1 transition-all group shadow-nb-hover hover:shadow-nb">
                  <div className="h-14 w-14 border-3 border-black bg-nb-blue text-black flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform italic">
                    {activity.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-black text-black leading-tight uppercase italic">{activity.home} Lunas</p>
                    <p className="text-[10px] font-black text-black/40 mt-1 uppercase tracking-widest">
                      {monthLabels[activity.month]} • {getTimeAgo(activity.updated_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-black bg-nb-green px-2 py-1 border-2 border-black">+Rp 5k</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center border-4 border-dashed border-black/10">
                <p className="text-black/30 font-black uppercase italic text-sm">Belum ada aktivitas</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => window.location.hash = '#/pendapatan'}
            className="w-full mt-10 py-5 border-4 border-black bg-nb-pink text-black font-[900] uppercase italic tracking-widest hover:shadow-nb transition-all flex items-center justify-center gap-3"
          >
            Lihat Semua Aktivitas <span className="material-symbols-outlined font-bold">arrow_forward</span>
          </button>
        </motion.section>
      </div>
    </DashboardLayout>
  );
}
