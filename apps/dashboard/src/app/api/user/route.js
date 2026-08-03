import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

async function getUsers() {
  let connection;
  try {
    connection = await getConnection();
    const [users] = await connection.query("SELECT * FROM users");
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

async function createUser(req) {
  let connection;
  try {
    const data = await req.json();
    const {
      nome,
      email,
      password,
      telefone,
      cpf,
      rua,
      cidade,
      estado,
      cep,
      cargo,
    } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    connection = await getConnection();
    const [result] = await connection.query(
      `INSERT INTO users (nome, email, password, telefone, cpf, rua, cidade, estado, cep, cargo)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        email,
        hashedPassword,
        telefone,
        cpf,
        rua,
        cidade,
        estado,
        cep,
        cargo,
      ]
    );

    return NextResponse.json({
      message: "Usuário cadastrado!",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

async function updateUser(req) {
  let connection;
  try {
    const data = await req.json();

    const { id, password, ...rest } = data;
    const userId = Number(id);

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const fields = { ...rest };

    if (password) {
      fields.password = await bcrypt.hash(password, 10);
    }

    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) {
      return NextResponse.json(
        { message: "Nenhum campo para atualizar." },
        { status: 400 }
      );
    }

    const setClause = keys.map((key) => `${key}=?`).join(", ");

    console.log("Query:", `UPDATE users SET ${setClause} WHERE id=?`, [
      ...values,
      userId,
    ]);

    connection = await getConnection();
    await connection.query(`UPDATE users SET ${setClause} WHERE id=?`, [
      ...values,
      userId,
    ]);

    return NextResponse.json({ message: "Usuário atualizado!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

async function deleteUser(req) {
  let connection;
  try {
    const { id } = await req.json();

    connection = await getConnection();
    await connection.query(`DELETE FROM users WHERE id=?`, [id]);

    return NextResponse.json({ message: "Usuário deletado!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function GET() {
  return await getUsers();
}

export async function POST(req) {
  return await createUser(req);
}

export async function PUT(req) {
  return await updateUser(req);
}

export async function DELETE(req) {
  return await deleteUser(req);
}
