import * as jwt from 'jsonwebtoken';
import client from '../client';
import { Resolver } from '../types';
// user token을 받아옴
export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const SECRET_KEY = process.env.SECRET_KEY;
    if (SECRET_KEY) {
      const verifiedToken = await jwt.verify(token, SECRET_KEY);
      if ('id' in verifiedToken) {
        const user = await client.user.findUnique({
          where: { id: verifiedToken['id'] },
        });
        if (user) {
          return user;
        }
      }
    }
  } catch {
    return null;
  }
};
// 로그인을 되어있지 않을 경우
export const protectedResolver = (ourResolver: Resolver) => (
  root,
  args,
  context,
  info
) => {
  if (!context.loggedInUser) {
    const query = info.operation.operation == 'query';
    if (query) {
      return null;
    }
    return {
      ok: false,
      error: 'Please login to perform this action.',
    };
  }
  return ourResolver(root, args, context, info);
};
