import jwt from 'jsonwebtoken';
import client from '../client';
import { Resolver } from '../types';
// user token을 받아옴
export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const verifiedToken: any = await jwt.verify(token, process.env.SECRET_KEY);
    if ('id' in verifiedToken) {
      const user = await client.user.findUnique({
        where: { id: verifiedToken['id'] },
      });
      if (user) {
        return user;
      }
    }
    return null;
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
    return {
      ok: false,
      error: 'Please login to perform this action.',
    };
  }
  return ourResolver(root, args, context, info);
};
