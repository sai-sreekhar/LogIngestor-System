const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

// Require the framework and instantiate it
const fastify = require("fastify")({
  logger: {
    level: "error",
  },
});
const cors = require("@fastify/cors");
const { connectToDB } = require("./src/plugins/mongoose");

// fastify.register(require("@fastify/mongodb"), {
//   forceClose: true,
//   url: process.env.DB_CONNECTION,
// });

connectToDB(process.env.DB_CONNECTION);

fastify.register(require("./src/plugins/firehose"), {});

fastify.register(cors, {
  origin: "*",
  methods: "GET,POST,OPTIONS",
  credentials: true,
  allowedHeaders: "*",
  strictPreflight: false,
});

fastify.register(require("./src/plugins/jwtAuth"));

fastify.register(require("./src/routes/ping"));
fastify.register(require("./src/routes/logs/logHandler"));
fastify.register(require("./src/routes/logs/search"));
fastify.register(require("./src/routes/users/login"));
fastify.register(require("./src/routes/users/addUser"));
fastify.register(require("./src/routes/users/listUsers"));

// Run the server!
fastify.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
