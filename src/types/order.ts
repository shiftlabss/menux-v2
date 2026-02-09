export enum OrderStatus {
    WAITING = 'WAITING',
    PREPARING = 'PREPARING',
    READY = 'READY',
    DELIVERED = 'DELIVERED',
    FINISHED = 'FINISHED',
    CANCELED = 'CANCELED',
}

export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId?: string;
}

export interface OrderItem {
    id: string;
    menuItem: MenuItem;
    quantity: number;
    price: number;
    observation?: string;
}

export interface Order {
    id: string;
    code: string;
    status: OrderStatus;
    total: number;
    restaurantId: string;
    customerId?: string;
    tableId?: string;
    waiterId?: string;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CompositionItemDTO {
    menuItemId: string;
    groupKey: string;
    quantity: number;
    name: string;
    priceRule: 'SUM' | 'AVERAGE' | 'HIGHEST' | 'NONE';
    extraPrice: number;
}

export interface CreateOrderItemDTO {
    menuItemId: string;
    quantity: number;
    observation?: string;
    composition?: CompositionItemDTO[];
}

export interface CreateOrderDTO {
    restaurantId: string;
    tableId?: string;
    waiterId?: string;
    customerId?: string;
    temporaryCustomerId?: string;
    transactionId?: string;
    items: CreateOrderItemDTO[];
}
