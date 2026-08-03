'use client'

import { useEffect, useState } from 'react'

interface ReceitaMensal {
  mes_ano: string;
  receita_total: number;
}

export function useReceitaPorMes() {
  const [receita, setReceita] = useState<ReceitaMensal[]>([]);
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReceita() {
      try {
        const res = await fetch('/api/receita')

        if (!res.ok) {
          throw new Error('Erro ao buscar receita por mês')
        }

        const data = await res.json()
        setReceita(data)
      } catch (err: any) {
        console.error('Erro:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReceita()
  }, [])

  return { receita, error, loading }
}
