import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

async function getSections() {
  let connection;
  try {
    connection = await getConnection();
    const [sections] = await connection.query("SELECT * FROM sections");
    return NextResponse.json(sections);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

async function createSection(req) {
  let connection;
  try {
    const data = await req.json();
    const { titulo, tipo, categoriaId, ordem, ativo } = data;

    connection = await getConnection();
    const [result] = await connection.query(
      `INSERT INTO sections (titulo, tipo, categoriaId, ordem, ativo)
       VALUES (?, ?, ?, ?, ?)`,
      [titulo, tipo, categoriaId, ordem, ativo]
    );

    return NextResponse.json({
      message: "Seção criada!",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

async function updateSection(req) {
  let connection;
  try {
    const data = await req.json();

    const { id, ...rest } = data;
    const sectionId = Number(id);

    if (!sectionId || isNaN(sectionId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const fields = { ...rest };
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) {
      return NextResponse.json(
        { message: "Nenhum campo para atualizar." },
        { status: 400 }
      );
    }

    const setClause = keys.map((key) => `${key}=?`).join(", ");

    console.log("Query:", `UPDATE sections SET ${setClause} WHERE id=?`, [
      ...values,
      sectionId,
    ]);

    connection = await getConnection();
    await connection.query(`UPDATE sections SET ${setClause} WHERE id=?`, [
      ...values,
      sectionId,
    ]);

    return NextResponse.json({ message: "Seção atualizada!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

async function deleteSection(req) {
  let connection;
  try {
    const { id } = await req.json();

    connection = await getConnection();
    await connection.query(`DELETE FROM sections WHERE id=?`, [id]);

    return NextResponse.json({ message: "Seção deletada!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function GET() {
  return await getSections();
}

export async function POST(req) {
  return await createSection(req);
}

export async function PUT(req) {
  return await updateSection(req);
}

export async function DELETE(req) {
  return await deleteSection(req);
}
