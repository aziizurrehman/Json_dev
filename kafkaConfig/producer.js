// const {Kafka} = require("./client");

// async function init() {
//   const producer = Kafka.producer();

//   console.log("Connecting producer");

//   await producer.connect();
//   console.log("producer connected successfully");

//   return producer;



//   await producer.send({
//     topic: 'rider-updates',
//     messages: [
//         { partition: 0, key: 'location-update', value: JSON.stringify({ name: 'Tony Stark', loc: 'America'})}
//     ],
//   });

//   await producer.disconnect();
// }

// init()



const {Kafka} = require("./client");

async function kafkaProducer() {
 let producer;

 try {
   producer = Kafka.producer();

   console.log("Connecting producer");

   await producer.connect();
   console.log("Producer connected successfully");

   await producer.send({
     topic: 'rider-updates',
     messages: [
         { partition: 0, key: 'location-update', value: JSON.stringify({ name: 'Tony Stark', loc: 'America'})}
     ],
   });

   console.log("Message sent successfully");
 } catch (error) {
   console.error(`Error occurred: ${error}`);
 } finally {
   if (producer) {
     await producer.disconnect();
     console.log("Producer disconnected");
   }
 }
}


module.exports = kafkaProducer;