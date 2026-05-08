export interface PaymentRow {
  name: string;
  home: string;
  role: string;
  months: string[];
}

export const paymentRows: PaymentRow[] = [
  {
    name: 'Aditya Surya',
    home: 'B1-12',
    role: 'Warga tetap',
    months: ['paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'pending', 'pending'],
  },
  {
    name: 'Budi Eko',
    home: 'B1-14',
    role: 'Kepala keluarga',
    months: ['paid', 'paid', 'late', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending'],
  },
  {
    name: 'Citra Ayu',
    home: 'A2-09',
    role: 'Koordinator blok',
    months: ['paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'pending', 'pending', 'pending'],
  },
  {
    name: 'Dimas Hadi',
    home: 'C3-03',
    role: 'Warga tetap',
    months: ['paid', 'paid', 'paid', 'late', 'paid', 'paid', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending'],
  },
]

export interface Notice {
  title: string;
  detail: string;
  date: string;
  accent: string;
}

export const activeNotices: Notice[] = [
  {
    title: 'Kerja Bakti Komunitas 2024',
    detail: 'Mulai dari gerbang utama pukul 07.00 dengan pembagian alat kebersihan dan area kerja.',
    date: '24 Okt 2024',
    accent: 'bg-primaryFixed text-primary',
  },
  {
    title: 'Pemeliharaan Pompa Air Malam Ini',
    detail: 'Akan ada penurunan debit air pukul 22.00-04.00 selama inspeksi rutin instalasi.',
    date: '21 Okt 2024',
    accent: 'bg-surfaceVariant text-ink',
  },
]

export interface LedgerRow {
  date: string;
  name: string;
  type: string;
  amount: string;
  accent: string;
}

export const ledgerRows: LedgerRow[] = [
  {
    date: '25 Okt 2024',
    name: 'Gaji petugas kebersihan Oktober',
    type: 'Pengeluaran',
    amount: '- Rp 3.500.000',
    accent: 'bg-dangerSoft text-danger',
  },
  {
    date: '24 Okt 2024',
    name: 'Setoran iuran Blok A',
    type: 'Pemasukan',
    amount: '+ Rp 2.200.000',
    accent: 'bg-primaryFixed text-primary',
  },
  {
    date: '22 Okt 2024',
    name: 'Perbaikan pompa taman',
    type: 'Pengeluaran',
    amount: '- Rp 450.000',
    accent: 'bg-dangerSoft text-danger',
  },
]

export interface Route {
  id: string;
  label: string;
}

export const routes: Route[] = [
  { id: 'beranda', label: 'Beranda Warga' },
  { id: 'login', label: 'Login Admin' },
  { id: 'payments', label: 'Dashboard Pembayaran' },
  { id: 'content', label: 'Pengumuman' },
  { id: 'mutasi-kas', label: 'Mutasi Kas' },
  { id: 'ringkasan', label: 'Ringkasan' },
  { id: 'warga', label: 'Manajemen Warga' },
]

export const adminMenu = ['Ringkasan', 'Pendapatan', 'Pengumuman', 'Warga']
export const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
