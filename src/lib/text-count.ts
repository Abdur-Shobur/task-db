export const textCount = (text: string, count: number = 30) => {
	if (!text) return '';
	if (text.length <= count) return text;
	return `${text.slice(0, count)}...`;
};
