import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    deleteComment: protectedResolver(
      async (_, { id }, { client, loggedInUser }) => {
        const existComment = await client.comment.findUnique({
          where: { id },
          select: { userId: true },
        });
        if (!existComment) {
          return { ok: false, error: '댓글이 없어요.' };
        } else if (existComment.userId !== loggedInUser.id) {
          return { ok: false, error: '본인 댓글이 아니에요.' };
        } else {
          await client.comment.delete({ where: { id } });
        }
        return { ok: true };
      }
    ),
  },
};
export default resolvers;
