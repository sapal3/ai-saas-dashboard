"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/dashboard/blog', label: 'Blog' },
  { href: '/dashboard/text-to-image', label: 'Text to Image' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">AI SaaS</div>
      <nav>
        <ul>
          {items.map((it) => {
            const isActive = pathname === it.href || pathname?.startsWith(it.href + '/');
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={isActive ? 'active' : ''}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="item-label">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
