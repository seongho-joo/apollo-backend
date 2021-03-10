import { Resolvers } from '../types';

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId }, _, { client }) =>
      client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }, _, { client }) =>
      client.hashtag.findMany({
        where: {
          photos: {
            some: { id },
          },
        },
      }),
  },
  Hashtag: {
    totalPhotos: ({ id }, _, { client }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: { id },
          },
        },
      }),
<<<<<<< HEAD:photos/photos.resolvers.js
    photos: ({ id }, { page }) => {
=======
    photos: ({ id }, { page }, { loggedInUser, client }) => {
>>>>>>> ts-setup:src/photos/photos.resolvers.ts
      return client.hashtag.findUnique({ where: { id } }).photos();
    },
  },
};

export default resolvers;
