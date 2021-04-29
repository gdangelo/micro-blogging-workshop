import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import faunadb, { query as q } from 'faunadb';

import {
  EyeIcon,
  PencilIcon,
  LightningBoltIcon,
} from '@heroicons/react/outline';
import { MarkdownIcon } from '../components';
import { Layout } from '../sections';

const db = new faunadb.Client({
  secret: process.env.NEXT_PUBLIC_FAUNADB_SECRET,
});

const tabs = [
  { text: 'Write', icon: PencilIcon },
  { text: 'Preview', icon: EyeIcon },
];

const Write = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  const [activeTab, setActiveTab] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!(session || loading)) {
      router.push('/api/auth/signin');
    }
  }, [session, loading]);

  const publishPost = async () => {
    try {
      if (title && content) {
        setPublishing(true);

        await db.query(
          q.Create(q.Collection('blog_posts'), {
            data: {
              title,
              content,
            },
          })
        );

        setTitle('');
        setContent('');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return 'Loading...';

  if (!session) return 'Redirecting...';

  return (
    <Layout>
      <div className="w-full max-w-screen-lg mx-auto pt-12 space-y-6">
        {/* Blog post title */}
        <textarea
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength="150"
          placeholder="Title…"
          className="w-full text-3xl font-bold leading-snug bg-transparent outline-none appearance-none resize-none"
        />

        <div>
          {/* Action tabs */}
          <div className="flex justify-between items-center space-x-2 pl-2 pr-4 sm:pl-4 sm:pr-6 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100">
            <div className="flex items-center space-x-2">
              {tabs.map(({ text, icon: Icon }, i) => (
                <button
                  key={text}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center space-x-1 transition-colors px-2 py-1 rounded-md focus:outline-none ${
                    activeTab === i
                      ? 'text-blue-600 cursor-default select-none'
                      : 'hover:text-blue-600 bg-transparent hover:bg-blue-100 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{text}</span>
                </button>
              ))}

              <a
                href="https://daringfireball.net/projects/markdown/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <MarkdownIcon className="w-5 h-5" />
              </a>
            </div>

            <button
              type="button"
              onClick={publishPost}
              disabled={!(title && content) || publishing}
              className="flex items-center space-x-1 transition-colors px-4 py-1 rounded-md focus:outline-none border border-blue-600 bg-blue-600 text-gray-100 hover:text-gray-700 dark:text-gray-100 hover:bg-transparent hover:border-gray-700 dark:hover:border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LightningBoltIcon className="w-5 h-5" />
              <span>Publish</span>
            </button>
          </div>

          {/* Blog post content */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Tell your story..."
            className="w-full resize-none p-4 bg-transparent focus:outline-none text-xl leading-snug py-12 min-h-screen"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Write;
