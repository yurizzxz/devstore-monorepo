'use client'

import { useEffect, useState } from 'react'

export function usePedidosPorStatus() {
  const [pedidos, setPedidos] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const res = await fetch('/api/order-status')

        if (!res.ok) {
          throw new Error('Erro ao buscar pedidos por status')
        }

        const data = await res.json()
        setPedidos(data)
      } catch (err: any) {
        console.error('Erro:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [])

  return { pedidos, error, loading }
}
