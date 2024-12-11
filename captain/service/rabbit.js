//Creating the service for Rabbit MQ which do:
//1. Connect to rabbit mq server , in which all the microservice will be connected to one common server for communication
//2.subscribe to the que  (consuming message)
//publish to the que (pushing the message)

const amqp = require("amqplib");

let connection, channel;

//Connection handler
async function connect() {
  //connecting to rabbit mq server
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  console.log("Connected To Rabbit MQ ");
}

//Subscribe handler
async function subscribeToQueue(queueName, callback) {
  //if channel not found again connect
  if (!channel) await connect();
  await channel.assertQueue(queueName);
  channel.consume(queueName, (message) => {
    //consuming the msg from que in string fromate (binary to string)
    callback(message.content.toString());
    channel.ack(message);
  });
}

//Publisher handler
async function publishToQueue(queueName, data) {
  if (!channel) await connect();
  await channel.assertQueue(queueName);
  //sending the msg to que in binary formate
  channel.sendToQueue(queueName, Buffer.from(data));
}

module.exports = {
  connect,
  publishToQueue,
  subscribeToQueue
};
