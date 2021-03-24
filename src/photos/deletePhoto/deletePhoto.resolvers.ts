import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: protectedResolver(
      async (_, { id }, { client, loggedInUser }) => {
        const existPhoto = await client.photo.findUnique({
          where: { id },
          select: { userId: true },
        });
        if (!existPhoto) {
          return { ok: false, error: '게시물이 없어요.' };
        } else if (existPhoto.userId !== loggedInUser.id) {
          return { ok: false, error: '본인 게시물이 아니에요.' };
        } else {
          await client.photo.delete({ where: { id } });
        }
        return { ok: true };
      }
    ),
  },
};
export default resolvers;
