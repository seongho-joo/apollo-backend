import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectedResolver(
      async (_, { photoId, comment }, { client, loggedInUser }) => {
        const existPhoto = await client.photo.findUnique({
          where: { id: photoId },
          select: { id: true },
        });
        if (!existPhoto) {
          return {
            ok: false,
            error: '게시물이 없어요.',
          };
        }
        await client.comment.create({
          data: {
            comment,
            photo: {
              connect: { id: photoId },
            },
            user: {
              connect: { id: loggedInUser.id },
            },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
export default resolvers;
