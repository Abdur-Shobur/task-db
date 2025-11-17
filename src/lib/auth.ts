import { ILoginResponse } from '@/store/features/auth';
import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

type UserType = ILoginResponse['user'];

// Define the extended user type
interface CustomUser extends NextAuthUser {
	accessToken?: string;
	refreshToken?: string;
	user: UserType;
}

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				token: {},
			},

			async authorize(credentials) {
				if (credentials?.token) {
					const parsedToken: ILoginResponse = JSON.parse(credentials.token);

					return {
						id: parsedToken.user.email,
						accessToken: parsedToken.accessToken,
						refreshToken: parsedToken.refreshToken,
						user: parsedToken.user,
					};
				}
				return null;
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				const customUser = user as CustomUser;
				return {
					...token,
					accessToken: customUser.accessToken,
					refreshToken: customUser.refreshToken,
					user: customUser.user,
				};
			}

			return token;
		},

		async session({ session, token }) {
			// Map token properties to session
			session.user = token.user as UserType;
			// session.user.accessToken = token.accessToken as string;
			// session.user.refreshToken = token.refreshToken as string;

			return session;
		},
	},
};

