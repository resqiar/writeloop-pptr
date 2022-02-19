import { RouteShorthandOptions } from "fastify";

export const getPdfOpts: RouteShorthandOptions = {
  schema: {
    querystring: {
      type: "object",
      required: ["blogId"],
      properties: {
        blogId: { type: "string" },
        filename: { type: "string" },
      },
    },
  },
};
