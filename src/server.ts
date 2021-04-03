require('dotenv').config();
import * as http from 'http';
import express = require('express');
import logger = require('morgan');
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { getUser } from './users/users.utils';
import client from './client';

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  subscriptions: {
    onConnect: async ({ token }: any) => {
      if (!token) {
        throw new Error("Yon can't listen.");
      }
      const loggedInUser = await getUser(token);
      return {
        loggedInUser,
      };
    },
  },
  context: async ({ req, connection }) => {
    if (req) {
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
    } else {
      const {
        context: { loggedInUser },
      } = connection;
      return {
        loggedInUser,
        client,
      };
    }
  },
});

const app = express();
app.use(logger('tiny'));

app.use('/static', express.static('uploads'));

apollo.applyMiddleware({ app });

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}/graphql`);
});
