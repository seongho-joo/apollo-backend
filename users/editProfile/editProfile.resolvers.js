import { createWriteStream } from 'fs';
import client from '../../client';
import bcrypt from 'bcrypt';
import { protectedResolver } from '../users.utils';

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  const { filename, createReadStream } = await avatar;
  const readStream = createReadStream();
  const writeStream = createWriteStream(process.cwd() + '/uploads/' + filename);
  readStream.pipe(writeStream);
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
