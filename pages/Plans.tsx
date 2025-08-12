
import React, { useState, useEffect, useCallback } from 'react';
import { getPlans, addPlan, updatePlan } from '../services/api';
import { Plan } from '../types';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { PlusCircleIcon } from '../components/Icons';

const PlanForm: React.FC<{
  plan: Plan | null;
  onSave: (plan: Plan | Omit<Plan, 'id'>) => void;
  onClose: () => void;
}> = ({ plan, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Plan>>({
    name: '',
    price: 0,
    description: '',
    isCustomizable: false,
    isActive: true,
  });

  useEffect(() => {
    if (plan) {
      setFormData(plan);
    } else {
      setFormData({ name: '', price: 0, description: '', isCustomizable: false, isActive: true });
    }
  }, [plan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Plan);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome do Plano</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-style" />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Preço Mensal (R$)</label>
        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required step="0.01" className="mt-1 block w-full input-style" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Descrição</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full input-style"></textarea>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
            <input type="checkbox" name="isCustomizable" id="isCustomizable" checked={formData.isCustomizable} onChange={handleChange} className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
            <label htmlFor="isCustomizable" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Permitir customização pelo cliente</label>
        </div>
        <div className="flex items-center">
            <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Plano Ativo</label>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600">Salvar</button>
      </div>
      <style jsx>{`
        .input-style {
            display: block;
            width: 100%;
            padding: 0.5rem 0.75rem;
            background-color: #fff;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .dark .input-style {
            background-color: #374151;
            border-color: #4b5563;
            color: #f3f4f6;
        }
      `}</style>
    </form>
  );
};


const Plans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    const fetchPlans = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getPlans();
            setPlans(data);
        } catch (err) {
            setError('Falha ao carregar planos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const handleSavePlan = async (planData: Plan | Omit<Plan, 'id'>) => {
        if ('id' in planData) {
            await updatePlan(planData);
        } else {
            await addPlan(planData);
        }
        fetchPlans();
        setIsModalOpen(false);
        setEditingPlan(null);
    };

    const handleAddNew = () => {
        setEditingPlan(null);
        setIsModalOpen(true);
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setIsModalOpen(true);
    };

    if (loading) return <div className="text-center">Carregando planos...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div>
            <Card title="Planos de Assinatura" action={
                <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600">
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Novo Plano
                </button>
            }>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <div key={plan.id} className="border-2 p-4 rounded-lg flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700" onClick={() => handleEdit(plan)}>
                            <div>
                                <div className="flex justify-between items-start">
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h4>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {plan.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{plan.description}</p>
                                <div className="mt-3">
                                    <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${plan.isCustomizable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>
                                        {plan.isCustomizable ? 'Customizável' : 'Fixo'}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">R$ {plan.price.toFixed(2)}<span className="text-sm font-normal text-gray-500">/mês</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPlan ? 'Editar Plano' : 'Adicionar Plano'}>
                <PlanForm plan={editingPlan} onSave={handleSavePlan} onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Plans;
