const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { graphqlHTTP } = require('express-graphql');

const { buildSchema } = require('graphql');

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
    type RootQuery{
        events: [String!]!
    }

    type RootMutation{
        createEvent(name:String):String
    }
    
    schema {
        query:RootQuery
        mutation:RootMutation
    }
    `),
    rootValue: {
      events: () => {
        return ['graphql', 'Apollo', 'rest api'];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log('server is running on 3000');
});
