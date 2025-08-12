
import React from 'react';
import { Page } from '../types';
import { DashboardIcon, SubscriptionsIcon, ProductsIcon, PlansIcon, ReportsIcon, HistoryIcon, CloseIcon } from './Icons';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard do Dia', icon: DashboardIcon },
  { id: 'subscriptions', label: 'Assinantes', icon: SubscriptionsIcon },
  { id: 'products', label: 'Produtos', icon: ProductsIcon },
  { id: 'plans', label: 'Planos', icon: PlansIcon },
  { id: 'reports', label: 'Relatórios', icon: ReportsIcon },
  { id: 'history', label: 'Histórico', icon: HistoryIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isSidebarOpen, setSidebarOpen }) => {
  const handleNavigation = (page: Page) => {
    setActivePage(page);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}>
      </div>
      <aside className={`fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Pão Nosso</h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 dark:text-gray-400">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.id} className="px-4 py-1">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.id as Page);
                  }}
                  className={`flex items-center p-2 rounded-lg transition-colors
                    ${activePage === item.id 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
