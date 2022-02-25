'use strict';

const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const manager = require('./orderMetadataManager');

AWS.config.update({ region: process.env.REGION });

var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const QUEUE_URL = process.env.PENDING_ORDER_QUEUE;

module.exports.makeAnOrder = async (event) => {
  const body = JSON.parse(event.body);
  const order = {
    orderId: uuidv4(),
    name: body.name,
    address: body.address,
    pizzas: body.pizzas,
    timestamp: Date.now().toString()
  };
  const params = {
    MessageBody: JSON.stringify(order),
    QueueUrl: QUEUE_URL
  };
  try {
    const data = await sqs.sendMessage(params).promise();
    console.log('data', data);
    const message = { order,  messageId: data.MessageId };
    return sendResponse(200, message);
  } catch (err) {
    console.error(err);
  }
};

module.exports.prepareAnOrder = async (event) => {
  try {
    const order = JSON.parse(event.Records[0].body);
    const res = await manager.saveCompleteOrder(order);
  } catch (err) {
    console.error(err);
  }
};

function sendResponse (statusCode, message) {
  return {
    statusCode,
    body: JSON.stringify({ message })
  };
}
