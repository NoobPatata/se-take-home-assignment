export enum CustomerType {
    Vip = 'Vip',
    Normal = 'Normal',
}

export type Order = {
    id: number;
    status: OrderStatus;
    customer: CustomerType;
    priority: OrderPriority;
};

export enum OrderStatus {
    Pending = 'pending',
    Completed = 'complete',
}

export enum OrderPriority {
    Low = 'low',
    High = 'high',
}

export type Bot = {
    id: number;
    status: BotStatus;
    order?: Order;
    scheduleTask?: NodeJS.Timeout;
};

export enum BotStatus {
    Idle = 'idle',
    Processing = 'processing',
}
