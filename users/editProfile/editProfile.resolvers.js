import client from '../../client';
import bcrypt from 'bcrypt';

export default {
  Mutation: {
    edtitProfile: async (
      _,
      { id, firstName, lastName, username, email, password: newPassword }
    ) => {
      let hash = null;
      if (newPassword) {
        hash = await bcrypt.hash(newPassword, 10);
      }
      const updateUser = await client.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          username,
          email,
          ...(hash && { password: hash }),
        },
      });
      if (updateUser.id) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: 'Could not profile.',
        };
      }
    },
  },
};
