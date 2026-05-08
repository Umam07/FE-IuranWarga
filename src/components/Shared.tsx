import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon?: string;
  className?: string;
}

export function MetricCard({ title, value, description, icon, className = '' }: MetricCardProps) {
  return (
    <motion.div 
      whileHover={{ x: -4, y: -4 }}
      className={`bg-white p-6 border-3 border-black shadow-nb relative overflow-hidden group transition-all hover:shadow-nb-lg ${className}`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/50">{title}</p>
          {icon && (
            <div className="p-2 bg-nb-cream border-2 border-black text-black group-hover:bg-nb-yellow transition-colors">
              <span className="material-symbols-outlined text-xl font-bold">{icon}</span>
            </div>
          )}
        </div>
        <p className="text-3xl font-[900] tracking-tight text-black italic font-lexend">{value}</p>
        <p className="mt-3 text-xs font-bold text-black/60 leading-tight uppercase italic">{description}</p>
      </div>
      <div className="absolute -right-6 -bottom-6 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity pointer-events-none">
        <span className="material-symbols-outlined text-[120px] font-bold">{icon || 'stat_0'}</span>
      </div>
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  note: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ title, value, note, icon, trend, className = '' }: StatCardProps) {
  return (
    <motion.article 
      whileHover={{ x: -4, y: -4 }}
      className={`bg-white p-6 border-3 border-black shadow-nb flex flex-col justify-between min-h-[160px] transition-all hover:shadow-nb-lg ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="p-3 bg-nb-blue border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span className="material-symbols-outlined text-xl font-bold text-black">{icon || 'analytics'}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-3 py-1 border-2 border-black font-black text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
            trend === 'up' ? 'bg-nb-green text-black' : 
            trend === 'down' ? 'bg-nb-pink text-black' : 'bg-nb-cream text-black'
          }`}>
            <span className="material-symbols-outlined text-xs font-bold">
              {trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'horizontal_rule'}
            </span>
            {trend === 'up' ? 'Naik' : trend === 'down' ? 'Turun' : 'Stabil'}
          </div>
        )}
      </div>
      <div className="mt-6">
        <p className="text-[11px] font-black text-black/40 uppercase tracking-[0.2em] leading-none mb-2">{title}</p>
        <p className="text-2xl font-[900] text-black tracking-tighter italic font-lexend">{value}</p>
        <p className="text-[10px] font-black text-black/60 mt-3 flex items-center gap-1.5 uppercase italic">
          <span className="material-symbols-outlined text-[14px] font-bold">info</span>
          {note}
        </p>
      </div>
    </motion.article>
  );
}

interface StatusDotProps {
  status: string;
}

export function StatusDot({ status }: StatusDotProps) {
  const getStyles = () => {
    switch (status) {
      case 'paid': return 'bg-nb-green border-black';
      case 'late': return 'bg-nb-pink border-black';
      case 'pending': return 'bg-nb-yellow border-black';
      default: return 'bg-white border-black/20';
    }
  };

  return (
    <div className="flex justify-center">
      <div 
        className={`h-4 w-4 border-2 ${getStyles()} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-125 transition-transform duration-200 cursor-help`} 
        title={status.toUpperCase()}
      />
    </div>
  );
}

