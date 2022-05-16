import { RouteShorthandOptions } from "fastify";

export const getPdfOpts: RouteShorthandOptions = {
  schema: {
    querystring: {
      type: "object",
      required: ["username", "slug"],
      properties: {
        username: { type: "string" },
        slug: { type: "string" },
        filename: { type: "string" },
      },
    },
  },
};
