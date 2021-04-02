import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Query: {
    seeRoom: protectedResolver(async (_, { id }, { client, loggedInUser }) =>
      client.room.findFirst({
        where: {
          id,
          users: { some: { id: loggedInUser.id } },
        },
        include: {
          users: true,
          message: true,
        },
      })
    ),
  },
};

export default resolvers;
