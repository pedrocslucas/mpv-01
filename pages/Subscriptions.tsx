
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getCustomers } from '../services/api';
import { Customer } from '../types';
import Card from '../components/Card';
import { HomeIcon } from '../components/Icons';

const Subscriptions: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Falha ao carregar os assinantes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const customersByCondo = useMemo(() => {
    return customers.reduce((acc, customer) => {
      const condo = customer.condominium;
      if (!acc[condo]) {
        acc[condo] = [];
      }
      acc[condo].push(customer);
      return acc;
    }, {} as Record<string, Customer[]>);
  }, [customers]);

  if (loading) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Carregando assinantes...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {Object.keys(customersByCondo).length === 0 ? (
        <Card>
            <p className="text-center text-gray-500 dark:text-gray-400">Nenhum assinante encontrado.</p>
        </Card>
      ) : (
        Object.entries(customersByCondo).map(([condo, condoCustomers]) => (
          <Card key={condo} title={condo} className="border-l-4 border-blue-500">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assinante</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Plano</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Entrega</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {condoCustomers.map(customer => (
                            <tr key={customer.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{customer.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{customer.planName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{customer.deliveryConfig}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        customer.isActive 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                        {customer.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default Subscriptions;
