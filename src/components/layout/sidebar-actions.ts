import { sidebarItem } from './layout-type';

export const filterItems = (items: sidebarItem[], searchQuery: string) => {
	return items
		.map((item) => {
			const subItems = item.items?.filter((sub) =>
				sub.title.toLowerCase().includes(searchQuery.toLowerCase())
			);

			const isMatch =
				item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(subItems && subItems.length > 0);

			if (isMatch) {
				return {
					...item,
					items: subItems,
				};
			}
			return null;
		})
		.filter(Boolean) as sidebarItem[];
};
