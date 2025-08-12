
import React from 'react';
import { Page } from '../types';
import { MenuIcon } from './Icons';

interface HeaderProps {
  toggleSidebar: () => void;
  activePage: Page;
}

const pageTitles: Record<Page, string> = {
    dashboard: 'Dashboard de Pedidos do Dia',
    subscriptions: 'Gestão de Assinantes',
    products: 'Gestão de Produtos',
    plans: 'Gestão de Planos',
    reports: 'Relatório Diário de Produção',
    history: 'Histórico de Pedidos',
};


const Header: React.FC<HeaderProps> = ({ toggleSidebar, activePage }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none md:hidden mr-4">
          <MenuIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{pageTitles[activePage]}</h2>
      </div>
      {/* Placeholder for user menu or other actions */}
      <div className="flex items-center">
        <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>
    </header>
  );
};

export default Header;
