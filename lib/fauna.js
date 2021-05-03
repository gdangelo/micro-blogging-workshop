import faunadb, { query as q, Expr } from 'faunadb';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

class QueryManager {
  constructor() {
    this.client = new faunadb.Client({
      secret: process.env.NEXT_PUBLIC_FAUNADB_SECRET,
    });
  }

  getPosts(options) {
    return this.client.query(
      // iterate each item in result
      q.Map(
        // paginate the result into smaller chuncks (default size is 64)
        q.Paginate(
          q.Join(
            // get published posts only
            q.Match(q.Index('posts_by_published'), true),
            // sort them by published date (descending)
            q.Index('posts_sort_by_published_at_desc')
          ),
          options
        ),
        // retrieve each document from the query
        q.Lambda(['published_at', 'ref'], q.Get(q.Var('ref')))
      )
    );
  }

  getDrafts(options) {
    return this.client.query(
      q.Map(
        // Paginate the result into smaller chuncks (default siz is 64)
        q.Paginate(
          q.Join(
            // get NOT published posts only
            q.Match(q.Index('posts_by_published'), false),
            // sort them by updated_at date (descending)
            q.Index('posts_sort_by_updated_at_desc')
          ),
          options
        ),
        // retrieve each document from the query
        q.Lambda(['updated_at', 'ref'], q.Get(q.Var('ref')))
      )
    );
  }

  getPost(id) {
    return this.client.query(q.Get(q.Ref(q.Collection('blog_posts'), id)));
  }

  getPostBySlug(slug) {
    return this.client.query(q.Get(q.Match(q.Index('posts_by_slug'), slug)));
  }

  createPost({ title, content, author }) {
    const slugifiedTitle = slugify(title, {
      lower: true,
      strict: true,
    });
    const slug = `${slugifiedTitle}-${uuidv4().split('-')[0]}`;

    return this.client.query(
      q.Create(q.Collection('blog_posts'), {
        data: {
          title,
          content,
          author,
          slug,
          published: false,
          created_at: q.ToString(q.Now()),
          updated_at: q.ToString(q.Now()),
        },
      })
    );
  }

  updatePost(id, data) {
    return this.client.query(
      q.Update(q.Ref(q.Collection('blog_posts'), id), {
        data: { ...data, updated_at: q.ToString(q.Now()) },
      })
    );
  }

  deletePost(id) {
    return this.client.query(q.Delete(q.Ref(q.Collection('blog_posts'), id)));
  }

  publishPost(id) {
    return this.client.query(
      q.Update(q.Ref(q.Collection('blog_posts'), id), {
        data: {
          published: true,
          published_at: q.ToString(q.Now()),
          updated_at: q.ToString(q.Now()),
        },
      })
    );
  }

  toExpr(obj) {
    return obj ? new Expr(JSON.parse(obj)) : null;
  }
}

const faunaQueries = new QueryManager();
export { faunaQueries, QueryManager };
