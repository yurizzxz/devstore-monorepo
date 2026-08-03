'use client'

import { useEffect, useState } from 'react'

export function useCategoriasMaisVendidas() {
  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch('/api/bests-categories')

        if (!res.ok) {
          throw new Error('Erro ao buscar categorias mais vendidas')
        }

        const data = await res.json()
        setCategorias(data)
      } catch (err: any) {
        console.error('Erro:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategorias()
  }, [])

  return { categorias, error, loading }
}
