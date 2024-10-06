// pages/api/checkEmail.js
import { dbConnect } from '../../lib/db';
import cors from './cors';
import User from '../../models/User';

export default async function handler(req, res) {
  await cors(req, res); // Handle CORS

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    await dbConnect();

    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
