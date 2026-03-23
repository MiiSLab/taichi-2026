import React, { useEffect, useState } from 'react';

interface Props {
	targetDateStr?: string;
	small?: boolean;
}

const CountdownTimer: React.FC<Props> = ({ targetDateStr = '2026-08-04T00:00:00+08:00', small = false }) => {
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

	const containerScale = small
		? 'text-4xl md:text-5xl lg:text-5xl drop-shadow-[0_0_10px_rgba(255,0,102,0.6)]'
		: 'text-6xl md:text-8xl lg:text-9xl drop-shadow-[0_0_20px_rgba(255,0,102,0.8)]';

	const labelScale = small ? 'text-[10px] md:text-xs' : 'text-sm md:text-lg';
	const colonMargin = small ? 'mb-4 md:mb-6' : 'mb-8 md:mb-12';

	return (
		<div className={`flex items-center justify-center gap-2 md:gap-4 text-lab-pink font-reddit tracking-widest ${containerScale}`}>
			<div className='flex flex-col items-center'>
				<span>{timeLeft.days}</span>
				<span className={`tracking-normal font-sans font-bold text-white mt-1 uppercase drop-shadow-none ${labelScale}`}>
					Days
				</span>
			</div>
			<span className={colonMargin}>:</span>
			<div className='flex flex-col items-center'>
				<span>{timeLeft.hours}</span>
				<span className={`tracking-normal font-sans font-bold text-white mt-1 uppercase drop-shadow-none ${labelScale}`}>
					Hours
				</span>
			</div>
			<span className={colonMargin}>:</span>
			<div className='flex flex-col items-center'>
				<span>{timeLeft.minutes}</span>
				<span className={`tracking-normal font-sans font-bold text-white mt-1 uppercase drop-shadow-none ${labelScale}`}>
					Mins
				</span>
			</div>
			<span className={colonMargin}>:</span>
			<div className='flex flex-col items-center'>
				<span>{timeLeft.seconds}</span>
				<span className={`tracking-normal font-sans font-bold text-white mt-1 uppercase drop-shadow-none ${labelScale}`}>
					Secs
				</span>
			</div>
		</div>
	);
};

export default CountdownTimer;
