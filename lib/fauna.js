import faunadb, { query as q } from 'faunadb';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

class QueryManager {
  constructor() {
    this.client = new faunadb.Client({
      secret: process.env.NEXT_PUBLIC_FAUNADB_SECRET,
    });
  }

  createPost(title, content, author) {
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
          published: false,
          author,
          slug,
          created_at: q.ToString(q.Now()),
          updated_at: q.ToString(q.Now()),
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
}

const faunaQueries = new QueryManager();
export { faunaQueries, QueryManager };
