import authConfig from './auth.config';
import NextAuth from 'next-auth';

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
