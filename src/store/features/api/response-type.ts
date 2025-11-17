export type ResponseType<T> = {
	status: boolean;
	message: string;
	data: T;
	statusCode: number;
	meta: any;
};

export interface IPaginatedResponse<T> {
	data: T[];
	meta: IMeta;
	status: boolean;
	message: string;
	statusCode: number;
}

export interface IMeta {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	limit: number;
	page: number;
	total: number;
	pageCount: number;
}

export interface IErrorResponse {
	status: boolean;
	message: string;
	statusCode: number;
	errors?: { field: string; message: string }[];
}
