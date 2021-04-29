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

  getPosts(options) {
    return this.client.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index('posts_sort_by_published_at_desc')),
          options
        ),
        q.Lambda(['published_at', 'ref'], q.Get(q.Var('ref')))
      )
    );
  }

  getPostBySlug(slug) {
    return this.client.query(q.Get(q.Match(q.Index('posts_by_slug'), slug)));
  }
}

const faunaQueries = new QueryManager();
export { faunaQueries, QueryManager };
