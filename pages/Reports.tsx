
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getDailyOrders } from '../services/api';
import { Order, OrderStatus } from '../types';
import Card from '../components/Card';

interface ProductionSummary {
  [condo: string]: {
    [productName: string]: number;
  };
}

const Reports: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDailyOrders();
      setOrders(data);
    } catch (err) {
      setError('Falha ao carregar dados para o relatório.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const productionSummary = useMemo(() => {
    const summary: ProductionSummary = {};
    const pendingOrders = orders.filter(o => o.status === OrderStatus.Pendente);

    for (const order of pendingOrders) {
      if (!summary[order.condominium]) {
        summary[order.condominium] = {};
      }
      for (const item of order.items) {
        summary[order.condominium][item.productName] = 
          (summary[order.condominium][item.productName] || 0) + item.quantity;
      }
    }
    return summary;
  }, [orders]);

  const totalProduction = useMemo(() => {
      const total: {[productName: string]: number} = {};
      Object.values(productionSummary).forEach(condoItems => {
          Object.entries(condoItems).forEach(([productName, quantity]) => {
              total[productName] = (total[productName] || 0) + quantity;
          });
      });
      return total;
  }, [productionSummary]);

  if (loading) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Gerando relatório...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <Card title="Resumo Geral da Produção (Pedidos Pendentes)">
        {Object.keys(totalProduction).length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Nenhuma produção necessária para hoje.</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(totalProduction).map(([productName, quantity]) => (
              <li key={productName} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                <span className="font-medium text-gray-800 dark:text-white">{productName}</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{quantity} unidades</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {Object.keys(productionSummary).length > 0 && (
          <div className="space-y-6">
              {Object.entries(productionSummary).map(([condo, items]) => (
                  <Card key={condo} title={`Produção para: ${condo}`}>
                      <ul className="space-y-2">
                          {Object.entries(items).map(([productName, quantity]) => (
                              <li key={productName} className="flex justify-between text-sm">
                                  <span className="text-gray-700 dark:text-gray-300">{productName}</span>
                                  <span className="font-semibold text-gray-900 dark:text-white">{quantity}</span>
                              </li>
                          ))}
                      </ul>
                  </Card>
              ))}
          </div>
      )}
    </div>
  );
};

export default Reports;
