import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }, { client }) => {
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

export default resolvers;
