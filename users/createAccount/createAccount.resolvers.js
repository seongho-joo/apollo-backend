import client from '../../client';
import bcrypt from 'bcryptjs';

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });
        if (existingUser) {
          throw new Error('This username/email is already taken.');
        }
        const hash = await bcrypt.hash(password, 10);
        await client.user.create({
          data: {
            username,
            firstName,
            lastName,
            email,
            password: hash,
          },
        });
        return {
          ok: true,
        };
      } catch (e) {
        return {
          ok: false,
          error: "Can't create account.",
        };
      }
    },
  },
};
