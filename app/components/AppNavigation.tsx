'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              AI開発ワークフロー
            </h1>
            <div className="flex gap-4">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === '/'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                📝 TODO管理
              </Link>
              <Link
                href="/household"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === '/household'
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                💰 家計簿
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
