import bcrypt from 'bcrypt';
import client from '../client';

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      // check if username or email ar already on DB.
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
        return client.user.create({
          data: {
            username,
            firstName,
            lastName,
            email,
            password: hash,
          },
        });
      } catch (e) {
        return e;
      }
      // hash password
      // save and return the user
    },
  },
};
