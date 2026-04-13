import { ChevronDown } from 'lucide-react';
import React from 'react';
import Skeleton from '../components/Skeleton';
import { useContent, useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

const getPersonDisplayName = (person: PersonItem, language: 'zh' | 'en') => {
	if (language === 'en' && person.nameEn) return person.nameEn;
	return person.name;
};

const AgendaPage: React.FC = () => {
	const { sessions, people, isSyncing } = useData();
	const content = useContent();
	const { language } = useLanguage();
	const keynoteSpeakers = people.filter((p) => (p.chairType ? String(p.chairType).toLowerCase() : '').includes('keynote'));

	return (
		<div className='pt-32 pb-24 px-6 md:px-20 bg-gray-50 min-h-screen text-lab-dark'>
			<div className='max-w-6xl mx-auto'>
				{/* Header (Program) */}
				<div className='flex flex-col items-center justify-center mb-16'>
					<h2 className='text-5xl md:text-7xl font-pixel text-lab-dark mb-4 text-center'>{content.programSection.title}</h2>
				</div>

				<div>
					{isSyncing && sessions.length === 0 ? (
						<div className='space-y-8'>
							<div className='h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse'></div>
							<Skeleton variant='card' count={3} />
						</div>
					) : sessions.length === 0 ? (
						<div className='text-center font-mono text-gray-400 py-12'>{content.programSection.agendaTba}</div>
					) : (
						(() => {
							const sessionsByDay: Record<string, SessionItem[]> = {};
							sessions.forEach((sess) => {
								if (!sessionsByDay[sess.day]) {
									sessionsByDay[sess.day] = [];
								}
								sessionsByDay[sess.day].push(sess);
							});

							return Object.keys(sessionsByDay)
								.sort()
								.map((day) => (
									<div key={day} className='mb-16'>
										<h3 className='font-pixel text-4xl text-lab-orange mb-8 text-center md:text-left'>{day}</h3>
										<div className='space-y-3'>
											{sessionsByDay[day]
												.sort((a, b) => {
													// Convert time string "HH:MM" to comparable number
													const timeToMinutes = (time: string) => {
														const [hours, minutes] = time.split(':').map(Number);
														return hours * 60 + minutes;
													};
													return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
												})
												.map((sess) => {
													const hasTopics = sess.topics && sess.topics.length > 0;

													return (
														<details
															key={sess.id}
															className='group border-2 border-gray-200 bg-white hover:border-lab-orange transition-colors rounded-lg shadow-sm'
														>
															<summary className='cursor-pointer p-4 flex items-center gap-4 list-none'>
																<span className='font-mono text-sm flex-shrink-0 text-gray-500'>
																	{sess.startTime} - {sess.endTime}
																</span>
																<div className='flex-1'>
																	<span className='font-bold text-lg'>{sess.title}</span>
																	{sess.chairs && sess.chairs.length > 0 && (
																		<div className='text-sm text-gray-500 mt-1'>
																			{content.programSection.chairsLabel}: {sess.chairs.map((c) => getPersonDisplayName(c, language)).join(', ')}
																		</div>
																	)}
																</div>
																{hasTopics && (
																	<ChevronDown
																		className='group-open:rotate-180 transition-transform flex-shrink-0 text-gray-400'
																		size={20}
																	/>
																)}
															</summary>
															{hasTopics && (
																<div className='px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50'>
																	<div className='space-y-4'>
																		{sess.topics!.map((topic) => (
																			<div
																				key={topic.id}
																				className='border-l-2 border-lab-orange pl-4'
																			>
																				<div className='font-mono text-xs text-gray-500 mb-1'>
																					{topic.startTime} - {topic.endTime}
																				</div>
																				<h4 className='font-bold text-base mb-1'>{topic.topic}</h4>
																				{topic.chairs && topic.chairs.length > 0 && (
																					<p className='text-sm text-gray-500'>
																						{topic.chairs.map((c) => getPersonDisplayName(c, language)).join(', ')}
																					</p>
																				)}
																			</div>
																		))}
																	</div>
																</div>
															)}
														</details>
													);
												})}
										</div>
									</div>
								));
						})()
					)}
				</div>

				{/* Keynotes Section */}
				<div id='keynotes' className='mt-24 pt-16 border-t border-gray-200'>
					<h2 className='text-5xl md:text-7xl font-pixel text-lab-dark mb-16 text-center'>{content.keynoteSection.title}</h2>
					{isSyncing && keynoteSpeakers.length === 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
							{[1, 2].map((i) => (
								<div key={i} className='flex flex-col md:flex-row gap-6 items-center md:items-start animate-pulse'>
									<div className='w-48 h-48 rounded-full bg-gray-200'></div>
									<div className='flex-1 space-y-3 w-full'>
										<div className='h-6 bg-gray-200 rounded w-3/4'></div>
										<div className='h-4 bg-gray-200 rounded w-1/2'></div>
										<div className='h-16 bg-gray-200 rounded'></div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
							{keynoteSpeakers.length === 0 && !isSyncing && (
								<div className='col-span-full text-center font-mono opacity-50'>{content.keynoteSection.tbd}</div>
							)}
							{keynoteSpeakers.map((speaker) => (
								<div key={speaker.id} className='flex flex-col md:flex-row gap-6 items-center md:items-start group'>
									<div className='w-48 h-48 overflow-hidden rounded-full border-4 border-gray-100 group-hover:border-lab-orange transition-colors shadow-lg'>
										<img
											src={speaker.image}
											alt={speaker.name}
											className='w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500'
										/>
									</div>
									<div className='text-center md:text-left flex-1'>
										<h3 className='font-pixel text-3xl text-lab-orange mb-2'>{getPersonDisplayName(speaker, language)}</h3>
										<p className='font-mono text-sm text-gray-600 mb-4'>
											{(language === 'en' && speaker.institutionEn) ? speaker.institutionEn : speaker.institution}
											{' '}
											{(language === 'en' && speaker.departmentEn) ? speaker.departmentEn : speaker.department}
										</p>
										<div className='bg-gray-50 p-4 rounded text-sm text-gray-600 italic border border-gray-200'>
											"{speaker.chairType}"
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AgendaPage;
