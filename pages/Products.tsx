
import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, addProduct, updateProduct } from '../services/api';
import { Product } from '../types';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { PlusCircleIcon } from '../components/Icons';

const ProductForm: React.FC<{
  product: Product | null;
  onSave: (product: Product | Omit<Product, 'id'>) => void;
  onClose: () => void;
}> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({ name: '', price: 0, description: '', imageUrl: 'https://picsum.photos/seed/newproduct/400/300', isActive: true });
    }
  }, [product]);

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
    onSave(formData as Product);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome do Produto</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-style" />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Preço (R$)</label>
        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required step="0.01" className="mt-1 block w-full input-style" />
      </div>
       <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Descrição</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full input-style"></textarea>
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Produto Ativo</label>
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

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const fetchProducts = useCallback(async () => {
      setLoading(true);
      try {
          const data = await getProducts();
          setProducts(data);
      } catch (err) {
          setError('Falha ao carregar produtos.');
      } finally {
          setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSaveProduct = async (productData: Product | Omit<Product, 'id'>) => {
    if ('id' in productData) {
      // Update
      await updateProduct(productData);
    } else {
      // Add
      await addProduct(productData);
    }
    fetchProducts();
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-center">Carregando produtos...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div>
        <Card title="Lista de Produtos" action={
            <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600">
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Novo Produto
            </button>
        }>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col" onClick={() => handleEdit(product)}>
                        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
                        <div className="p-4 flex flex-col flex-grow">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex-grow">{product.description}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">R$ {product.price.toFixed(2)}</p>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.isActive ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Editar Produto' : 'Adicionar Produto'}>
            <ProductForm product={editingProduct} onSave={handleSaveProduct} onClose={() => setIsModalOpen(false)} />
        </Modal>
    </div>
  );
};

export default Products;
