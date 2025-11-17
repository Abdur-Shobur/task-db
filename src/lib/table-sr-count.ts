export const tableSrCount = (
	page: number | string,
	i: number,
	limit: number = 10
) => {
	if (!page) {
		page = 1;
	}
	if (!i) {
		i = 0;
	}
	if (typeof page === 'string') {
		page = Number(page);
	}

	return ((page - 1) * limit + i + 1).toString().padStart(2, '0');
};
