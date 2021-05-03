import { useEffect, useRef } from 'react';
import { signOut } from 'next-auth/client';
import Link from 'next/link';

import { LogoutIcon } from '@heroicons/react/outline';

const FlyoutMenu = ({ links = [], show = false, onClose = () => null }) => {
  const menuRef = useRef();

  useEffect(() => {
    function mouseDownListener(event) {
      // Do nothing if the event was already processed
      if (event.defaultPrevented) return;
      // Check if click is outside the menu
      if (!menuRef?.current?.contains(event.target)) {
        onClose();
      }
    }

    function keyDownListener(event) {
      // Do nothing if the event was already processed
      if (event.defaultPrevented) return;
      // Check if click is outside the menu
      if (event.code === 'Escape') {
        onClose();
      }
    }

    if (show) {
      window.addEventListener('mousedown', mouseDownListener);
      window.addEventListener('keydown', keyDownListener);
    }

    return () => {
      window.removeEventListener('mousedown', mouseDownListener);
      window.removeEventListener('keydown', keyDownListener);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-10 right-0 z-50 w-80 hidden sm:block"
    >
      <div className="rounded-lg shadow-lg ring-1 ring-gray-900 dark:ring-gray-700 ring-opacity-5 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 divide-y divide-gray-200 dark:divide-gray-700">
        <div className="p-5 space-y-8">
          {/* Navigation */}
          <nav className="grid gap-y-8">
            {links.map(({ text, href, icon: Icon }) => (
              <Link key={text} href={href}>
                <a className="-m-3 p-3 flex items-center space-x-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Icon className="flex-shrink-0 h-7 w-7 text-blue-600" />
                  <span className="font-medium capitalize">{text}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>

        {/* Sign out */}
        <div className="px-5 py-3">
          <button
            type="button"
            onClick={() => signOut()}
            className="-mx-2 -my-1 px-2 py-1 flex justify-center items-center space-x-2 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
          >
            <LogoutIcon className="flex-shrink-0 h-7 w-7" />
            <span className="font-medium capitalize">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlyoutMenu;
