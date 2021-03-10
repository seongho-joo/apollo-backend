import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (_, { username, page }, { client }) => {
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
      const followers = await client.user
        .findUnique({ where: { username } })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });
      console.log(followers);
      const count = await client.user.count({
        where: { following: { some: { username } } },
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(count / 5),
      };
    },
  },
};

export default resolvers;
