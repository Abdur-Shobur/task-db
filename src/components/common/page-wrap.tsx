import { Card, CardContent } from '../ui/card';

export function PageWrap({
	children,
	header,
}: {
	children: React.ReactNode;
	header?: React.ReactNode;
}) {
	return (
		<Card className="rounded-xl md:m-5 mt-0 pb-0.5 bg-secondary gap-0 pt-4 mx-2">
			{/* if card header is provided  */}
			{header && header}

			{/* if children is provided  */}
			{children && <CardContent className="px-2 py-2">{children}</CardContent>}
		</Card>
	);
}
