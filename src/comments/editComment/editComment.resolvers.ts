import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    editComment: protectedResolver(
      async (_, { id, text }, { client, loggedInUser }) => {
        const existComment = await client.comment.findUnique({
          where: { id },
          select: { userId: true },
        });
        if (!existComment) {
          return { ok: false, error: '댓글이 없어요.' };
        } else if (existComment.userId !== loggedInUser.id) {
          return { ok: false, error: '권한이 없어요.' };
        } else {
          await client.comment.update({
            where: { id },
            data: { comment: text },
          });
        }
        return { ok: true };
      }
    ),
  },
};
export default resolvers;
