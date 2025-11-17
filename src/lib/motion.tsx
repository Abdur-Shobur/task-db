'use client';

import { motion } from 'motion/react';
import React from 'react';

const variants = {
	hidden: { opacity: 0 },
	enter: { opacity: 1 },
};

export function Motion({ children }: { children: React.ReactNode }) {
	return (
		<motion.div
			initial="hidden"
			animate="enter"
			variants={variants}
			exit={{ opacity: 0, transition: { duration: 0.5 } }}
			transition={{ duration: 0.5 }}
		>
			{children}
		</motion.div>
	);
}

export function MotionView({ children }: { children: React.ReactNode }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 100 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: 0.1, duration: 0.5 }}
		>
			{children}
		</motion.div>
	);
}

export function MotionShow({
	children,
	once = false,
}: {
	children: React.ReactNode;
	once?: boolean;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once }}
			transition={{ duration: 0.5, staggerChildren: 0.2 }}
		>
			{children}
		</motion.div>
	);
}

export function MotionContainer({ children }: { children: React.ReactNode }) {
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={{
				hidden: {},
				visible: { transition: { staggerChildren: 0.2 } },
			}}
		>
			{children}
		</motion.div>
	);
}

export function MotionItem({
	children,
	i,
	className,
	once = true,
}: {
	children: React.ReactNode;
	i: number;
	className?: string;
	once?: boolean;
}) {
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 15 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once }}
			transition={{
				delay: i * 0.1,
				type: 'spring',
				stiffness: 60,
				damping: 20,
			}}
			whileHover={{
				boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
				transition: { duration: 0.5, ease: 'linear' },
			}}
		>
			{children}
		</motion.div>
	);
}
