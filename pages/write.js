import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { EyeIcon, PencilIcon, SupportIcon } from '@heroicons/react/outline';
import { MarkdownIcon } from '../components';
import { Layout } from '../sections';

const tabs = [
  { text: 'Write', icon: PencilIcon },
  { text: 'Preview', icon: EyeIcon },
  { text: 'Guide', icon: SupportIcon },
];

const Write = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  const [activeTab, setActiveTab] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!(session || loading)) {
      router.push('/api/auth/signin');
    }
  }, [session, loading]);

  if (loading) return 'Loading...';

  if (!session) return 'Redirecting...';

  return (
    <Layout>
      <div className="w-full max-w-screen-lg mx-auto pt-12 space-y-6">
        {/* Blog post title */}
        <textarea
          vaue={title}
          onChange={e => setTitle(e.target.value)}
          maxlength="150"
          placeholder="Title…"
          class="w-full text-3xl font-bold leading-snug bg-transparent outline-none appearance-none resize-none"
        />

        <div>
          {/* Action tabs */}
          <div className="flex justify-between items-center space-x-2 px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100">
            <div className="flex items-center space-x-2">
              {tabs.map(({ text, icon: Icon }, i) => (
                <button
                  key={text}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center space-x-1 transition-colors px-2 py-1 rounded focus:outline-none ${
                    activeTab === i
                      ? 'text-blue-600 bg-blue-100 cursor-default select-none'
                      : 'hover:text-blue-600 bg-transparent hover:bg-blue-100 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{text}</span>
                </button>
              ))}
            </div>

            <a
              href="https://daringfireball.net/projects/markdown/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-blue-600"
            >
              <MarkdownIcon className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs">Markdown supported</span>
            </a>
          </div>

          {/* Blog post content */}
          <textarea
            vaue={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Tell your story..."
            class="w-full resize-none p-4 bg-transparent focus:outline-none text-xl leading-snug py-12 min-h-screen"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Write;
