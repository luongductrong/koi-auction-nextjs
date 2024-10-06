// pages/api/users.js
import { dbConnect } from '../../lib/db';
import cors from './cors';

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user ID.
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The user's name.
 *                     example: John Doe
 *       500:
 *         description: Error fetching data
 *     tags:
 *       - Users
 */

/**
 * API handler for managing users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - The result of the API handler.
 */

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'GET') {
    try {
      const pool = await dbConnect();
      const result = await pool.request().query('SELECT * FROM [User]');
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
