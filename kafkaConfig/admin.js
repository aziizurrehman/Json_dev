const {Kafka} = require("./client.js");

async function init() {
    const admin = Kafka.admin();
    console.log("Admin connecting....");
    admin.connect();
    console.log("Admin Connection Success...");

    console.log("Creating topic [rider-updates]");
    await admin.createTopics({
        topics: [
            {
                topic: "rider-updates",
                numPartitions: 2,
            },
        ],
    });
    console.log("Topic created success [rider-updates]");
    console.log("Disconnecting admin...");
    await admin.disconnect();
}

init();