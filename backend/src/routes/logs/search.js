const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./../../.env") });
const { constants, roles } = require("../../utils/constants");
const Users = require("../../models/users.models");

function mapRuleToQuery(rule) {
  const { field, value, operator } = rule;
  if (field === "timestamp") {
    switch (operator) {
      case ">": {
        return {
          range: {
            timestamp: {
              gt: value,
            },
          },
        };
      }
      case "<": {
        return {
          range: {
            timestamp: {
              lt: value,
            },
          },
        };
      }
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }

  switch (operator) {
    case "=": {
      return {
        term: {
          [`${field}.keyword`]: {
            value: value,
            case_insensitive: true,
          },
        },
      };
    }
    case "contains": {
      return {
        regexp: {
          [field]: {
            value: `.*${value}.*`,
            case_insensitive: true,
          },
        },
      };
    }
    case "beginsWith": {
      return {
        regexp: {
          [field]: {
            value: `${value}.*`,
            case_insensitive: true,
          },
        },
      };
    }
    case "endsWith": {
      return {
        regexp: {
          [field]: {
            value: `.*${value}`,
            case_insensitive: true,
          },
        },
      };
    }
    case "regex": {
      return {
        regexp: {
          [field]: {
            value: `${value}`,
            case_insensitive: true,
          },
        },
      };
    }
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

async function search(fastify, options) {
  fastify.post(
    "/search",
    { onRequest: [fastify.authenticate] },
    async function (request, reply) {
      try {
        const user = await Users.findById({ _id: request.user._id });
        if (!user) {
          reply.code(404).send({ status: "error", message: "User not found" });
          return;
        }

        const resources = user.resources;
        const role = user.role;

        const pageSize = request.body.pageSize || 20;
        const { startIndex, rules, combinator } = request.body;
        let filterType;
        if (combinator == "and") {
          filterType = "must";
        } else if (combinator == "or") {
          filterType = "should";
        } else {
          reply.code(412).send({
            status: "error",
            message: "filtertype should be either and or or",
          });
          return;
        }

        let searchQuery;
        //restricting subadmin to only search in their resources
        //for admin we allow all the resources as per the query
        if (role === roles.ADMIN) {
          searchQuery = {
            from: startIndex,
            size: pageSize,
            query: {
              bool: {
                [filterType]: rules.map(mapRuleToQuery),
              },
            },
          };
        } else if (role === roles.SUB_ADMIN) {
          searchQuery = {
            from: startIndex,
            size: pageSize,
            query: {
              bool: {
                must: [
                  {
                    term: {
                      "resourceId.keyword": {
                        value: resources,
                        case_insensitive: true,
                      },
                    },
                  },
                  {
                    bool: {
                      [filterType]: rules.map(mapRuleToQuery),
                    },
                  },
                ],
              },
            },
          };
        }

        const response = await fetch(
          `${constants.OPEN_SEARCH_HOST}/${constants.INDEX_NAME}/_search`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${process.env.AUTH_TOKEN} `,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchQuery),
          }
        );

        const data = await response.json();

        reply.code(200).send({
          status: "success",
          data: {
            searchResults: data,
          },
          searchQuery,
        });
      } catch (error) {
        console.error("Error during search:", error);
        reply.code(412).send({ status: "error", message: "Bad Request" });
      }
    }
  );
}

module.exports = search;
