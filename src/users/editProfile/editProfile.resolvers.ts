import { createWriteStream } from 'fs';
import * as bcrypt from 'bcryptjs';
import { protectedResolver } from '../users.utils';
import { Resolvers } from '../../types';
import { User } from '@prisma/client';
import { uploadToS3 } from '../../shared/shared.utils';

const resolvers: Resolvers = {
  Mutation: {
    edtitProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        },
        { loggedInUser, client }
      ) => {
        let avatarUrl = null;
        if (avatar) {
          avatarUrl = await uploadToS3(avatar, loggedInUser.id, 'avatars');
          // const { filename, createReadStream } = await avatar;
          // const fileName = `${loggedInUser.id}_${Date.now()}_${filename}`;
          // const readStream = createReadStream();
          // const writeStream = createWriteStream(
          //   `${process.cwd()}/uploads/${fileName}`
          // );
          // readStream.pipe(writeStream);
          // avatarUrl = `http://localhost:4000/static/${fileName}`;
        }
        let hash = null;
        if (newPassword) {
          hash = await bcrypt.hash(newPassword, 10);
        }
        const updateUser: User = await client.user.update({
          where: { id: loggedInUser.id },
          data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            ...(hash && { password: hash }),
            ...(avatarUrl && { avatar: avatarUrl }),
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

export default resolvers;
