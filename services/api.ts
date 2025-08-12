import pao_frances from "../assets/pao-frances.png";
import croissant from "../assets/croissant.png";
import baguete from "../assets/baguete.png";
import pao_de_queijo from "../assets/pao-de-queijo.png";

import { Order, OrderStatus, OrderType, Product, Plan, Customer } from '../types';

// Mock Data
const mockProducts: Product[] = [
  { id: 'p1', name: 'Pão Francês', price: 0.75, isActive: true, description: 'Clássico pão francês, crocante por fora e macio por dentro.', imageUrl: pao_frances },
  { id: 'p2', name: 'Croissant de Manteiga', price: 5.50, isActive: true, description: 'Folhado e amanteigado, perfeito para o café da manhã.', imageUrl: croissant },
  { id: 'p3', name: 'Baguete', price: 8.00, isActive: true, description: 'Longa e crocante, ideal para sanduíches.', imageUrl: baguete },
  { id: 'p4', name: 'Pão de Queijo', price: 2.50, isActive: false, description: 'A delícia mineira que todos amam.', imageUrl: pao_de_queijo },
];

const mockPlans: Plan[] = [
    { id: 'plan1', name: 'Plano Básico', price: 49.90, isCustomizable: false, isActive: true, description: 'Receba pão francês todos os dias.' },
    { id: 'plan2', name: 'Plano Família', price: 89.90, isCustomizable: true, isActive: true, description: 'Monte seu kit semanal com uma variedade de produtos.' },
    { id: 'plan3', name: 'Plano Premium', price: 129.90, isCustomizable: true, isActive: false, description: 'Produtos artesanais e especiais toda semana.' },
];

const mockCustomers: Customer[] = [
    { id: 'c1', name: 'Ana Silva', condominium: 'Condomínio Sol Nascente', planId: 'plan1', planName: 'Plano Básico', deliveryConfig: 'Entrega 7h', isActive: true },
    { id: 'c2', name: 'Bruno Costa', condominium: 'Condomínio Águas Claras', planId: 'plan2', planName: 'Plano Família', deliveryConfig: 'Retirada na portaria', isActive: true },
    { id: 'c3', name: 'Carlos Dias', condominium: 'Condomínio Sol Nascente', planId: 'plan2', planName: 'Plano Família', deliveryConfig: 'Entrega 8h', isActive: true },
    { id: 'c4', name: 'Daniela Lima', condominium: 'Condomínio Bosque Verde', planId: 'plan1', planName: 'Plano Básico', deliveryConfig: 'Entrega 7h30', isActive: false },
];

const mockOrders: Order[] = [
  { id: 'o1', customerName: 'Ana Silva', condominium: 'Condomínio Sol Nascente', type: OrderType.Assinatura, items: [{ productId: 'p1', productName: 'Pão Francês', quantity: 4 }], status: OrderStatus.Pendente, deliveryCode: '1234', orderDate: new Date().toISOString() },
  { id: 'o2', customerName: 'João Mendes (Avulso)', condominium: 'Condomínio Sol Nascente', type: OrderType.Avulso, items: [{ productId: 'p2', productName: 'Croissant de Manteiga', quantity: 2 }, { productId: 'p3', productName: 'Baguete', quantity: 1 }], status: OrderStatus.Pendente, deliveryCode: '5678', orderDate: new Date().toISOString() },
  { id: 'o3', customerName: 'Bruno Costa', condominium: 'Condomínio Águas Claras', type: OrderType.Assinatura, items: [{ productId: 'p1', productName: 'Pão Francês', quantity: 5 }, { productId: 'p4', productName: 'Pão de Queijo', quantity: 10 }], status: OrderStatus.Pendente, deliveryCode: '9012', orderDate: new Date().toISOString() },
  { id: 'o4', customerName: 'Maria Oliveira (Avulso)', condominium: 'Condomínio Bosque Verde', type: OrderType.Avulso, items: [{ productId: 'p3', productName: 'Baguete', quantity: 2 }], status: OrderStatus.Entregue, deliveryCode: '3456', orderDate: new Date(Date.now() - 86400000).toISOString() },
  { id: 'o5', customerName: 'Carlos Dias', condominium: 'Condomínio Sol Nascente', type: OrderType.Assinatura, items: [{ productId: 'p2', productName: 'Croissant de Manteiga', quantity: 4 }], status: OrderStatus.Entregue, deliveryCode: '7890', orderDate: new Date(Date.now() - 86400000).toISOString()},
];

// Simulate API calls
const simulateApiCall = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation
    }, 500); // 500ms delay
  });
};

// This is the skeleton for the connection to the application's database API
const API_ROUTE = "rota-api-sistema";

export const getDailyOrders = (): Promise<Order[]> => {
  // In a real app, this would be:
  // return fetch(`${API_ROUTE}/daily-orders`).then(res => res.json());
  const today = new Date().toDateString();
  const dailyOrders = mockOrders.filter(o => new Date(o.orderDate).toDateString() === today);
  return simulateApiCall(dailyOrders);
};

export const getOrderHistory = (): Promise<Order[]> => {
    // return fetch(`${API_ROUTE}/orders-history`).then(res => res.json());
    return simulateApiCall(mockOrders);
}

export const getProducts = (): Promise<Product[]> => {
  // return fetch(`${API_ROUTE}/products`).then(res => res.json());
  return simulateApiCall(mockProducts);
};

export const updateProduct = async (product: Product): Promise<Product> => {
    // await fetch(`${API_ROUTE}/products/${product.id}`, { method: 'PUT', body: JSON.stringify(product) });
    const index = mockProducts.findIndex(p => p.id === product.id);
    if(index !== -1) mockProducts[index] = product;
    return simulateApiCall(product);
}

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    // const newProduct = await fetch(`${API_ROUTE}/products`, { method: 'POST', body: JSON.stringify(productData) }).then(res => res.json());
    const newProduct: Product = { ...productData, id: `p${Date.now()}` };
    mockProducts.push(newProduct);
    return simulateApiCall(newProduct);
}


export const getPlans = (): Promise<Plan[]> => {
    // return fetch(`${API_ROUTE}/plans`).then(res => res.json());
    return simulateApiCall(mockPlans);
}

export const updatePlan = async (plan: Plan): Promise<Plan> => {
    // await fetch(`${API_ROUTE}/plans/${plan.id}`, { method: 'PUT', body: JSON.stringify(plan) });
    const index = mockPlans.findIndex(p => p.id === plan.id);
    if(index !== -1) mockPlans[index] = plan;
    return simulateApiCall(plan);
}

export const addPlan = async (planData: Omit<Plan, 'id'>): Promise<Plan> => {
    // const newPlan = await fetch(`${API_ROUTE}/plans`, { method: 'POST', body: JSON.stringify(planData) }).then(res => res.json());
    const newPlan: Plan = { ...planData, id: `plan${Date.now()}` };
    mockPlans.push(newPlan);
    return simulateApiCall(newPlan);
}


export const getCustomers = (): Promise<Customer[]> => {
    // return fetch(`${API_ROUTE}/customers`).then(res => res.json());
    return simulateApiCall(mockCustomers);
}

export const confirmDelivery = async (orderId: string, code: string): Promise<{ success: boolean; message: string }> => {
    // const response = await fetch(`${API_ROUTE}/orders/${orderId}/confirm`, { method: 'POST', body: JSON.stringify({ code }) }).then(res => res.json());
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Pedido não encontrado.' };
    if (order.deliveryCode === code) {
        order.status = OrderStatus.Entregue;
        return simulateApiCall({ success: true, message: 'Entrega confirmada com sucesso!' });
    }
    return simulateApiCall({ success: false, message: 'Código de entrega inválido.' });
}
