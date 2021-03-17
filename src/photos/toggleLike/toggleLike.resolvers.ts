import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    toggleLike: protectedResolver(
      async (_, { id }, { loggedInUser, client }) => {
        const isExistPhoto = await client.photo.findUnique({ where: { id } });
        if (!isExistPhoto) {
          return {
            ok: false,
            error: '게시물을 찾을 수 없어요.',
          };
        }
        const likeWhere = {
          photoId_userId: {
            userId: loggedInUser.id,
            photoId: id,
          },
        };
        const like = await client.like.findUnique({ where: likeWhere });
        if (like) {
          await client.like.delete({ where: likeWhere });
        } else {
          await client.like.create({
            data: {
              user: { connect: { id: loggedInUser.id } },
              photo: { connect: { id: isExistPhoto.id } },
            },
          });
        }
        return {
          ok: true,
        };
      }
    ),
  },
};

export default resolvers;
