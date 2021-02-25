import client from '../../client';
import bcrypt from 'bcrypt';
import { protectedResolver } from '../users.utils';

export default {
  Mutation: {
    edtitProfile: protectedResolver(
      async (
        _,
        { firstName, lastName, username, email, password: newPassword },
        { loggedInUser, protectResolver }
      ) => {
        let hash = null;
        if (newPassword) {
          hash = await bcrypt.hash(newPassword, 10);
        }
        const updateUser = await client.user.update({
          where: { id: loggedInUser.id },
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
      }
    ),
  },
};
