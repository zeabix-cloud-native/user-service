const { Kafka } = require('kafkajs');
const os = require('os');
const hostname = os.hostname();

const brokerUrl = process.env.KAFKA_BROKER_ADDRESSES || 'kafka-deployment-8656dc4dd8-2zlpd:9092'
const consumerGroupId = process.env.CONSUMER_GROUP_ID || 'user-service'

const kafka = new Kafka({
    clientId: hostname,
    brokers: [brokerUrl]
});

const consumer_create = kafka.consumer({groupId: `${consumerGroupId}-create`});
const consumer_update = kafka.consumer({groupId: `${consumerGroupId}-update`});

const connect = async () => {
    await consumer_create.connect();
    await consumer_update.connect();
    console.log(`Kafka connected: ${brokerUrl}`)
}

const subscribe_update_event = async (topic, processMessage) => {
    await consumer_update.subscribe({topic: topic, fromBeginning: false});
    await consumer_update.run({
        eachMessage: processMessage
    });
};

const subscribe_create_event = async (topic, processMessage) => {
    await consumer_create.subscribe({topic: topic, fromBeginning: false});
    await consumer_create.run({
        eachMessage: processMessage
    });
};

const disconnect = async() => {
    await consumer_create.disconnect();
    await consumer_update.disconnect();
}

module.exports = {
    connect,
    disconnect,
    subscribe_create_event,
    subscribe_update_event
}



