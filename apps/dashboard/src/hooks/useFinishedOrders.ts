'use client';

import { useEffect, useState } from 'react'

export function useFinishedOrders() {
  const [finishedOrders, setFinishedOrders] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFaturamento() {
      try {
        const res = await fetch('/api/finished-orders')

        if (!res.ok) {
          throw new Error('Erro ao buscar dados da API')
        }

        const data = await res.json()

        setFinishedOrders(data.orders)
      } catch (err: any) {  
        console.error('Erro:', err)
        setError(err.message)
      }
    }

    fetchFaturamento()
  }, [])

  return { finishedOrders, error }
}
