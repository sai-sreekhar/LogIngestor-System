const fp = require("fastify-plugin");
const { FirehoseClient } = require("@aws-sdk/client-firehose");

async function firehose(fastify, options = {}) {
  const client = new FirehoseClient({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.USER_ACCESS_KEY,
      secretAccessKey: process.env.USER_SECRET_KEY,
    },
  });
  fastify.decorate("firehose", client);
}

module.exports = fp(firehose);
