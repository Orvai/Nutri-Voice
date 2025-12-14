module.exports = {
  nutri: {
    input: {
      target: "http://localhost:4000/api/docs-json",
    },
    output: {
      target: "apps/common/api/sdk/nutri-api.ts",
      schemas: "apps/common/api/sdk/schemas",
      client: "react-query",
      prettier: false,
      override: {
        fetch: {
          baseUrl: "http://localhost:4000/api",
        },
        mutator: {
          path: "apps/common/api/sdk/fetcher.ts",
          name: "customFetcher",
        },
      },
    },
  },
};
