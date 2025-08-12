
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import Products from './pages/Products';
import Plans from './pages/Plans';
import Reports from './pages/Reports';
import History from './pages/History';
import { Page } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = useCallback(() => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'subscriptions':
        return <Subscriptions />;
      case 'products':
        return <Products />;
      case 'plans':
        return <Plans />;
      case 'reports':
        return <Reports />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  }, [activePage]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar activePage={activePage} setActivePage={setActivePage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} activePage={activePage} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
