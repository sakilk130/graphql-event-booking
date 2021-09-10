const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const graphQlShcema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/isAuth');

app.use(bodyParser.json());
app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlShcema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('database connected');
    app.listen(3000, () => {
      console.log('server is running on 3000');
    });
  })
  .catch((err) => {
    console.log(err);
  });
