import { Mail } from 'lucide-react';
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
		<div className='bg-transparent min-h-screen text-white w-full'>
			{/* ORGANIZATION (COMMITTEE) TITLE ONLY HERO */}
			{SHOW_PEOPLE && (
				<div className='w-full pt-32 pb-16 px-6 md:px-20 relative overflow-hidden'>
					<div className='flex flex-col items-center max-w-7xl mx-auto relative z-10 w-full'>
						<h2 className='text-5xl md:text-8xl font-pixel text-white mb-6 text-center tracking-widest leading-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] uppercase'>
							{CONTENT.committeeSection.title}
						</h2>
					</div>
				</div>
			)}

			{SHOW_PEOPLE && (
				<section className='px-6 md:px-20 pb-24'>
					<div className='max-w-7xl mx-auto'>
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

												let emailInfo = null;
												if (normalizedType === 'general chairs') emailInfo = 'taiwanchi26@gmail.com';
												else if (normalizedType === 'paper chairs') emailInfo = 'taiwanchi26+paper@gmail.com';
												else if (normalizedType === 'poster chairs') emailInfo = 'taiwanchi26+poster@gmail.com';
												else if (normalizedType === 'demo chairs') emailInfo = 'taiwanchi26+demo@gmail.com';

												return (
													<div key={chairType} className='mb-20'>
														<div className='flex flex-col md:flex-row md:items-end gap-2 md:gap-4 lg:gap-6 mb-10'>
															<h3 className='font-pixel text-2xl md:text-3xl text-lab-lime tracking-widest uppercase'>
																{displayTitle}
															</h3>
															{emailInfo && (
																<a
																	href={`mailto:${emailInfo}`}
																	className='font-roboto text-sm md:text-base text-gray-200 hover:text-white transition-colors tracking-wide flex items-center md:mb-1 opacity-80 hover:opacity-100 gap-2 pb-[2px]'
																>
																	<Mail size={16} />
																	<span>{emailInfo}</span>
																</a>
															)}
														</div>
														<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16'>
															{groupedMembers[chairType].map((member) => (
																<div
																	key={member.id}
																	className='group relative w-full max-w-[341px] mx-auto aspect-[341/272]'
																>
																	<img
																		src='/images/organization_photo_frame.svg'
																		alt='frame'
																		className='absolute inset-0 w-full h-full drop-shadow-md transition-all duration-300'
																	/>

																	{/* Content Wrapper */}
																	{/* Custom calculated placement based on organization_photo_frame.svg viewBox="0 0 341 272" and cx="171.484" cy="115.474" r="57.4739" */}

																	{/* Photo perfectly covering the black circle */}
																	<div
																		className='absolute z-10 rounded-full overflow-hidden bg-[#111] shadow-inner shrink-0'
																		style={{
																			width: '33.71%', // (57.4739 * 2) / 341
																			aspectRatio: '1 / 1',
																			left: '33.43%', // (171.484 - 57.4739) / 341
																			top: '21.32%', // (115.474 - 57.4739) / 272
																		}}
																	>
																		{member.image && (
																			<img
																				src={member.image}
																				alt={member.name}
																				className='absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[120%]'
																			/>
																		)}
																	</div>

																	{/* Text Container placed in the lower wide area */}
																	<div
																		className='absolute z-10 text-center flex flex-col justify-start text-black w-[80%]'
																		style={{
																			left: '10%',
																			top: '66%',
																			height: '30%',
																		}}
																	>
																		<div className='flex flex-col items-stretch w-max max-w-full mx-auto'>
																			<h4 className=' text-[0.95rem] md:text-[1.1rem] leading-tight mb-[2px] text-justify [text-align-last:justify]'>
																				{member.name}
																			</h4>
																			{member.notes && (
																				<p className='text-[0.75rem] md:text-[0.85rem] opacity-90 mb-1 leading-tight text-justify [text-align-last:justify]'>
																					{member.notes}
																				</p>
																			)}
																		</div>
																		<p className='text-[0.7rem] md:text-[0.75rem] opacity-80 leading-tight tracking-wide px-1 md:px-2'>
																			{[member.institution, member.department]
																				.filter(Boolean)
																				.join(' ')}
																		</p>
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
