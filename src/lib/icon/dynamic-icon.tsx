import * as Ic from 'lucide-react';
import { IconType } from './icon.type';

export const DynamicIcon = ({
	icon,
	className,
	style,
	...rest
}: {
	icon?: string;
	className?: string;
	style?: React.CSSProperties;
	[key: string]: any; // Allow other arbitrary props
}) => {
	// Check if icon is provided and exists in IconType
	const SelectedIcon = icon && (Ic as unknown as IconType)[icon || 'Aperture'];

	// If SelectedIcon exists, render it with additional props
	if (SelectedIcon) {
		return <SelectedIcon className={className} style={style} {...rest} />;
	}

	// Otherwise, return null or handle the case as you see fit
	return null;
};
