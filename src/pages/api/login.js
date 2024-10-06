import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbConnect } from '../../lib/db';
import cors from './cors';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email or username.
 *                 example: ldtttt
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: ABCD
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token.
 *                 user:
 *                   type: object
 *                   properties:
 *                     UserID:
 *                       type: integer
 *                       description: The user's ID.
 *                     UserName:
 *                       type: string
 *                       description: The user's username.
 *                     FullName:
 *                       type: string
 *                       description: The user's full name.
 *                     Email:
 *                       type: string
 *                       description: The user's email.
 *                     Role:
 *                       type: string
 *                       description: The user's role.
 *       401:
 *         description: Invalid credentials or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Invalid credentials
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Method not allowed
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Internal server error
 *     tags:
 *       - Authentication
 */

/**
 * Handles the login request.
 *
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 * @returns {Promise<void>}
 */

export default async function handler(req, res) {
  cors(req, res);
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const pool = await dbConnect();

    const result = await pool
      .request()
      .input('email', email)
      .query('SELECT * FROM [User] WHERE Email = @email OR UserName = @email');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        UserID: user.UserID,
        Role: user.Role,
      },
      JWT_SECRET,
      { expiresIn: '1h' },
    );

    res.status(200).json({
      token,
      user: {
        UserID: user.UserID,
        UserName: user.UserName,
        FullName: user.FullName,
        Email: user.Email,
        Role: user.Role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
