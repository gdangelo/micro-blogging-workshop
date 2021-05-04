import { faunaQueries } from '@/lib/fauna';

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    const post = await faunaQueries.publishPost(id, req.body);
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}
