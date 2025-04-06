import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';
import { OrderSystem } from './orderSystem';
import { CustomerType } from './types/commen.types';

const orderSystem = new OrderSystem();
const rl = readline.createInterface({ input, output });

console.info('McDonald Order System Prototype.');
console.info('\n1. New Normal Order');
console.info('2. New VIP Order');
console.info('3. Add Bot');
console.info('4. Remove Bot');
console.info('5. Check Status');
console.info('6. Exit');

rl.on('line', (line) => {
    switch (line.trim()) {
        case '1':
            orderSystem.createOrder(CustomerType.Normal);
            break;
        case '2':
            orderSystem.createOrder(CustomerType.Vip);
            break;
        case '3':
            orderSystem.createBot();
            break;
        case '4':
            orderSystem.destroyBot();
            break;
        case '5':
            orderSystem.printStatus();
            break;
        case '6':
            rl.close();
            break;
        default:
            console.log('Unknown command.');
    }
});
