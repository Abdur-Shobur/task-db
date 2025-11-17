export const env = {
	production: process.env.NODE_ENV === 'production',
	development: process.env.NODE_ENV === 'development',
	baseAPI: process.env.NEXT_PUBLIC_BACKEND_API as string,
	next_auth_url: process.env.NEXTAUTH_URL,
};
