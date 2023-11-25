const { generateTokens } = require("../../utils/token");
const Users = require("./../../models/users.models");
const bcrypt = require("bcrypt");

async function login(fastify, options) {
  fastify.post("/login", async function (request, reply) {
    const user = await Users.findOne({ username: request.body.username });
    if (!user) {
      reply.code(401).send({
        status: "error",
        message: "Invalid username or password",
      });
      return;
    }

    const verifiedPassword = await bcrypt.compare(
      request.body.password,
      user.password
    );

    if (!verifiedPassword) {
      reply.code(401).send({
        status: "error",
        message: "Invalid username or password",
      });
      return;
    }

    const { accessToken } = await generateTokens(user);

    const updatedUser = await Users.updateOne(
      { _id: user._id },
      {
        $set: {
          accessToken: accessToken,
          accessTokenCreatedAt: Date.now(),
        },
      }
    );

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    delete userWithoutPassword.accessToken;
    delete userWithoutPassword.accessTokenCreatedAt;
    delete userWithoutPassword.__v;
    // return { userData: userWithoutPassword, accessToken };
    reply.code(200).send({
      status: "success",
      data: {
        userData: userWithoutPassword,
        accessToken: accessToken,
      },
    });
  });
}

module.exports = login;
