const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./../.env") });

const JWT_KEY = process.env.ACCESS_TOKEN_SECRET;
const fp = require("fastify-plugin");

module.exports = fp(async function (fastify, opts) {
  fastify.register(require("@fastify/jwt"), {
    secret: JWT_KEY,
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
