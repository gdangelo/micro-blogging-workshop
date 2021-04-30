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

  getPost(id) {
    return this.client.query(q.Get(q.Ref(q.Collection('blog_posts'), id)));
  }

  getPostBySlug(slug) {
    return this.client.query(q.Get(q.Match(q.Index('posts_by_slug'), slug)));
  }

  updatePost(id, data) {
    return this.client.query(
      q.Update(q.Ref(q.Collection('blog_posts'), id), { data })
    );
  }

  deletePost(id) {
    return this.client.query(q.Delete(q.Ref(q.Collection('blog_posts'), id)));
  }
}

const faunaQueries = new QueryManager();
export { faunaQueries, QueryManager };