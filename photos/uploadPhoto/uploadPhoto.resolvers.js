import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtagObj = [];
        if (caption) {
          const hashtags = caption.match(/#[\w]+/g);
          hashtagObj = hashtags.map((hashtag) => ({
            where: { hashtag },
            create: { hashtag },
          }));
        }
        const photo = await client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: { id: loggedInUser.id },
            },
            ...(hashtagObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });
        return {
          ok: true,
          photo,
        };
      }
    ),
  },
};
