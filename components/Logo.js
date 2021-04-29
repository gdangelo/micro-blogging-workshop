import Link from 'next/link';
import { TerminalIcon } from '@heroicons/react/outline';

const Logo = () => (
  <Link href="/">
    <a className="flex items-center space-x-1 text-blue-600">
      <TerminalIcon className="w-8 h-8 flex-shrink-0" />
      <span className="font-bold text-lg tracking-tight whitespace-nowrap">
        Blog for Dev
      </span>
    </a>
  </Link>
);

export default Logo;
