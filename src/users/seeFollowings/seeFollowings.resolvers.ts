import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_, { username, lastId }, { client }) => {
      const checkUsername = await client.user.findUnique({
        where: { username },
        select: { id: true }, // 한 튜플에 여러 속성 중 id만 찾아서 보여줌
      });
      if (!checkUsername) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
      const following = await client.user
        .findUnique({ where: { username } })
        .following({
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });
      return {
        ok: true,
        following,
      };
    },
  },
};
export default resolvers;
