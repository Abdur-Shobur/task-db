import { format } from 'date-fns';
export const dateFormat = (date: string) => {
	if (!date) return '';

	const parsedDate = new Date(date);
	return format(parsedDate, 'dd MMM yyyy');
};

export const timeFormat = (date: string) => {
	if (!date) return '';

	const parsedDate = new Date(date);
	return format(parsedDate, 'hh:mm a');
};

export const timeDifference = (date1: Date | null, date2: Date | null) => {
	if (date1 && date2) {
		const diffTime = Math.abs(date2.getTime() - date1.getTime());
		const daysDifference = diffTime / (1000 * 3600 * 24);
		return Math.round(daysDifference + 1);
	}
	return null;
};
