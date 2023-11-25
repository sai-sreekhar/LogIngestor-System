async function ping(fastify, options) {
  fastify.get("/ping", async function (request, reply) {
    return { status: "success", data: "pong" };
  });
}

module.exports = ping;