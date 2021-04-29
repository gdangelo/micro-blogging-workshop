import faunadb, { query as q } from 'faunadb';
import slugify from 'slugify';

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
          published_at: q.ToString(q.Now()),
          author,
          slug: slugify(title, {
            lower: true,
            strict: true,
          }),
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

  getPostBySlug(slug) {
    return this.client.query(q.Get(q.Match(q.Index('posts_by_slug'), slug)));
  }
}

const faunaQueries = new QueryManager();
export { faunaQueries, QueryManager };
