import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      window.location.hash = '#/payments';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kredensial tidak valid. Silakan periksa kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 font-sans overflow-hidden bg-nb-cream selection:bg-nb-yellow text-black antialiased">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-nb-blue/20 border-4 border-black rotate-12 -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-nb-pink/20 border-4 border-black -rotate-6 -z-10" />

      {/* Card Login Utama */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-[450px] bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-10 md:p-14"
      >
        <a 
          href="#/beranda" 
          className="absolute top-6 left-6 border-2 border-black p-2 hover:bg-nb-cream transition-all flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          title="Kembali"
        >
          <span className="material-symbols-outlined text-xl font-bold">arrow_back</span>
        </a>

        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 border-4 border-black bg-nb-purple flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-white text-3xl font-bold">lock</span>
          </div>
          
          <h2 className="text-3xl font-[900] text-black tracking-tight uppercase italic italic" style={{ fontFamily: 'Lexend, sans-serif' }}>
            WARGABERSIH
          </h2>
          <span className="mt-3 inline-block px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-black bg-nb-yellow border-2 border-black">
            PORTAL PENGURUS
          </span>
        </div>
        
        <form className="space-y-8" onSubmit={handleLogin}>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 border-3 border-black bg-nb-pink p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <span className="material-symbols-outlined text-black text-xl shrink-0 font-bold">error</span>
                <p className="text-xs text-black font-black uppercase tracking-tight leading-tight">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-3">
            <label className="block text-[11px] font-black uppercase tracking-widest text-black/50 ml-1 italic">
              Nama Pengguna
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-black font-bold text-[22px]">person</span>
              </div>
              <input 
                type="text"
                className="w-full bg-nb-cream border-3 border-black text-black rounded-none pl-12 pr-4 py-4 transition-all outline-none placeholder:text-black/30 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-sm"
                placeholder="USERNAME..." 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="block text-[11px] font-black uppercase tracking-widest text-black/50 ml-1 italic">
              Kata Sandi
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-black font-bold text-[22px]">lock</span>
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full bg-nb-cream border-3 border-black text-black rounded-none pl-12 pr-12 py-4 transition-all outline-none placeholder:text-black/30 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-sm"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 text-black hover:bg-nb-cream transition-all flex items-center justify-center border-2 border-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-xl font-bold">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02, x: -2, y: -2 }}
            whileTap={{ scale: 0.98, x: 2, y: 2 }}
            type="submit" 
            className="w-full bg-nb-blue border-4 border-black font-black text-lg uppercase py-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin font-bold">sync</span>
                <span>PROSES...</span>
              </>
            ) : (
              <>
                <span>MASUK</span>
                <span className="material-symbols-outlined font-bold">login</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
      
      <div className="absolute bottom-8 text-center w-full z-10 pointer-events-none">
        <p className="text-black/50 text-[10px] font-black tracking-widest uppercase italic">
          © {new Date().getFullYear()} WargaBersih · Sistem Transparansi Lingkungan
        </p>
      </div>
    </main>
  );
}