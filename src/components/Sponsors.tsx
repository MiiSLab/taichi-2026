import React from 'react';
import ScrollReveal from './ScrollReveal';
import { typography } from '../design-system/typography';
import { useContent } from '../context/LanguageContext';

interface LogoItem {
	name: string;
	logo: string;
	size: string;
}

const getSafePath = (path: string) => {
	if (!path) return '';
	if (path.startsWith('http')) return path;
	const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL;
	const cleanPath = path.startsWith('/') ? path : `/${path}`;
	return `${base}${cleanPath}`;
};

const getLogoFrameClasses = (size: string) => {
	switch (size) {
		case 'large':
			return 'min-h-[76px] min-w-0 px-1.5 py-2 md:min-h-[120px] md:shrink-0 md:px-5 md:py-4';
		case 'small':
			return 'min-h-[70px] min-w-0 px-1 py-2 md:min-h-[96px] md:shrink-0 md:px-4 md:py-3';
		case 'S':
			return 'min-h-[68px] min-w-0 px-1 py-2 md:min-h-[92px] md:shrink-0 md:px-3 md:py-3';
		default:
			return 'min-h-[70px] min-w-0 px-1 py-2 md:min-h-[96px] md:shrink-0 md:px-4 md:py-3';
	}
};

const getLogoImageClasses = (size: string) => {
	switch (size) {
		case 'large':
			return 'max-h-[46px] w-[min(38vw,148px)] max-w-[148px] md:w-auto md:max-h-[78px] md:max-w-[255px]';
		case 'small':
			return 'max-h-[40px] w-[min(34vw,128px)] max-w-[128px] md:w-auto md:max-h-[64px] md:max-w-[204px]';
		case 'S':
			return 'max-h-[38px] w-[min(32vw,118px)] max-w-[118px] md:w-auto md:max-h-[58px] md:max-w-[186px]';
		default:
			return 'max-h-[40px] w-[min(34vw,128px)] max-w-[128px] md:max-h-16 md:max-w-[220px]';
	}
};

const getLogoOpticalClasses = (name: string) => {
	switch (name) {
		case '台灣人機互動學會':
			return {
				frame: 'md:-translate-x-1',
				image: 'md:max-w-[238px]',
			};
		case '國科會晶創人文計畫':
			return {
				frame: 'md:translate-x-1',
				image: 'md:max-h-[70px] md:max-w-[242px]',
			};
		case '國立臺灣科技大學':
			return {
				frame: '',
				image: 'md:max-h-[68px] md:max-w-[196px]',
			};
		case '國立臺北科技大學':
			return {
				frame: '',
				image: 'md:max-h-[64px] md:max-w-[182px]',
			};
		case '美國在台協會':
			return {
				frame: '',
				image: 'md:max-h-[68px] md:max-w-[214px]',
			};
		case '美國創新中心':
			return {
				frame: '',
				image: 'md:max-h-[62px] md:max-w-[210px]',
			};
		case 'APMAR':
			return {
				frame: '',
				image: 'max-h-[34px] max-w-[104px] md:max-h-[50px] md:max-w-[156px]',
			};
		default:
			return {
				frame: '',
				image: '',
			};
	}
};

const LogoRow = ({ items, centered = false, delayStep = 70 }: { items: readonly LogoItem[]; centered?: boolean; delayStep?: number }) => (
	<div className={`flex w-full flex-nowrap items-center gap-2 md:w-auto md:gap-6 ${centered ? 'justify-center' : 'justify-start'}`}>
		{items.map((item, index) => {
			const opticalClasses = getLogoOpticalClasses(item.name);

			return (
				<ScrollReveal key={item.name} delay={index * delayStep}>
					<div className={`flex flex-1 items-center justify-center md:flex-none ${getLogoFrameClasses(item.size)} ${opticalClasses.frame}`}>
						<img
							src={getSafePath(item.logo)}
							alt={item.name}
							className={`object-contain transition duration-300 hover:scale-[1.02] ${getLogoImageClasses(item.size)} ${opticalClasses.image}`}
						/>
					</div>
				</ScrollReveal>
			);
		})}
	</div>
);

const Sponsors: React.FC = () => {
	const { organizers, coOrganizers, supportingOrganizers, sponsors, mainOrganizers, coOrganizersTitle, supportingOrganizersTitle, sponsorsTitle } = useContent().sponsorsSection;

	return (
		<section className='w-full bg-[#F2F2ED] px-6 py-24 text-black md:px-14 md:py-28 lg:px-20'>
			<div className='mx-auto flex max-w-[1200px] flex-col items-center space-y-24 text-center'>
				<div className='flex w-full flex-col items-center space-y-12'>

					<div className='flex w-full flex-col items-center justify-center gap-10'>
						<ScrollReveal delay={60}>
							<div className='flex w-full max-w-[620px] flex-col items-center gap-3 md:gap-4'>
								<p className='font-roboto text-[12px] uppercase tracking-[0.42em] text-black/55'>{mainOrganizers}</p>
								<LogoRow items={organizers} centered />
							</div>
						</ScrollReveal>

						{coOrganizers.length > 0 && (
							<ScrollReveal delay={140}>
								<div className='flex w-full max-w-[520px] flex-col items-center gap-3 md:gap-4'>
									<p className='font-roboto text-[12px] uppercase tracking-[0.42em] text-black/55'>{coOrganizersTitle}</p>
									<LogoRow items={coOrganizers} centered />
								</div>
							</ScrollReveal>
						)}

						{supportingOrganizers && supportingOrganizers.length > 0 && (
							<ScrollReveal delay={200}>
								<div className='flex w-full max-w-[520px] flex-col items-center gap-3 md:gap-4'>
									<p className='font-roboto text-[12px] uppercase tracking-[0.42em] text-black/55'>{supportingOrganizersTitle}</p>
									<LogoRow items={supportingOrganizers} centered />
								</div>
							</ScrollReveal>
						)}

						{sponsors && sponsors.length > 0 && (
							<ScrollReveal delay={200}>
								<div className='flex w-full max-w-[520px] flex-col items-center gap-3 md:gap-4'>
									<p className='font-roboto text-[12px] uppercase tracking-[0.42em] text-black/55'>{sponsorsTitle}</p>
									<LogoRow items={sponsors} centered delayStep={60} />
								</div>
							</ScrollReveal>
						)}

					</div>
				</div>

			</div>
		</section>
	);
};

export default Sponsors;
