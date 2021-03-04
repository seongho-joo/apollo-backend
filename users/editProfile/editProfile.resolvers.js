import { createWriteStream } from 'fs';
import client from '../../client';
import bcrypt from 'bcryptjs';
import { protectedResolver } from '../users.utils';

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  let avatarUrl = null;
  if (avatar) {
    const { filename, createReadStream } = await avatar;
    const fileName = `${loggedInUser.id}_${Date.now()}_${filename}`;
    const readStream = createReadStream();
    const writeStream = createWriteStream(
      `${process.cwd()}/uploads/${fileName}`
    );
    readStream.pipe(writeStream);
    avatarUrl = `http://localhost:4000/static/${fileName}`;
  }
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
};

export default {
  Mutation: {
    edtitProfile: protectedResolver(resolverFn),
  },
};
