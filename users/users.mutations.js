import bcrypt from 'bcrypt';
import client from '../client';

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      // check if username or email ar already on DB.
      const existingUser = await client.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });
      const hash = await bcrypt.hash(password, 10);
      return client.user.create({
        data: {
          username,
          firstName,
          lastName,
          email,
          password: hash,
        },
      });
      // hash password
      // save and return the user
    },
  },
};
