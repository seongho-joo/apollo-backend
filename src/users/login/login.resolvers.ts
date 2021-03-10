import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { username, password }, { client }) => {
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return { ok: false, error: 'Incorrect username or password!' };
      }
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: 'Incorrect username or password!',
        };
      }
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};

export default resolvers;
