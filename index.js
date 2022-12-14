var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const { default: fetch } = require("node-fetch");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`

  type Products { 
    id: ID
    code: String
    name: String
    stock: Int
  }

  type Query {
    getProductById(code: String!): Products!,
    getProductByCode(code: String!): Products!
  }

  type Mutation {
    addProduct(code: String!, stock: Int!): Products!
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
    getProductByCode: async ({ code }) => {
        const openfoodUrl = `https://world.openfoodfacts.org/api/v2/search?code=${code}&fields=id,code,product_name`;
        const productApiUrl = `http://localhost:8080/produits/code/${code}`;
    
        const openfoodResponse = await fetch(openfoodUrl);
        const productApiResponse = await fetch(productApiUrl);
    
        const openfoodData = await openfoodResponse.json();
        const productApiData = await productApiResponse.json();

        console.log(productApiData);

        return {
          id: productApiData.id,
          name: productApiData.nom != null ? productApiData.nom : openfoodData.products[0].product_name,
          code: openfoodData.products[0].code,
          stock: productApiData.stock,
        };
      },
      addProduct: async ({ code, stock }) => {
        const openfoodUrl = `https://world.openfoodfacts.org/api/v2/search?code=${code}&fields=id,code,product_name`;
        const productApiUrl = `http://localhost:8080/produits`;
    
        const openfoodResponse = await fetch(openfoodUrl);
        const openfoodData = await openfoodResponse.json();
        
        const productApiResponse = await fetch(productApiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            stock: stock,
            name: openfoodData.products[0].product_name
          }),
        });
    
        const productApiData = await productApiResponse.json();
        console.log(productApiData);
        return {
          id: Number(productApiData.id),
          name: productApiData.nom,
          code: productApiData.code,
          stock: productApiData.stock,
        };
      }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');