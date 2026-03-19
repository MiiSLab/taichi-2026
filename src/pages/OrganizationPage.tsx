import React from 'react';
import Skeleton from '../components/Skeleton';
import Sponsors from '../components/Sponsors';
import { CONFIG, CONTENT } from '../content';
import { useData } from '../context/DataContext';

const OrganizationPage: React.FC = () => {
	const { people, isSyncing } = useData();

	const committeeMembers = people.filter((p) => !(p.chairType ? String(p.chairType).toLowerCase() : '').includes('keynote'));

	return (
		<div className='py-24 bg-transparent'>
			{/* ORGANIZATION (COMMITTEE) */}
			<section className='px-6 md:px-20 pb-24'>
				<div className='max-w-7xl mx-auto'>
					{/* Header */}
					<div className='flex flex-col items-center justify-center mb-16'>
						<h2 className='text-5xl md:text-7xl font-pixel text-lab-lime drop-shadow-md mb-4 text-center'>{CONTENT.committeeSection.title}</h2>
					</div>

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
									const indexA = CONFIG.notion.chairTypeOrder.findIndex((type) => type.toLowerCase() === a.toLowerCase());
									const indexB = CONFIG.notion.chairTypeOrder.findIndex((type) => type.toLowerCase() === b.toLowerCase());
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
											const displayTitle = titleData ? `${titleData.zh} ${titleData.en}` : chairType.toUpperCase();

											return (
												<div key={chairType}>
													<h3 className='font-pixel text-3xl text-lab-orange mb-8 uppercase'>{displayTitle}</h3>
													<div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
														{groupedMembers[chairType].map((member) => (
															<div
																key={member.id}
																className='group border border-gray-200 p-4 hover:border-lab-orange transition-colors text-center'
															>
																<div className='w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4'>
																	<img
																		src={member.image}
																		className='w-full h-full object-cover'
																		alt={member.name}
																	/>
																</div>
																<h4 className='font-bold text-lg mb-1'>{member.name}</h4>
																{member.notes && (
																	<p className='text-sm font-medium text-gray-700 mb-1'>{member.notes}</p>
																)}
																<p className='text-xs text-gray-500'>
																	{[member.institution, member.department].filter(Boolean).join(' ')}
																</p>
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

			<Sponsors />
		</div>
	);
};

export default OrganizationPage;
