import Link from 'next/link';

const CustomLink = ({ href, children }) => {
  const isInternalLink = href && href.startsWith('/');

  if (isInternalLink) {
    return (
      <Link href={href}>
        <a>{children}</a>
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export default CustomLink;
