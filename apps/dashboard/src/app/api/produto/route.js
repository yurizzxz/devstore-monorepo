import { getConnection } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function getProducts() {
  let connection
  try {
    connection = await getConnection()
    const [produtos] = await connection.query('SELECT * FROM produto')
    return NextResponse.json(produtos)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

async function createProduct(req) {
	let connection;
	try {
	  const data = await req.json();
	  const {
		nome,
		description,
		foto,
		categoriaId,
		specifications,
		preco,
		estrelas,
		categoriaId2,
		estoque,
	  } = data;
  
	  connection = await getConnection();
  
	  const fields = [
		'nome',
		'description',
		'foto',
		'categoriaId',
		'specifications',
		'preco',
		'estrelas',
		'estoque',
	  ];
	  const values = [
		nome,
		description,
		foto,
		categoriaId,
		specifications,
		preco,
		estrelas,
		estoque,
	  ];
  
	  if (categoriaId2 && categoriaId2 !== "") {
		fields.push('categoriaId2');
		values.push(categoriaId2);
	  }
  
	  const placeholders = fields.map(() => '?').join(', ');
	  const query = `INSERT INTO produto (${fields.join(', ')}) VALUES (${placeholders})`;
  
	  const [result] = await connection.query(query, values);
  
	  return NextResponse.json({
		message: 'Produto cadastrado!',
		id: result.insertId,
	  });
	} catch (error) {
	  console.error(error);
	  return NextResponse.json({ error: error.message }, { status: 500 });
	} finally {
	  if (connection) connection.release();
	}
  }
  

async function updateProduct(req) {
  let connection
  try {
    const data = await req.json()
    const { id, ...rest } = data
    const productId = Number(id)

    if (!productId || isNaN(productId)) {
      return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
    }

    const fields = { ...rest }
    const keys = Object.keys(fields)
    const values = Object.values(fields)

    if (keys.length === 0) {
      return NextResponse.json(
        { message: 'Nenhum campo para atualizar.' },
        { status: 400 }
      )
    }

    const setClause = keys.map((key) => `${key}=?`).join(', ')

    connection = await getConnection()
    await connection.query(`UPDATE produto SET ${setClause} WHERE id=?`, [
      ...values,
      productId,
    ])

    return NextResponse.json({ message: 'Produto atualizado!' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

async function deleteProduct(req) {
  let connection
  try {
    const { id } = await req.json()

    connection = await getConnection()
    await connection.query(`DELETE FROM produto WHERE id=?`, [id])

    return NextResponse.json({ message: 'Produto deletado!' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

export async function GET() {
  return await getProducts()
}

export async function POST(req) {
  return await createProduct(req)
}

export async function PUT(req) {
  return await updateProduct(req)
}

export async function DELETE(req) {
  return await deleteProduct(req)
}
