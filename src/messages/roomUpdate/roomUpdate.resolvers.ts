import { withFilter } from 'graphql-subscriptions';
import { NEW_MESSAGE } from '../../constants';
import pubsub from '../../pubsub';
import { Subscription } from '../../types';

const resolvers: Subscription = {
  Subscription: {
    roomUpdate: {
      subscribe: async (root, args, context, info) => {
        const room = await context.client.room.findFirst({
          where: {
            id: args.id,
            users: { some: { id: context.loggedInUser.id } },
          },
          select: { id: true },
        });
        if (!room) {
          throw new Error('권한이 없습니다.');
        }
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdate }, { id }, { loggedInUser }) => {
            if (roomUpdate.roomId === id) {
              const room = await context.client.room.findFirst({
                where: {
                  id,
                  users: { some: { id: loggedInUser.id } },
                },
                select: { id: true },
              });
              if (!room) {
                return false;
              }
              return true;
            }
            return false;
          }
        )(root, args, context, info);
      },
    },
  },
};

export default resolvers;
