import { faunaQueries } from '@/lib/fauna';

export default async function handler(req, res) {
  try {
    const { size = 10, cursor = undefined, author = '' } = req.query;

    // Fetch the most recent posts
    const posts = await faunaQueries.getDrafts({
      // author's email
      author,
      // page size
      size,
      // /!\ should pass a FaunaDB Query Expression to the cursor (after)
      // use 'Expr' from faunadb-js to convert query param to Expression
      after: faunaQueries.toExpr(cursor),
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}
