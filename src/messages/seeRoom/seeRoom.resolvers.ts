import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Query: {
    seeRoom: protectedResolver(async (_, __, { client, loggedInUser }) =>
      client.room.findMany({
        where: { users: { some: { id: loggedInUser.id } } },
      })
    ),
  },
};

export default resolvers;
