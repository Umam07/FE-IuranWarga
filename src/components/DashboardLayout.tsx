import React, { useEffect, useState } from 'react';
import { adminMenu } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  active: string;
  children: React.ReactNode;
}

interface NavItemProps {
  item: string;
  active: string;
  isMinimized: boolean;
  idx: number;
}

function NavItem({ item, active, isMinimized, idx }: NavItemProps) {
  const isMutasiRoute = window.location.hash.includes('mutasi-kas');
  const isActive = item === active || (item === 'Pengumuman' && isMutasiRoute);
  const isPengumuman = item === 'Pengumuman';
  const [isOpen, setIsOpen] = useState(isActive || isMutasiRoute);

  const getIcon = (menu: string) => {
    switch(menu) {
      case 'Ringkasan': return 'grid_view';
      case 'Pendapatan': return 'account_balance_wallet';
      case 'Pengumuman': return 'campaign';
      case 'Laporan': return 'analytics';
      case 'Warga': return 'group';
      default: return 'circle';
    }
  };

  const getHref = (menu: string) => {
    switch(menu) {
      case 'Ringkasan': return '#/ringkasan';
      case 'Pendapatan': return '#/payments';
      case 'Pengumuman': return '#/content';
      case 'mutasi-kas': return '#/mutasi-kas';
      case 'Warga': return '#/warga';
      default: return '#/content';
    }
  };

  if (isPengumuman && !isMinimized) {
    return (
      <div className="space-y-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full group flex items-center justify-between border-3 border-black px-4 py-4 transition-all duration-200 ${
            isActive 
              ? 'bg-nb-blue text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
              : 'bg-white text-black hover:bg-nb-cream'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined font-bold">{getIcon(item)}</span>
            <span className="font-black text-[14px] tracking-tight uppercase italic">{item}</span>
          </div>
          <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} font-bold`}>
            expand_more
          </span>
        </button>
        
        {isOpen && (
          <div className="pl-6 space-y-2">
            {[
              { label: 'Pengumuman', icon: 'campaign', href: '#/content' },
              { label: 'Pencatatan Mutasi Kas', icon: 'account_balance', href: '#/mutasi-kas' }
            ].map((sub) => {
              const isSubActive = window.location.hash === sub.href;
              return (
                <a
                  key={sub.label}
                  href={sub.href}
                  className={`flex items-center gap-3 py-3 px-4 border-2 border-black font-black text-[12px] uppercase transition-all ${
                    isSubActive ? 'bg-nb-yellow shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-nb-cream'
                  }`}
                >
                  <span className="material-symbols-outlined text-base font-bold">{sub.icon}</span>
                  {sub.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={getHref(item)}
      className={`group flex items-center ${isMinimized ? 'justify-center' : 'gap-4'} border-3 border-black px-4 py-4 transition-all duration-200 relative ${
        isActive 
          ? 'bg-nb-blue text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
          : 'bg-white text-black hover:bg-nb-cream hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
      }`}
      title={isMinimized ? item : ""}
    >
      <span className="material-symbols-outlined font-bold">{getIcon(item)}</span>
      {!isMinimized && <span className="font-black text-[14px] tracking-tight uppercase italic">{item}</span>}
      {isActive && !isMinimized && (
        <div className="absolute right-4 w-2 h-2 bg-black animate-pulse" />
      )}
    </a>
  );
}

export function DashboardLayout({ title, subtitle, active, children }: DashboardLayoutProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.hash = '#/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = '#/login';
  };

  return (
    <div className="flex min-h-screen bg-nb-cream font-sans antialiased text-black selection:bg-nb-yellow selection:text-black overflow-x-hidden">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-50 h-screen bg-white border-r-4 border-black transition-all duration-300 
          ${isMinimized ? 'w-24' : 'w-80'} 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex h-full flex-col p-6">
          {/* Header Sidebar */}
          <div className={`flex items-center ${isMinimized ? 'justify-center' : 'justify-between'} mb-12`}>
            {(!isMinimized || isMobileMenuOpen) && (
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 border-3 border-black bg-nb-purple flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                   <span className="material-symbols-outlined text-white text-xl font-bold">cleaning_services</span>
                </div>
                <h2 className="text-xl font-black tracking-tighter italic uppercase" style={{ fontFamily: 'Lexend, sans-serif' }}>WargaBersih</h2>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="hidden lg:flex border-2 border-black p-2 hover:bg-nb-cream transition-all"
                title={isMinimized ? "Expand Menu" : "Collapse Menu"}
              >
                <span className="material-symbols-outlined text-black font-bold">
                  {isMinimized ? 'dock_to_right' : 'dock_to_left'}
                </span>
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden border-2 border-black p-2 hover:bg-nb-pink transition-all"
              >
                <span className="material-symbols-outlined text-black font-bold">close</span>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-3">
            {adminMenu.map((item, idx) => (
              <NavItem key={item} item={item} active={active} isMinimized={isMinimized} idx={idx} />
            ))}
          </nav>

          {/* Logout Section */}
          <div className="mt-auto pt-6 border-t-4 border-black">
            <button 
              onClick={handleLogout}
              className={`flex w-full items-center ${isMinimized ? 'justify-center' : 'gap-4'} border-3 border-black bg-nb-pink px-4 py-4 font-black uppercase text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
              title={isMinimized ? "Keluar" : ""}
            >
              <span className="material-symbols-outlined font-bold">logout</span>
              {!isMinimized && <span className="font-black italic">Keluar</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={`flex-1 transition-all duration-300 ${
          isMinimized ? 'lg:ml-24' : 'lg:ml-80'
        } ml-0`}
      >
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <motion.header 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-8 lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
              >
                <span className="material-symbols-outlined font-bold">menu</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 border-3 border-black bg-nb-purple flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                   <span className="material-symbols-outlined text-white text-xl font-bold">cleaning_services</span>
                </div>
                <h2 className="text-xl font-black italic uppercase" style={{ fontFamily: 'Lexend, sans-serif' }}>WargaBersih</h2>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <span className="w-fit border-2 border-black bg-nb-yellow px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                Admin Panel System
              </span>
              <h1 className="text-5xl md:text-7xl font-[900] tracking-tighter text-black leading-[0.9] uppercase italic" style={{ fontFamily: 'Lexend, sans-serif' }}>{title}</h1>
              <p className="max-w-3xl text-black/70 text-xl font-black italic leading-tight">{subtitle}</p>
            </div>
          </motion.header>

          <AnimatePresence mode="wait">
            <motion.div 
              key={active}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="pb-20"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
