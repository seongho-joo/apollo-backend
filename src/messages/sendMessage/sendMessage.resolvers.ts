import { NEW_MESSAGE } from '../../constants';
import pubsub from '../../pubsub';
import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { message, roomId, userId }, { client, loggedInUser }) => {
        let room = null;
        if (userId) {
          const user = await client.user.findUnique({
            where: { id: userId },
            select: { id: true },
          });
          if (!user) {
            return { ok: false, error: '사용자를 찾을 수 없어요' };
          }
          room = await client.room.create({
            data: {
              users: {
                connect: [{ id: userId }, { id: loggedInUser.id }],
              },
            },
          });
        } else if (roomId) {
          room = await client.room.findUnique({
            where: { id: roomId },
            select: { id: true },
          });
          if (!room) {
            return { ok: false, error: '대화방이 존재하지 않아요' };
          }
        }
        const messages = await client.message.create({
          data: {
            message,
            room: { connect: { id: room.id } },
            user: { connect: { id: loggedInUser.id } },
          },
        });
        pubsub.publish(NEW_MESSAGE, { roomUpdate: { ...messages } });
        return { ok: true };
        8;
      }
    ),
  },
};

export default resolvers;
