## Build Setup

```
# install dependencies
npm install

# start the server (GraphiQL is started at http://127.0.0.1:3000)
node index.js
```

## Query Examples

```js
query { # get product
  getProductByCode(code:"3017620422003") {
    id,
    name,
    code
  }
}
```

```js
mutation { # Create a product
  addProduct(code: "3017620422003", stock: 10) {
    id,
    name,
    code
  }
}
```