'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Dashboard' },
  { href: '/documents', label: 'Documents' },
  { href: '/images', label: 'Images' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-64 bg-surface rounded-r-2xl shadow-soft p-6 hidden md:flex flex-col">
      <div className="text-2xl font-semibold mb-8">CloudyDrive</div>

      <nav className="space-y-2">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/');

          const base = 'block rounded-xl px-4 py-3 transition-colors';
          const activeCls = 'text-green-600 bg-green-50 ring-1 ring-green-100';
          const idleCls = 'text-slate-700 hover:bg-green-50 hover:text-green-600';

          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? 'page' : undefined}
              className={`${base} ${active ? activeCls : idleCls}`}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto text-xs text-slate-400">Tram Nguyen</div>
    </aside>
  );
}
