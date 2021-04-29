import faunadb, { query as q } from 'faunadb';

class QueryManager {
  constructor() {
    this.client = new faunadb.Client({
      secret: process.env.NEXT_PUBLIC_FAUNADB_SECRET,
    });
  }

  createPost(title, content, author) {
    return this.client.query(
      q.Create(q.Collection('blog_posts'), {
        data: {
          title,
          content,
          published: true,
          published_at: q.Time('now'),
          author,
        },
      })
    );
  }

  getPosts() {
    return this.client.query(
      q.Map(
        q.Paginate(q.Match(q.Index('all_posts')), { size: 10 }),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    );
  }
}

const faunaQueries = new QueryManager();
export { faunaQueries, QueryManager };
