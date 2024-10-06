import swagger from '../../../swagger';

// pages/api/demo.js
/**
 * @swagger
 * /demo:
 *   get:
 *     summary: Returns a greeting message
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello from Next.js API!
 *   405:
 *     description: Method Not Allowed
 *     headers:
 *       Allow:
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ['GET']
 */

/**
 * API handler for demo endpoint.
 *
 * @param {import('next').NextApiRequest} req - The API request object.
 * @param {import('next').NextApiResponse} res - The API response object.
 */
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello from Next.js API!' });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
