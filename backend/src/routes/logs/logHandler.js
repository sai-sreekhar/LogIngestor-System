const { PutRecordCommand } = require("@aws-sdk/client-firehose");
const { constants } = require("../../utils/constants");
let roundRobinIndex = 0;

//i am handling both put and post request for logIngestor since the specification did not mention which one to use
async function logHandler(fastify, options) {
  fastify.post("/", async function (request, reply) {
    try {
      const deliveryStreams = [
        constants.DELIVERY_STREAM_NAME_1,
        constants.DELIVERY_STREAM_NAME_2,
        constants.DELIVERY_STREAM_NAME_3,
        constants.DELIVERY_STREAM_NAME_4,
        constants.DELIVERY_STREAM_NAME_5,
      ];
      // console.log(roundRobinIndex);
      const selectedStream = deliveryStreams[roundRobinIndex];
      const input = {
        DeliveryStreamName: selectedStream, // required
        Record: {
          Data: Buffer.from(JSON.stringify(request.body) + "\n"),
        },
      };
      const command = new PutRecordCommand(input);
      const response = await fastify.firehose.send(command);
      roundRobinIndex = (roundRobinIndex + 1) % deliveryStreams.length;
      reply
        .code(200)
        .send({ status: "success", data: "Data Sent Successfully" });
    } catch (err) {
      console.log(err);
      reply
        .code(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  });

  fastify.put("/", async function (request, reply) {
    try {
      const input = {
        DeliveryStreamName: constants.DELIVERY_STREAM_NAME, // required
        Record: {
          Data: Buffer.from(JSON.stringify(request.body) + "\n"),
        },
      };
      const command = new PutRecordCommand(input);
      const response = await fastify.firehose.send(command);
      reply
        .code(200)
        .send({ status: "success", data: "Data Sent Successfully" });
    } catch (err) {
      console.log(err);
      reply
        .code(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  });
}

module.exports = logHandler;
