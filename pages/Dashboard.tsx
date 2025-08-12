
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getDailyOrders, confirmDelivery } from '../services/api';
import { Order, OrderStatus } from '../types';
import Card from '../components/Card';
import { HomeIcon, TruckIcon, CheckCircleIcon, XCircleIcon } from '../components/Icons';

const DeliveryConfirmationModal: React.FC<{
  order: Order | null;
  onClose: () => void;
  onConfirm: (orderId: string, code: string) => Promise<void>;
}> = ({ order, onClose, onConfirm }) => {
  const [code, setCode] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    if (!order) return;
    setIsConfirming(true);
    await onConfirm(order.id, code);
    setIsConfirming(false);
    onClose();
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 m-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirmar Entrega</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Pedido para <span className="font-bold">{order.customerName}</span> no <span className="font-bold">{order.condominium}</span>.
        </p>
        <div className="mt-4">
          <label htmlFor="deliveryCode" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Código de Entrega
          </label>
          <input
            type="text"
            id="deliveryCode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-gray-900 dark:text-gray-100"
            placeholder="Informe o código do cliente"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming || !code}
            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed"
          >
            {isConfirming ? 'Confirmando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};


const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingOrder, setConfirmingOrder] = useState<Order | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDailyOrders();
      setOrders(data);
    } catch (err) {
      setError('Falha ao carregar os pedidos do dia.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirmDelivery = async (orderId: string, code: string) => {
    const result = await confirmDelivery(orderId, code);
    if(result.success){
        setNotification({ type: 'success', message: result.message });
        fetchOrders();
    } else {
        setNotification({ type: 'error', message: result.message });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const ordersByCondo = useMemo(() => {
    return orders.reduce((acc, order) => {
      const condo = order.condominium;
      if (!acc[condo]) {
        acc[condo] = [];
      }
      acc[condo].push(order);
      return acc;
    }, {} as Record<string, Order[]>);
  }, [orders]);

  if (loading) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Carregando pedidos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`p-4 rounded-md flex items-center ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {notification.type === 'success' ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : <XCircleIcon className="w-5 h-5 mr-2" />}
            {notification.message}
        </div>
      )}
      {Object.keys(ordersByCondo).length === 0 ? (
        <Card>
            <p className="text-center text-gray-500 dark:text-gray-400">Nenhum pedido para hoje.</p>
        </Card>
      ) : (
        Object.entries(ordersByCondo).map(([condo, condoOrders]) => (
          <Card key={condo} title={condo} className="border-l-4 border-amber-500">
            <div className="space-y-4">
              {condoOrders.map(order => (
                <div key={order.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white">{order.customerName}</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside mt-1">
                      {order.items.map(item => (
                        <li key={item.productId}>{item.quantity}x {item.productName}</li>
                      ))}
                    </ul>
                    <span className={`mt-2 inline-block px-2 py-1 text-xs font-medium rounded-full ${order.type === 'Assinatura' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {order.type}
                    </span>
                  </div>
                  <div className="mt-3 sm:mt-0 flex items-center space-x-4">
                    {order.status === OrderStatus.Pendente ? (
                       <button onClick={() => setConfirmingOrder(order)} className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                         <TruckIcon className="w-4 h-4 mr-2" />
                         Confirmar Entrega
                       </button>
                    ) : (
                      <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                        <CheckCircleIcon className="w-5 h-5 mr-1" />
                        Entregue
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))
      )}
       <DeliveryConfirmationModal 
            order={confirmingOrder}
            onClose={() => setConfirmingOrder(null)}
            onConfirm={handleConfirmDelivery}
        />
    </div>
  );
};

export default Dashboard;
