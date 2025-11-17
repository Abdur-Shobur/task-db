import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
	function middleware(req) {
		// You can add additional middleware logic here if needed
		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
		pages: {
			signIn: '/',
		},
	}
);

// Configure which routes should be protected
export const config = {
	matcher: [
		/*
		 * Protect all dashboard routes
		 * Exclude:
		 * - / (root/login page)
		 * - /login (login page)
		 * - /api/auth (NextAuth routes)
		 * - /_next (Next.js internals)
		 * - Static files
		 */
		'/dashboard/:path*',
	],
};
