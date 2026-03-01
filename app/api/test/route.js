import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT NOW()');
    return Response.json({
      message: 'Connected successfully!',
      time: result.rows[0].now,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

