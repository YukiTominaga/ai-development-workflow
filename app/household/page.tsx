'use client';

import { useState } from 'react';
import { useTransactions } from '@/app/hooks/useTransactions';
import { getCurrentMonth } from '@/app/utils/date';
import Dashboard from '@/app/components/household/Dashboard';
import TransactionInput from '@/app/components/household/TransactionInput';
import TransactionHistory from '@/app/components/household/TransactionHistory';
import Analysis from '@/app/components/household/Analysis';

type Tab = 'dashboard' | 'input' | 'history' | 'analysis' | 'settings';

export default function HouseholdPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const transactionHook = useTransactions();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            {...transactionHook}
          />
        );
      case 'input':
        return <TransactionInput addTransaction={transactionHook.addTransaction} />;
      case 'history':
        return (
          <TransactionHistory
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            {...transactionHook}
          />
        );
      case 'analysis':
        return (
          <Analysis
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            {...transactionHook}
          />
        );
      case 'settings':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">設定</h2>
            <p className="text-gray-400">設定機能は今後実装予定です。</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-gray-800 p-4">
        <h1 className="text-2xl font-bold text-emerald-400 mb-8">家計簿</h1>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">📊</span>
            <span>ダッシュボード</span>
          </button>
          <button
            onClick={() => setActiveTab('input')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'input'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">➕</span>
            <span>入力</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">📝</span>
            <span>履歴</span>
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'analysis'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">📈</span>
            <span>分析</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">⚙️</span>
            <span>設定</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
