import { type Bot, BotStatus, CustomerType, type Order, OrderPriority, OrderStatus } from './types/commen.types';

export class OrderSystem {
    private botIdCounter = 1;
    private orderIdCounter = 1;

    private orderPriorityMap = {
        [CustomerType.Vip]: OrderPriority.High,
        [CustomerType.Normal]: OrderPriority.Low,
    };

    activeBots: Bot[] = [];
    pendingOrders: Order[] = [];
    completedOrders: Order[] = [];

    createBot() {
        if (this.activeBots.length > 10) {
            console.log('Max number of bots allowed reached.');
            return;
        }

        this.activeBots.push({
            id: this.botIdCounter++,
            status: BotStatus.Idle,
        });

        this.assignOrderToIdleBots();
        this.printStatus();
    }

    destroyBot() {
        const destroyedBot = this.activeBots.pop();
        if (!destroyedBot) {
            return console.info('There are no bots.');
        }

        const destroyMessage = `Removed bot ${destroyedBot.id}.`;
        let botCurrentOrder = destroyedBot.order;
        if (!botCurrentOrder) {
            return console.info(destroyMessage);
        }

        clearTimeout(destroyedBot.scheduleTask);
        botCurrentOrder.status = OrderStatus.Pending;
        botCurrentOrder.priority = OrderPriority.High;

        this.pendingOrders.unshift(botCurrentOrder);
        this.printStatus();

        return console.info(`${destroyMessage} Order ID: ${botCurrentOrder.id} updated to next order to be processed.`);
    }

    createOrder(customerType: CustomerType) {
        if (this.pendingOrders.length > 30) {
            console.log('Max number of pending orders allowed reached.');
            return;
        }

        const orderPriority: OrderPriority = this.orderPriorityMap[customerType];
        const order: Order = {
            id: this.orderIdCounter++,
            customer: customerType,
            priority: orderPriority,
            status: OrderStatus.Pending,
        };

        if (orderPriority === OrderPriority.Low) {
            this.pendingOrders.push(order);
        }

        if (orderPriority === OrderPriority.High) {
            this.handleVipCustomerOrder(order);
        }

        this.assignOrderToIdleBots();
        this.printStatus();
    }

    handleVipCustomerOrder(order: Order) {
        const normalIndex = this.pendingOrders.findIndex(
            (order) => order.customer === CustomerType.Normal && order.priority === OrderPriority.Low,
        );

        this.pendingOrders.splice(normalIndex === -1 ? this.pendingOrders.length : normalIndex, 0, order);
    }

    assignOrderToIdleBots() {
        for (const bot of this.activeBots) {
            if (bot.status === BotStatus.Processing) {
                continue;
            }

            this.processOrder(bot);
        }
    }

    processOrder(bot: Bot) {
        const nextOrder = this.pendingOrders.shift();
        if (!nextOrder) {
            return;
        }

        bot.order = nextOrder;
        bot.status = BotStatus.Processing;

        bot.scheduleTask = setTimeout(() => {
            nextOrder.status = OrderStatus.Completed;
            this.completedOrders.push(nextOrder);

            delete bot.order;
            delete bot.scheduleTask;
            bot.status = BotStatus.Idle;

            this.processOrder(bot);
        }, 10_000);
    }

    printStatus() {
        const maxRows = Math.max(this.pendingOrders.length, this.completedOrders.length, this.activeBots.length);

        const table = [];

        for (let i = 0; i < maxRows; i++) {
            const pending = this.pendingOrders[i]
                ? `#${this.pendingOrders[i].id} (${this.pendingOrders[i].customer})`
                : '';
            const completed = this.completedOrders[i]
                ? `#${this.completedOrders[i].id} (${this.completedOrders[i].customer})`
                : '';
            const bot = this.activeBots[i]
                ? `#${this.activeBots[i].id} - ${
                      this.activeBots[i].status === BotStatus.Processing
                          ? `#${this.activeBots[i].order?.id} (${this.activeBots[i].order?.customer})`
                          : 'IDLE'
                  }`
                : '';

            table.push({
                Pending: pending,
                Completed: completed,
                Bots: bot,
            });
        }

        console.log('\n=== STATUS TABLE ===');
        console.table(table);
    }
}
