const { roles } = require("../../utils/constants");
const Users = require("./../../models/users.models");

async function listUsers(fastify, options) {
  fastify.get(
    "/listUsers",
    { onRequest: [fastify.authenticate] },
    async function (request, reply) {
      const user = await Users.findById({ _id: request.user._id });
      if (!user) {
        reply.code(401).send({
          status: "error",
          message: "Invalid user",
        });
        return;
      }

      if (user.role != roles.ADMIN) {
        reply.code(401).send({
          status: "error",
          message: "Only admin can see users",
        });
        return;
      }

      const users = await Users.find();

      reply.code(200).send({
        status: "success",
        data: {
          users: users,
        },
      });
    }
  );
}

module.exports = listUsers;
