import { withFilter } from 'graphql-subscriptions';
import { NEW_MESSAGE } from '../../constants';
import pubsub from '../../pubsub';
import { Subscription } from '../../types';

const resolvers: Subscription = {
  Subscription: {
    roomUpdate: {
      subscribe: async (root, args, context, info) => {
        const room = await context.client.room.findUnique({
          where: { id: args.id },
          select: { id: true },
        });
        if (!room) {
          throw new Error('권한이 없습니다.');
        }
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          ({ roomUpdate }, { id }) => {
            return roomUpdate.roomId === id;
          }
        )(root, args, context, info);
      },
    },
  },
};

export default resolvers;
