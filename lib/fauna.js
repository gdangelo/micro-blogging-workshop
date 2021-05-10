import faunadb, { query as q, Expr } from 'faunadb';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

// Flatten the result from FaunaDB
export const flattenData = obj => {
  if (!obj) return null;

  if (Array.isArray(obj.data)) {
    // recursively flatten all documents inside the data array
    return {
      ...obj,
      data: obj.data.map(e => flattenData(e)),
    };
  } else {
    // flatten the document's data
    return { ...obj.data, id: obj.ref.value.id };
  }
};

class QueryManager {
  constructor() {
    this.client = new faunadb.Client({
      secret: process.env.NEXT_PUBLIC_FAUNADB_SECRET,
    });
  }

  getAllSlugs() {
    return this.client.query(q.Paginate(q.Match(q.Index('all_slugs'))));
  }

  getPosts(options = {}) {
    const { author = null, ...opts } = options;
    return this.client
      .query(
        // iterate each item in result
        q.Map(
          // paginate the result into smaller chuncks (default size is 64)
          q.Paginate(
            q.Join(
              // get published posts only and by author (optional)
              author
                ? q.Match(q.Index('posts_by_published_author'), [true, author])
                : q.Match(q.Index('posts_by_published'), true),
              // sort them by published date (descending)
              q.Index('posts_sort_by_published_at_desc')
            ),
            opts
          ),
          // retrieve each document from the query
          q.Lambda(['published_at', 'ref'], q.Get(q.Var('ref')))
        )
      )
      .then(res => flattenData(res));
  }

  getDrafts(options = {}) {
    const { author = null, ...opts } = options;
    return this.client
      .query(
        q.Map(
          // Paginate the result into smaller chuncks (default siz is 64)
          q.Paginate(
            q.Join(
              // get NOT published posts only and by author (optional)
              author
                ? q.Match(q.Index('posts_by_published_author'), [false, author])
                : q.Match(q.Index('posts_by_published'), false),
              // sort them by updated_at date (descending)
              q.Index('posts_sort_by_updated_at_desc')
            ),
            opts
          ),
          // retrieve each document from the query
          q.Lambda(['updated_at', 'ref'], q.Get(q.Var('ref')))
        )
      )
      .then(res => flattenData(res));
  }

  getPost(id) {
    return this.client
      .query(q.Get(q.Ref(q.Collection('blog_posts'), id)))
      .then(res => flattenData(res));
  }

  getPostBySlug(slug) {
    return this.client
      .query(q.Get(q.Match(q.Index('posts_by_slug'), slug)))
      .then(res => flattenData(res));
  }

  createPost({ title, content, author }) {
    return this.client
      .query(
        q.Create(q.Collection('blog_posts'), {
          data: {
            title,
            content,
            author,
            published: false,
            created_at: q.ToString(q.Now()),
            updated_at: q.ToString(q.Now()),
          },
        })
      )
      .then(res => flattenData(res));
  }

  updatePost(id, data) {
    return this.client
      .query(
        q.Update(q.Ref(q.Collection('blog_posts'), id), {
          data: { ...data, updated_at: q.ToString(q.Now()) },
        })
      )
      .then(res => flattenData(res));
  }

  deletePost(id) {
    return this.client
      .query(q.Delete(q.Ref(q.Collection('blog_posts'), id)))
      .then(res => flattenData(res));
  }

  async publishPost(id, data) {
    const ref = q.Ref(q.Collection('blog_posts'), id);

    const post = await this.client
      .query(q.Get(ref))
      .then(res => flattenData(res));

    let slug;
    if (!post.slug) {
      const slugifiedTitle = slugify(data.title, {
        lower: true,
        strict: true,
      });
      slug = `${slugifiedTitle}-${uuidv4().split('-')[0]}`;
    }

    return this.client
      .query(
        q.Update(ref, {
          data: {
            ...data,
            slug,
            published: true,
            published_at: q.ToString(q.Now()),
            updated_at: q.ToString(q.Now()),
          },
        })
      )
      .then(res => flattenData(res));
  }

  toExpr(str) {
    return str ? new Expr(JSON.parse(str)) : null;
  }
}

export const faunaQueries = new QueryManager();
