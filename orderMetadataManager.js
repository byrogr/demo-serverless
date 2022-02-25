const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });
const dynamo = new AWS.DynamoDB({ apiVersion: '2012-11-05' });

const saveCompleteOrder = async order => {
  order['delivery_status'] = "READY_FOR_DELIVERY";
  const params = {
    TableName: process.env.COMPLETED_ORDER_TABLE,
    Item: {
      orderId: {
        S: order.orderId
      },
      name: {
        S: order.name
      },
      address: {
        S: order.address
      },
      pizzas: {
        SS: order.pizzas
      },
      delivery_status: {
        S: order.delivery_status
      },
      timestamp: {
        S: order.timestamp
      }
    }
  };
  return await dynamo.putItem(params).promise();
};

module.exports = {
  saveCompleteOrder
}