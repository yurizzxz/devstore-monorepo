import { getConnection } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM view_receita_por_mes');
    
    if (rows.length > 0) {
      return NextResponse.json(rows, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Dados não encontrados' }, { status: 404 });
    }
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json({ error: 'Erro ao calcular receita.' }, { status: 500 });
  }
}
