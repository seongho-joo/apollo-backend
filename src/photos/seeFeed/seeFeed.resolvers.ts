import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver(async (_, { page }, { client, loggedInUser }) =>
      client.photo.findMany({
        where: {
          OR: [
            { user: { followers: { some: { id: loggedInUser.id } } } },
            { userId: loggedInUser.id },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        skip: (page - 1) * 10,
      })
    ),
  },
};

export default resolvers;
