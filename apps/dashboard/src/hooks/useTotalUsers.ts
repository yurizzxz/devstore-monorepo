'use client';

import { useEffect, useState } from 'react'

export function useTotalUsers() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTotalUsers() {
      try {
        const res = await fetch('/api/total-users')

        if (!res.ok) {
          throw new Error('Erro ao buscar dados da API')
        }

        const data = await res.json()

        setTotalUsers(data.users)
      } catch (err: any) {  
        console.error('Erro:', err)
        setError(err.message)
      }
    }

    fetchTotalUsers()
  }, [])

  return { totalUsers, error }
}
