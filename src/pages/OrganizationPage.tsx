import { Check, Copy, Mail, RotateCcw, Settings } from 'lucide-react';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';



import Skeleton from '../components/Skeleton';
import Sponsors from '../components/Sponsors';
import { CONFIG, CONTENT } from '../content';
import { useData } from '../context/DataContext';
import { useSEO } from '../hooks/useSEO';

interface OrganizationPageProps {
	hidePeople?: boolean;
}

const OrganizationPage: React.FC<OrganizationPageProps> = ({ hidePeople = false }) => {
	useSEO('組織委員會', 'TAICHI 2026 研討會籌備委員與大會主席名單。團隊介紹與聯絡資訊。');

	const { people, isSyncing } = useData();
	const [searchParams] = useSearchParams();
	const isEditMode = searchParams.get('edit') === 'true';
	const [localAdjustments, setLocalAdjustments] = useState<Record<string, ImageAdjustment>>(CONFIG.imageAdjustments);

	const updateAdjustment = (id: string, field: keyof ImageAdjustment, value: string | number) => {
		setLocalAdjustments((prev) => {
			const current = prev[id] || {};
			const member = people.find((p) => p.id === id);

			let newPos = current.objectPosition || '50% 50%';
			const parts = newPos.split(' ');
			let x = parts[0] || '50%';
			let y = parts[1] || '50%';

			if (field === 'objectPosition') {
				// value is expected to be "x y" or we handle it by field
				newPos = String(value);
			}

			const finalAdjustment = {
				...current,
				[field]: value,
				lastUrl: member?.image || current.lastUrl,
			};

			// Special handling for X/Y convenience if we were to pass them separately
			// But for now we just pass the whole string from the UI
			return {
				...prev,
				[id]: finalAdjustment,
			};
		});
	};


	const committeeMembers = people.filter((p) => !(p.chairType ? String(p.chairType).toLowerCase() : '').includes('keynote'));

	const SHOW_PEOPLE = !hidePeople;
	return (
		<div className='bg-transparent min-h-screen text-white w-full'>
			{/* ORGANIZATION (COMMITTEE) TITLE ONLY HERO */}
			{SHOW_PEOPLE && (
				<div className='w-full pt-32 pb-16 px-6 md:px-20 relative overflow-hidden'>
					<div className='flex flex-col items-center max-w-7xl mx-auto relative z-10 w-full'>
						<h1 className='text-5xl md:text-8xl font-pixel text-white mb-6 text-center tracking-widest leading-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] uppercase'>
							{CONTENT.committeeSection.title}
						</h1>
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
															{groupedMembers[chairType].map((member) => {
																const adjustment = localAdjustments[member.id];



																// Check if image updated in Notion
																if (
																	adjustment &&
																	adjustment.lastUrl &&
																	member.image &&
																	adjustment.lastUrl !== member.image
																) {
																	console.warn(
																		`[Image Update] Notion image for ${member.name} has changed. Previous adjustment might be off.`,
																		{
																			memberId: member.id,
																			currentUrl: member.image,
																			lastAdjustedUrl: adjustment.lastUrl,
																		},
																	);
																}

																return (
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
																			<div
																				className='w-full h-full transition-transform duration-300'
																				style={{
																					transform: `scale(${adjustment?.scale || 1})`,
																				}}
																			>
																				<img
																					src={member.image}
																					alt={member.name}
																					className='absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[115%]'
																					style={{
																						objectPosition: adjustment?.objectPosition || 'center',
																					}}
																				/>
																			</div>
																		)}


																	</div>

																	{/* Edit Controls */}
																	{isEditMode && (
																		<div className='absolute -right-4 top-0 z-50 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-2xl flex flex-col gap-3 w-32'>
																			<div className='text-[10px] uppercase tracking-widest opacity-60 mb-1'>Adjust Image</div>
																			<div className='flex flex-col gap-1'>
																				<label className='text-[9px] opacity-70'>Pos X: {adjustment?.objectPosition?.split(' ')[0] || '50%'}</label>
																				<input
																					type='range'
																					min='0'
																					max='100'
																					value={parseInt(adjustment?.objectPosition?.split(' ')[0] || '50')}
																					onChange={(e) => {
																						const y = adjustment?.objectPosition?.split(' ')[1] || '50%';
																						updateAdjustment(member.id, 'objectPosition', `${e.target.value}% ${y}`);
																					}}
																					className='w-full accent-lab-lime h-1 bg-white/20 rounded-lg appearance-none cursor-pointer'
																				/>
																			</div>
																			<div className='flex flex-col gap-1'>
																				<label className='text-[9px] opacity-70'>Pos Y: {adjustment?.objectPosition?.split(' ')[1] || '50%'}</label>
																				<input
																					type='range'
																					min='0'
																					max='100'
																					value={parseInt(adjustment?.objectPosition?.split(' ')[1] || '50')}
																					onChange={(e) => {
																						const x = adjustment?.objectPosition?.split(' ')[0] || '50%';
																						updateAdjustment(member.id, 'objectPosition', `${x} ${e.target.value}%`);
																					}}
																					className='w-full accent-lab-lime h-1 bg-white/20 rounded-lg appearance-none cursor-pointer'
																				/>
																			</div>

																			<div className='flex flex-col gap-1'>
																				<label className='text-[9px] opacity-70'>Scale: {adjustment?.scale || 1}</label>
																				<input
																					type='range'
																					min='0.5'
																					max='3'
																					step='0.05'
																					value={adjustment?.scale || 1}
																					onChange={(e) => updateAdjustment(member.id, 'scale', parseFloat(e.target.value))}
																					className='w-full accent-lab-lime h-1 bg-white/20 rounded-lg appearance-none cursor-pointer'
																				/>
																			</div>
																			<button
																				onClick={() => {
																					const newAdjustments = { ...localAdjustments };
																					delete newAdjustments[member.id];
																					setLocalAdjustments(newAdjustments);
																				}}
																				className='mt-2 p-1 text-[9px] bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded transition-colors flex items-center justify-center gap-1 uppercase tracking-tighter'
																			>
																				<RotateCcw size={10} /> Reset
																			</button>
																		</div>
																	)}


																	{/* Text Container placed in the lower wide area */}
																	<div
																		className='absolute z-10 text-center flex flex-col justify-center text-black w-[96%]'
																		style={{
																			left: '2%',
																			top: '66%',
																			height: '32%',
																		}}
																	>
																		<div className='flex flex-col items-stretch w-max max-w-full mx-auto'>
																			<h4 className=' text-[1rem] md:text-[1.1rem] leading-tight mb-0 text-justify [text-align-last:justify]'>
																				{member.name}
																			</h4>
																			{member.notes && (
																				<p className='text-[0.75rem] md:text-[0.8rem] opacity-90 mb-0.5 leading-tight text-justify [text-align-last:justify]'>
																					{member.notes}
																				</p>
																			)}
																		</div>
																		<p className='text-[0.65rem] md:text-[0.7rem] opacity-80 leading-tight tracking-wide px-1 md:px-2 whitespace-nowrap'>
																			{[member.institution, member.department].filter(Boolean).join(' ')}
																		</p>



																	</div>
																	</div>
																);
															})}

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

			{/* ADMIN CONFIG GENERATOR */}
			{isEditMode && (
				<div className='fixed bottom-8 right-8 z-[100] w-[400px] max-w-[90vw]'>
					<div className='bg-zinc-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]'>
						<div className='bg-zinc-800 px-5 py-3 flex items-center justify-between border-b border-white/10'>
							<div className='flex items-center gap-3'>
								<Settings className='text-lab-lime animate-spin-slow' size={18} />
								<span className='font-pixel text-sm tracking-widest'>CONFIG GENERATOR</span>
							</div>
							<div className='text-[10px] opacity-40 uppercase'>Notion Image ID Map</div>
						</div>
						<div className='p-4 overflow-y-auto custom-scrollbar bg-black/40'>
							<p className='text-[11px] opacity-60 mb-3 leading-relaxed'>
								Adjust images above, then copy this object into <code className='text-lab-lime'>src/content.ts</code>.
							</p>
							<div className='relative group'>
								<pre className='text-[10px] leading-relaxed bg-black/60 p-4 rounded-lg font-mono text-gray-300 border border-white/5 overflow-x-auto selection:bg-lab-lime/30'>
									{`imageAdjustments: ${JSON.stringify(localAdjustments, null, 2)} as Record<string, ImageAdjustment>,`}
								</pre>
								<button
									onClick={() => {
										const code = `imageAdjustments: ${JSON.stringify(localAdjustments, null, 2)} as Record<string, ImageAdjustment>,`;
										navigator.clipboard.writeText(code);
										const btn = document.getElementById('copy-btn');
										if (btn) btn.innerText = 'COPIED!';
										setTimeout(() => {
											if (btn) btn.innerText = 'COPY CODE';
										}, 2000);
									}}
									className='absolute top-3 right-3 bg-lab-lime text-black px-3 py-1.5 rounded-md font-bold text-[10px] hover:scale-105 transition-all active:scale-95 flex items-center gap-2 shadow-lg'
								>
									<Copy size={12} />
									<span id='copy-btn'>COPY CODE</span>
								</button>
							</div>
						</div>
						<div className='bg-zinc-800/50 px-5 py-2 text-[9px] opacity-50 flex justify-between items-center'>
							<span>{Object.keys(localAdjustments).length} Member(s) adjusted</span>
							<span className='text-lab-lime font-bold'>DEVELOPER MODE ACTIVE</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};


export default OrganizationPage;
