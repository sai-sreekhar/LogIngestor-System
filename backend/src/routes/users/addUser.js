const { roles } = require("../../utils/constants");
const Users = require("./../../models/users.models");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../../utils/token");

async function addUser(fastify, options) {
  fastify.post(
    "/addUser",
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
          message: "Only admin can add users",
        });
        return;
      }

      const existingUser = await Users.findOne({
        username: request.body.username,
      });

      if (existingUser) {
        reply.code(401).send({
          status: "error",
          message: "Username already exists",
        });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(request.body.password, salt);
      const role = request.body.role;
      if (role != roles.ADMIN && role != roles.SUB_ADMIN) {
        reply.code(401).send({
          status: "error",
          message: "Invalid role",
        });
        return;
      }

      const resources = request.body.resources;
      const newUser = new Users({
        username: request.body.username,
        password: hashPassword,
        role: role,
        resources: resources,
      });

      const savedUser = await newUser.save();
      const { accessToken } = await generateTokens(savedUser);

      const userWithoutPassword = savedUser.toObject();
      delete userWithoutPassword.password;

      await Users.updateOne(
        { _id: savedUser._id },
        {
          $set: {
            accessToken: accessToken,
            accessTokenCreatedAt: Date.now(),
          },
        }
      );

      reply.code(200).send({
        status: "success",
        data: {
          userData: userWithoutPassword,
          accessToken: accessToken,
        },
      });
    }
  );
}

module.exports = addUser;
