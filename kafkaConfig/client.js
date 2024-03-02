const {Kafka} = require('kafkajs')

exports.Kafka = new Kafka({
clientId: 'my-app',
brokers: ['10.6.229.12:9092']
})
