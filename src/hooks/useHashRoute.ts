import { useState, useEffect } from 'react'
import { routes } from '../data/mockData'

export function useHashRoute(): [string] {
  const readRoute = (): string => {
    const hash = window.location.hash.replace('#/', '')
    const current = hash.split('#')[0] || 'beranda'
    return routes.some((item) => item.id === current) ? current : 'beranda'
  }
  const [route, setRoute] = useState<string>(readRoute)

  useEffect(() => {
    const onChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onChange)

    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/beranda')
    }

    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return [route]
}
