'use client';
import { Card, CardContent } from '@/components/ui/card';
import { cn, ErrorAlert, Motion } from '@/lib';
import { AnimatePresence, motion } from 'motion/react';
import {
	Loader1,
	Loader2,
	Loader3,
	Loader4,
	Loader5,
	Loader6,
	Loader7,
	Loader8,
} from '../loader';

const loaderMap: Record<string, React.ComponentType> = {
	'1': Loader1,
	'2': Loader2,
	'3': Loader3,
	'4': Loader4,
	'5': Loader5,
	'6': Loader6,
	'7': Loader7,
	'8': Loader8,
};

export function Container1({
	children,
	header,
	isError,
	isLoading,
	error,
	loadingCount = 4,
	loaderName,
}: {
	children: React.ReactNode;
	header?: React.ReactNode;
	isError?: boolean;
	isLoading?: boolean;
	error?: any;
	loadingCount?: number;
	loaderName?: string;
}) {
	const LoaderComponent =
		loaderMap[loaderName?.replace('loader-', '') ?? '5'] || Loader5;

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key="page"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
				transition={{
					duration: 0.8,
					delay: 0.5,
					ease: [0, 0.71, 0.2, 1.01],
				}}
			>
				<Card
					className={cn(
						'rounded-xl md:m-5 mt-0 md:mt-0 pb-0.5 bg-secondary gap-0 pt-4'
					)}
				>
					{header && <Motion>{header}</Motion>}

					<CardContent className="p-0.5">
						{isError && (
							<ErrorAlert>
								{error && error?.data && (
									<>
										{error?.data?.message && <p>{error?.data?.message}</p>}
										<ul className="list-inside list-disc text-sm">
											{error?.data?.error &&
												typeof error?.data?.error === 'object' &&
												Object.keys(error?.data?.error)?.map((key,i) => (
													<li key={i}>
														{key} : {error?.data?.error[key]}
													</li>
												))}
										</ul>
									</>
								)}
							</ErrorAlert>
						)}
						{!isError &&
							isLoading &&
							Array.from({ length: loadingCount }).map((_, i) => (
								<LoaderComponent key={i} />
							))}
						{children !== undefined && !isError && !isLoading && (
							<Card className="py-6">
								<CardContent className="px-2 md:px-5">
									{!isError && !isLoading && <Motion>{children}</Motion>}
								</CardContent>
							</Card>
						)}
					</CardContent>
				</Card>
			</motion.div>
		</AnimatePresence>
	);
}

/*
	<Container1
		isError={isError}
		isLoading={isLoading}
		header={<></>}
	>
			
	</Container1>

*/
