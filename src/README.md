# Requirement
1. NodeJs

# Setup Steps
1. Run `npm i` to install the package required dependencies.
2. Run `npm run dev` to begin using the cli prototype.

# TODO
1. Integrate proper message queue broker to process the orders.
   1. Kafka
   2. Redis
   3. RabbiMQ
2. Implementing locking system on order. This is to prevent concurrency issue where more than one bot is able to process the same order.
3. Rate limiting to avoid spamming of orders that would cause a sudden spike in server workload.