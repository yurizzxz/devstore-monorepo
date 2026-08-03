import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

async function getOrders() {
  let connection;
  try {
    connection = await getConnection();
    const [orders] = await connection.query("SELECT * FROM orders");
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

async function createOrder(req) {
  let connection;
  try {
    const data = await req.json();
    const { user_id, total, status } = data;

    connection = await getConnection();
    const [result] = await connection.query(
      `INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)`,
      [user_id, total, status]
    );

    const orderId = result.insertId;

    const products = data.products; 
    for (const product of products) {
      const { produto_id, quantidade, preco } = product;
      await connection.query(
        `INSERT INTO order_products (order_id, produto_id, quantidade, preco) VALUES (?, ?, ?, ?)`,
        [orderId, produto_id, quantidade, preco]
      );
    }

    return NextResponse.json({ message: "Pedido criado!", orderId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

async function updateOrder(req) {
  let connection;
  try {
    const data = await req.json();
    const { id, total, status } = data;
    const orderId = Number(id);

    if (!orderId || isNaN(orderId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    connection = await getConnection();
    await connection.query(
      `UPDATE orders SET total=?, status=? WHERE id=?`,
      [total, status, orderId]
    );

    return NextResponse.json({ message: "Pedido atualizado!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

async function deleteOrder(req) {
  let connection;
  try {
    const { id } = await req.json();

    connection = await getConnection();
    await connection.query(`DELETE FROM orders WHERE id=?`, [id]);

    await connection.query(`DELETE FROM order_products WHERE order_id=?`, [id]);

    return NextResponse.json({ message: "Pedido deletado!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function GET() {
  return await getOrders();
}

export async function POST(req) {
  return await createOrder(req);
}

export async function PUT(req) {
  return await updateOrder(req);
}

export async function DELETE(req) {
  return await deleteOrder(req);
}
