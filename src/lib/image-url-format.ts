import { env } from './env';

export const imageUrlFormat = (image: string): string => {
	if (!image) return '';
	const rawImage = image?.replace(/\\/g, '/');
	const imageUrl = `${env.baseAPI}/${rawImage}`;
	return imageUrl;
};
