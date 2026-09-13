import React from 'react';
export default function Link({href,children,...props}:React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} href={href?.startsWith('/projects/') ? `http://localhost:3000${href}` : href}>{children}</a>;
}
