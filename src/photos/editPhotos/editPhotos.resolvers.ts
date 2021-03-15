import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from '../phots.utils';

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { client, loggedInUser }) => {
        let hashtagObj = [];
        const isExistPhoto = await client.photo.findFirst({
          where: { id, userId: loggedInUser.id },
          include: { hashtags: { select: { hashtag: true } } },
        });
        if (caption) {
          hashtagObj = processHashtags(caption);
        }

        if (!isExistPhoto) {
          return {
            ok: false,
            error: '게시물을 찾을 수 없어요.',
          };
        }
        await client.photo.update({
          where: { id },
          data: {
            caption,
            hashtags: {
              disconnect: isExistPhoto.hashtags,
              connectOrCreate: hashtagObj,
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
