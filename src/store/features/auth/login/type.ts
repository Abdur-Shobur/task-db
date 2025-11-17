export interface ILogin {
	email: string;
	password: string;
}

export interface ILoginResponse {
	accessToken: string;
	refreshToken: string;
	user: {
		id: number;
		name: string;
		email: string;
	};
}
