
export type Page = 'dashboard' | 'subscriptions' | 'products' | 'plans' | 'reports' | 'history';

export enum OrderStatus {
  Pendente = 'Pendente',
  Entregue = 'Entregue',
  Cancelado = 'Cancelado'
}

export enum OrderType {
  Assinatura = 'Assinatura',
  Avulso = 'Avulso'
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  condominium: string;
  type: OrderType;
  items: OrderItem[];
  status: OrderStatus;
  deliveryCode: string;
  orderDate: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  description: string;
  imageUrl: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  isCustomizable: boolean;
  isActive: boolean;
  description: string;
}

export interface Customer {
    id: string;
    name: string;
    condominium: string;
    planId: string;
    planName: string;
    deliveryConfig: string;
    isActive: boolean;
}
