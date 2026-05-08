import Home from './pages/Home'
import { Login } from './pages/Login'
import { Payments } from './pages/Payments'
import { Pengumuman } from './pages/Pengumuman'
import { MutasiKas } from './pages/MutasiKas'
import { Ringkasan } from './pages/Ringkasan'
import { Warga } from './pages/Warga'
import { useHashRoute } from './hooks/useHashRoute'

function App() {
  const [route] = useHashRoute()

  if (route === 'beranda') {
    return <Home />
  }

  return (
    <div className="min-h-screen text-ink">
      {route === 'login' && <Login />}
      {route === 'payments' && <Payments />}
      {route === 'content' && <Pengumuman />}
      {route === 'mutasi-kas' && <MutasiKas />}
      {route === 'ringkasan' && <Ringkasan />}
      {route === 'warga' && <Warga />}
    </div>
  )
}

export default App
