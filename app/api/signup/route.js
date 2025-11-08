import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { fullName, email, password } = await req.json();

    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return Response.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [fullName, email, hashedPassword]
    );

    return Response.json({ message: 'Account created successfully!', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
