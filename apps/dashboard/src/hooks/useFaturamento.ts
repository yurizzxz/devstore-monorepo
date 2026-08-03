'use client';

import { useEffect, useState } from 'react'

export function useFaturamentoTotal() {
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFaturamento() {
      try {
        const res = await fetch('/api/faturamento')

        if (!res.ok) {
          throw new Error('Erro ao buscar dados da API')
        }

        const data = await res.json()

        setTotal(data.total)
      } catch (err: any) {  
        console.error('Erro:', err)
        setError(err.message)
      }
    }

    fetchFaturamento()
  }, [])

  return { total, error }
}
