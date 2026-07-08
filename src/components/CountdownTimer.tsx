import React, { useEffect, useState } from 'react';
import { typography } from '../design-system/typography';

interface Props {
	targetDateStr?: string;
	small?: boolean;
	variant?: 'default' | 'cfpHero';
}

const CountdownTimer: React.FC<Props> = ({
	targetDateStr = '2026-08-04T00:00:00+08:00',
	small = false,
	variant = 'default',
}) => {
	const targetDate = new Date(targetDateStr).getTime();
	const [timeLeft, setTimeLeft] = useState<{ days: string; hours: string; minutes: string; seconds: string }>({
		days: '00',
		hours: '00',
		minutes: '00',
		seconds: '00',
	});

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date().getTime();
			const distance = targetDate - now;

			if (distance < 0) {
				clearInterval(interval);
				setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
			} else {
				const days = Math.floor(distance / (1000 * 60 * 60 * 24));
				const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((distance % (1000 * 60)) / 1000);

				setTimeLeft({
					days: String(days).padStart(2, '0'),
					hours: String(hours).padStart(2, '0'),
					minutes: String(minutes).padStart(2, '0'),
					seconds: String(seconds).padStart(2, '0'),
				});
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [targetDateStr, targetDate]);

	const containerScale =
		variant === 'cfpHero'
			? `${typography.pattern.countdownHeroValue} text-secondary drop-shadow-[0_0_28px_rgba(41,185,58,0.55)]`
			: small
				? 'text-4xl md:text-5xl lg:text-5xl drop-shadow-[0_0_10px_rgba(255,0,102,0.6)]'
				: `${typography.pattern.countdownDefaultValue} drop-shadow-[0_0_20px_rgba(255,0,102,0.8)]`;

	const labelScale =
		variant === 'cfpHero' ? typography.pattern.countdownLabel : small ? 'text-[10px] md:text-xs' : typography.pattern.countdownLabel;
	const colonMargin = variant === 'cfpHero' ? 'mb-6 md:mb-8' : small ? 'mb-4 md:mb-6' : 'mb-8 md:mb-12';
	const labelClass =
		variant === 'cfpHero'
			? 'tracking-normal font-sans font-bold text-[#525252] mt-1 uppercase drop-shadow-none'
			: 'tracking-normal font-sans font-bold text-white mt-1 uppercase drop-shadow-none';
	const wrapperClass =
		variant === 'cfpHero'
			? 'mx-auto flex w-full flex-nowrap items-start justify-center gap-2 whitespace-nowrap md:gap-4 lg:gap-6 xl:gap-8'
			: 'flex w-full flex-nowrap items-start justify-between gap-2 whitespace-nowrap md:gap-4';
	const unitClass = variant === 'cfpHero' ? 'flex w-[4.5rem] flex-none flex-col items-center sm:w-[6rem] md:w-[8rem] lg:w-[10rem] xl:w-[12rem]' : 'flex flex-1 basis-0 flex-col items-center';

	return (
		<div
			className={`${wrapperClass} ${variant === 'cfpHero' ? 'font-dela' : 'text-lab-pink font-dela tracking-[0.06em]'} ${containerScale}`}
		>
			<div className={unitClass}>
				<span>{timeLeft.days}</span>
				<span className={`${labelClass} ${labelScale}`}>Days</span>
			</div>
			<span className={`hidden sm:block ${colonMargin}`}>:</span>
			<div className={unitClass}>
				<span>{timeLeft.hours}</span>
				<span className={`${labelClass} ${labelScale}`}>Hours</span>
			</div>
			<span className={`hidden sm:block ${colonMargin}`}>:</span>
			<div className={unitClass}>
				<span>{timeLeft.minutes}</span>
				<span className={`${labelClass} ${labelScale}`}>Mins</span>
			</div>
			<span className={`hidden sm:block ${colonMargin}`}>:</span>
			<div className={unitClass}>
				<span>{timeLeft.seconds}</span>
				<span className={`${labelClass} ${labelScale}`}>Secs</span>
			</div>
		</div>
	);
};

export default CountdownTimer;
