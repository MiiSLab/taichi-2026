import React from 'react';
import Skeleton from '../components/Skeleton';
import Sponsors from '../components/Sponsors';
import { CONFIG, CONTENT } from '../content';
import { useData } from '../context/DataContext';

interface OrganizationPageProps {
	hidePeople?: boolean;
}

const OrganizationPage: React.FC<OrganizationPageProps> = ({ hidePeople = false }) => {
	const { people, isSyncing } = useData();

	const committeeMembers = people.filter((p) => !(p.chairType ? String(p.chairType).toLowerCase() : '').includes('keynote'));
	const SHOW_PEOPLE = !hidePeople;
	return (
		<div className='py-24 bg-transparent'>
			{/* ORGANIZATION (COMMITTEE) */}
			{SHOW_PEOPLE && (
				<section className='px-6 md:px-20 pb-24'>
					<div className='max-w-7xl mx-auto'>
						{/* Header */}
						{SHOW_PEOPLE && (
							<div className='flex flex-col items-center justify-center mb-16'>
								<h2 className='text-5xl md:text-7xl font-pixel text-lab-lime drop-shadow-md mb-4 text-center'>
									{CONTENT.committeeSection.title}
								</h2>
							</div>
						)}

						{isSyncing && people.length === 0 ? (
							<div className='space-y-16'>
								<div>
									<div className='h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse'></div>
									<Skeleton variant='person' count={8} />
								</div>
							</div>
						) : (
							<>
								{(() => {
									if (!SHOW_PEOPLE) return null;
									const groupedMembers: Record<string, PersonItem[]> = {};
									committeeMembers.forEach((member) => {
										const chairType = member.chairType || 'Committee Member';
										if (!groupedMembers[chairType]) {
											groupedMembers[chairType] = [];
										}
										groupedMembers[chairType].push(member);
									});

									// Sort members within each group by order property
									Object.keys(groupedMembers).forEach((chairType) => {
										groupedMembers[chairType].sort((a, b) => {
											// If order is not filled (undefined), treat it as a very large number to make it maximum
											const orderA = typeof a.order === 'number' ? a.order : 999999;
											const orderB = typeof b.order === 'number' ? b.order : 999999;
											return orderA - orderB;
										});
									});

									const sortedChairTypes = Object.keys(groupedMembers).sort((a, b) => {
										const indexA = CONFIG.notion.chairTypeOrder.findIndex(
											(type) => type.toLowerCase() === a.toLowerCase(),
										);
										const indexB = CONFIG.notion.chairTypeOrder.findIndex(
											(type) => type.toLowerCase() === b.toLowerCase(),
										);
										if (indexA === -1 && indexB === -1) return a.localeCompare(b);
										if (indexA === -1) return 1;
										if (indexB === -1) return -1;
										return indexA - indexB;
									});

									return (
										<div className='space-y-16'>
											{sortedChairTypes.map((chairType) => {
												let normalizedType = chairType.toLowerCase().trim();
												// Logic to force plural "chairs" to match config keys
												if (normalizedType.endsWith('chair')) {
													normalizedType += 's';
												}

												// Get title from map with separate zh and en fields
												const titleMap = CONTENT.committeeSection.chairTitles as Record<
													string,
													{ zh: string; en: string }
												>;
												const titleData = titleMap[normalizedType];
												const displayTitle = titleData
													? `${titleData.zh}  /  ${titleData.en}`
													: chairType.toUpperCase();

												return (
													<div key={chairType} className='mb-20'>
														<h3 className='font-pixel text-2xl md:text-3xl text-white mb-10 tracking-widest uppercase'>
															{displayTitle}
														</h3>
														<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16'>
															{groupedMembers[chairType].map((member) => (
																<div
																	key={member.id}
																	className='group relative w-full max-w-[290px] mx-auto aspect-[100/90]'
																>
																	<svg
																		viewBox='0 0 100 90'
																		className='absolute inset-0 w-full h-full drop-shadow-md transition-all duration-300'
																	>
																		{/* Outer red border */}
																		<polygon
																			points='50,16 90,75 10,75'
																			fill='#F7616C'
																			stroke='#F7616C'
																			strokeWidth='20'
																			strokeLinejoin='round'
																		/>
																		{/* Inner gray fill */}
																		<polygon
																			points='50,16 90,75 10,75'
																			fill='#D9D9D9'
																			stroke='#D9D9D9'
																			strokeWidth='16'
																			strokeLinejoin='round'
																		/>
																		{/* Top hole */}
																		<circle cx='50' cy='16' r='3.5' fill='#000' />
																	</svg>

																	{/* Content Wrapper */}
																	<div className='absolute inset-0 z-10 flex flex-col items-center pt-[22%] px-[6%] pb-[7%]'>
																		<div className='w-[28%] aspect-square rounded-full overflow-hidden bg-[#111] shadow-inner shrink-0 relative'>
																			{member.image && (
																				<img
																					src={member.image}
																					alt={member.name}
																					className='absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[120%]'
																				/>
																			)}
																		</div>
																		<div className='text-center w-full flex-1 flex flex-col justify-start text-black mt-3 md:mt-4'>
																			<h4 className='font-bold text-sm md:text-base mb-1 tracking-wider'>
																				{member.name}
																			</h4>
																			{member.notes && (
																				<p className='text-xs md:text-sm font-semibold opacity-90 mb-1'>
																					{member.notes}
																				</p>
																			)}
																			<p className='text-xs opacity-75 leading-tight tracking-wide px-1 md:px-2'>
																				{[member.institution, member.department]
																					.filter(Boolean)
																					.join(' ')}
																			</p>
																		</div>
																	</div>
																</div>
															))}
														</div>
													</div>
												);
											})}
										</div>
									);
								})()}
							</>
						)}
					</div>
				</section>
			)}
			<Sponsors />
		</div>
	);
};

export default OrganizationPage;
