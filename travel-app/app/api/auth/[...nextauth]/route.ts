import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const API_BASE_URL = 'https://travelguide-rttu.onrender.com';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call external TravelGuide API
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'https://travelguide-rttu.onrender.com'}/api/Authentication/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 10000,
            }
          );

          const userData = response.data.data || response.data;
          const token = response.data.token;

          if (userData && token) {
            return {
              id: userData.id || userData.userId,
              email: userData.email,
              name: userData.alias || userData.username || userData.name,
              username: userData.username,
              image: userData.image || userData.profileImage,
              accessToken: token,
            };
          }

          return null;
        } catch (error: any) {
          console.error('Auth error:', error.response?.data || error.message);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };