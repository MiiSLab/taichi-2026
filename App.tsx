import { ChevronDown, ExternalLink, FileText, Link as LinkIcon, MapPin, Menu, RefreshCw, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import NewsDetail from './components/NewsDetail';
import PixelTransition from './components/PixelTransition';
import VoxelCube from './components/VoxelCube';
import { CONFIG, CONTENT, NEWS as STATIC_NEWS, PEOPLE as STATIC_PEOPLE, SESSIONS as STATIC_SESSIONS } from './content';
import { fetchNewsFromNotion, fetchPeopleFromNotion, fetchSessionsFromNotion } from './services/notionService';

// Helper to update Meta Tags
const updateMetaTags = (title: string, description: string) => {
	document.title = title;
	const metaDesc = document.querySelector('meta[name="description"]');
	if (metaDesc) metaDesc.setAttribute('content', description);
	const ogTitle = document.querySelector('meta[property="og:title"]');
	if (ogTitle) ogTitle.setAttribute('content', title);
	const ogDesc = document.querySelector('meta[property="og:description"]');
	if (ogDesc) ogDesc.setAttribute('content', description);
};

const App: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
	const [showAllNews, setShowAllNews] = useState(false);

	// Data State
	const [people, setPeople] = useState<PersonItem[]>(STATIC_PEOPLE);
	const [sessions, setSessions] = useState<SessionItem[]>(STATIC_SESSIONS);
	const [news, setNews] = useState<NewsItem[]>(STATIC_NEWS);

	// Sync State
	const [isSyncing, setIsSyncing] = useState(false);
	const [dataSource, setDataSource] = useState<'static' | 'notion'>('static');
	const [lastSynced, setLastSynced] = useState<string>('');

	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Sections Refs
	const themeRef = useRef<HTMLDivElement>(null);
	const newsRef = useRef<HTMLDivElement>(null);
	const programRef = useRef<HTMLDivElement>(null);
	const keynotesRef = useRef<HTMLDivElement>(null);
	const organizationRef = useRef<HTMLDivElement>(null);
	const cfpRef = useRef<HTMLDivElement>(null);
	const venueRef = useRef<HTMLDivElement>(null);
	const registrationRef = useRef<HTMLDivElement>(null);

	// Derived State safely
	const keynoteSpeakers = people.filter((p) => (p.chairType ? String(p.chairType).toLowerCase() : '').includes('keynote'));
	const committeeMembers = people.filter((p) => !(p.chairType ? String(p.chairType).toLowerCase() : '').includes('keynote'));

	useEffect(() => {
		handleSyncData();
	}, []);

	useEffect(() => {
		if (news.length > 0) {
			const params = new URLSearchParams(window.location.search);
			const newsId = params.get('newsId');
			if (newsId) {
				const foundItem = news.find((item) => item.id === newsId);
				if (foundItem) {
					setSelectedNews(foundItem);
					setTimeout(() => newsRef.current?.scrollIntoView({ behavior: 'smooth' }), 500);
				}
			}
		}
	}, [news]);

	const handleSyncData = async () => {
		setIsSyncing(true);
		await new Promise((resolve) => setTimeout(resolve, 500));

		const [fetchedPeople, fetchedSessions, fetchedNews] = await Promise.all([
			fetchPeopleFromNotion(),
			fetchSessionsFromNotion(),
			fetchNewsFromNotion(),
		]);

		let hasUpdate = false;
		if (fetchedPeople !== STATIC_PEOPLE) {
			setPeople(fetchedPeople);
			hasUpdate = true;
		}
		if (fetchedSessions !== STATIC_SESSIONS) {
			setSessions(fetchedSessions);
			hasUpdate = true;
		}
		if (fetchedNews !== STATIC_NEWS) {
			setNews(fetchedNews);
			hasUpdate = true;
		}

		if (hasUpdate) {
			setDataSource('notion');
			const now = new Date();
			setLastSynced(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
		} else {
			setDataSource('static');
		}
		setIsSyncing(false);
	};

	const handleOpenNews = (item: NewsItem) => {
		setSelectedNews(item);
		const newUrl = `${window.location.pathname}?newsId=${item.id}`;
		window.history.pushState({ path: newUrl }, '', newUrl);
	};

	const handleCloseNews = () => {
		setSelectedNews(null);
		const newUrl = window.location.pathname;
		window.history.pushState({ path: newUrl }, '', newUrl);
	};

	const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
		ref.current?.scrollIntoView({ behavior: 'smooth' });
		setIsMenuOpen(false);
	};

	const visibleNews = showAllNews ? news : news.slice(0, 3);

	return (
		<div className='min-h-screen bg-lab-white text-lab-dark font-sans selection:bg-lab-orange selection:text-white overflow-x-hidden'>
			{/* Navigation */}
			<nav
				className={`fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 ${
					isScrolled ? 'bg-lab-dark/90 backdrop-blur-md text-white shadow-md' : 'bg-transparent text-lab-dark'
				}`}
			>
				<div
					className='text-2xl font-pixel tracking-widest uppercase cursor-pointer hover:opacity-80'
					onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				>
					{CONTENT.nav.logo}
				</div>
				<div className='hidden xl:flex gap-6 font-pixel text-lg items-center'>
					<button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='hover:underline'>
						{CONTENT.nav.home}
					</button>
					<button onClick={() => scrollToSection(newsRef)} className='hover:underline'>
						{CONTENT.nav.news}
					</button>
					<button onClick={() => scrollToSection(programRef)} className='hover:underline'>
						{CONTENT.nav.program}
					</button>
					<button onClick={() => scrollToSection(keynotesRef)} className='hover:underline'>
						{CONTENT.nav.keynotes}
					</button>
					<button onClick={() => scrollToSection(cfpRef)} className='hover:underline'>
						{CONTENT.nav.cfp}
					</button>
					<button onClick={() => scrollToSection(venueRef)} className='hover:underline'>
						{CONTENT.nav.venue}
					</button>
					<button onClick={() => scrollToSection(organizationRef)} className='hover:underline'>
						{CONTENT.nav.organization}
					</button>
					<button
						onClick={() => scrollToSection(registrationRef)}
						className={`px-4 py-2 font-bold rounded-sm border transition-colors ${
							isScrolled
								? 'bg-white text-lab-dark border-white hover:bg-transparent hover:text-white'
								: 'bg-lab-dark text-white border-lab-dark hover:bg-transparent hover:text-lab-dark'
						}`}
					>
						{CONTENT.nav.registration}
					</button>
				</div>
				<button className='xl:hidden text-white' onClick={() => setIsMenuOpen(!isMenuOpen)}>
					{isMenuOpen ? <X size={32} /> : <Menu size={32} />}
				</button>
			</nav>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className='fixed inset-0 bg-lab-orange z-40 flex flex-col items-center justify-center gap-8 text-white font-pixel text-3xl'>
					<button
						onClick={() => {
							setIsMenuOpen(false);
							window.scrollTo({ top: 0, behavior: 'smooth' });
						}}
					>
						{CONTENT.nav.home}
					</button>
					<button onClick={() => scrollToSection(newsRef)}>{CONTENT.nav.news}</button>
					<button onClick={() => scrollToSection(programRef)}>{CONTENT.nav.program}</button>
					<button onClick={() => scrollToSection(keynotesRef)}>{CONTENT.nav.keynotes}</button>
					<button onClick={() => scrollToSection(cfpRef)}>{CONTENT.nav.cfp}</button>
					<button onClick={() => scrollToSection(venueRef)}>{CONTENT.nav.venue}</button>
					<button onClick={() => scrollToSection(organizationRef)}>{CONTENT.nav.organization}</button>
				</div>
			)}

			{selectedNews && <NewsDetail item={selectedNews} onClose={handleCloseNews} />}

			{/* HERO SECTION */}
			<section className='relative w-full min-h-screen bg-lab-orange flex flex-col justify-center items-center px-4 overflow-hidden text-center text-white'>
				<div className='z-10 flex flex-col items-center max-w-5xl w-full'>
					<div className='mb-8'>
						<VoxelCube />
					</div>
					<h1 className='text-6xl md:text-9xl font-pixel leading-none tracking-tighter mb-4 animate-pulse'>
						{CONTENT.hero.titleLine1}
						<br />
						{CONTENT.hero.titleLine2}
					</h1>
					<p className='text-lab-white/80 text-xl font-mono tracking-wide mt-4 border-l-2 border-white/50 pl-4'>
						{CONTENT.hero.subtitle}
						<br />
						{CONTENT.hero.date} | {CONTENT.hero.location}
					</p>
				</div>
			</section>

			<PixelTransition />

			{/* THEME (Intro) */}
			<section ref={themeRef} className='py-24 px-6 md:px-20 bg-lab-white'>
				<div className='max-w-4xl mx-auto text-center md:text-left'>
					<h2 className='text-4xl md:text-6xl font-pixel text-lab-orange mb-12 uppercase whitespace-pre-line'>
						{CONTENT.theme.title}
					</h2>
					<div className='grid md:grid-cols-2 gap-12 text-lg leading-relaxed text-gray-800'>
						<p>{CONTENT.theme.p1}</p>
						<p>{CONTENT.theme.p2}</p>
					</div>
				</div>
			</section>

			{/* NEWS */}
			<section ref={newsRef} className='py-24 px-6 md:px-20 bg-gray-50 border-t border-gray-200'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex justify-between items-end mb-16'>
						<h2 className='font-pixel text-5xl text-lab-dark'>{CONTENT.newsSection.title}</h2>
						<button
							onClick={handleSyncData}
							className='flex items-center gap-2 text-xs font-mono text-white bg-lab-dark px-3 py-1 hover:bg-lab-orange transition-colors'
							disabled={isSyncing}
						>
							<RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
							{isSyncing ? 'SYNCING...' : 'SYNC NEWS'}
						</button>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
						{isSyncing && news.length === 0 && (
							<div className='col-span-full text-center p-12 opacity-50 font-pixel'>LOADING_DATA...</div>
						)}
						{visibleNews.map((item) => (
							<div
								key={item.id}
								className='group bg-white border border-gray-200 hover:border-lab-orange transition-all cursor-pointer hover:shadow-lg'
								onClick={() => handleOpenNews(item)}
							>
								<div className='relative aspect-[3/2] overflow-hidden bg-gray-100'>
									<img
										src={item.image}
										alt={item.title}
										className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
									/>
									{item.subtitle && (
										<span className='absolute bottom-0 left-0 bg-lab-dark/80 text-white font-mono text-xs px-2 py-1 w-full truncate'>
											{item.subtitle}
										</span>
									)}
								</div>
								<div className='p-6'>
									{(item.createdTime || item.date) && (
										<div className='font-mono text-xs text-gray-500 mb-2'>{item.createdTime || item.date}</div>
									)}
									<h3 className='font-pixel text-2xl leading-none mb-4 group-hover:text-lab-orange'>{item.title}</h3>
									<p className='font-sans text-sm text-gray-600 line-clamp-2'>{item.content}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* PROGRAM / AGENDA */}
			<section ref={programRef} className='py-24 px-6 md:px-20 bg-lab-dark text-white'>
				<div className='max-w-6xl mx-auto'>
					<h2 className='font-pixel text-5xl text-white mb-16 text-center'>{CONTENT.programSection.title}</h2>
					{sessions.length === 0 && !isSyncing && (
						<div className='text-center font-mono text-gray-400 py-12'>Agenda to be announced.</div>
					)}
					{(() => {
						// Group sessions by day
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
									<h3 className='font-pixel text-4xl text-lab-orange mb-8'>{day}</h3>
									<div className='space-y-3'>
										{sessionsByDay[day].map((sess) => {
											const hasTopics = sess.topics && sess.topics.length > 0;

											return (
												<details
													key={sess.id}
													className='group border-2 border-white/20 hover:border-lab-orange transition-colors'
												>
													<summary className='cursor-pointer p-4 flex items-center gap-4 list-none'>
														<span className='font-mono text-sm flex-shrink-0'>
															{sess.startTime} - {sess.endTime}
														</span>
														<div className='flex-1'>
															<span className='font-bold text-lg'>{sess.title}</span>
															{sess.chairs && sess.chairs.length > 0 && (
																<div className='text-sm text-gray-300 mt-1'>
																	Chairs: {sess.chairs.map((c) => c.name).join(', ')}
																</div>
															)}
														</div>
														{hasTopics && (
															<ChevronDown
																className='group-open:rotate-180 transition-transform flex-shrink-0'
																size={20}
															/>
														)}
													</summary>
													{hasTopics && (
														<div className='px-4 pb-4 pt-2 border-t border-white/10 bg-white/5'>
															<div className='space-y-4'>
																{sess.topics!.map((topic) => (
																	<div key={topic.id} className='border-l-2 border-lab-orange pl-4'>
																		<div className='font-mono text-xs text-gray-400 mb-1'>
																			{topic.startTime} - {topic.endTime}
																		</div>
																		<h4 className='font-bold text-base mb-1'>{topic.topic}</h4>
																		{topic.chairs && topic.chairs.length > 0 && (
																			<p className='text-sm text-gray-400'>
																				{topic.chairs.map((c) => c.name).join(', ')}
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
					})()}
				</div>
			</section>

			{/* KEYNOTES */}
			<section ref={keynotesRef} className='py-24 px-6 md:px-20 bg-lab-dark text-white'>
				<div className='max-w-7xl mx-auto'>
					<h2 className='font-pixel text-5xl text-white mb-16'>{CONTENT.keynoteSection.title}</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
						{keynoteSpeakers.length === 0 && !isSyncing && (
							<div className='col-span-full text-center font-mono opacity-50'>Speakers TBD</div>
						)}
						{keynoteSpeakers.map((speaker) => (
							<div key={speaker.id} className='flex flex-col md:flex-row gap-6 items-center md:items-start group'>
								<div className='w-48 h-48 overflow-hidden rounded-full border-4 border-gray-700 group-hover:border-lab-orange transition-colors'>
									<img
										src={speaker.image}
										alt={speaker.name}
										className='w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500'
									/>
								</div>
								<div className='text-center md:text-left flex-1'>
									<h3 className='font-pixel text-3xl text-lab-orange mb-2'>{speaker.name}</h3>
									<p className='font-mono text-sm text-gray-400 mb-4'>{speaker.institution + speaker.department}</p>
									<div className='bg-gray-800 p-4 rounded text-sm text-gray-300 italic'>"{speaker.chairType}"</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CALL FOR PAPERS */}
			<section ref={cfpRef} className='py-24 px-6 md:px-20 bg-lab-white'>
				<div className='max-w-6xl mx-auto text-center'>
					<h2 className='font-pixel text-5xl text-lab-dark mb-16'>{CONTENT.cfpSection.title}</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{CONTENT.cfpSection.tracks.map((track) => (
							<div
								key={track.id}
								className='p-8 border border-gray-300 hover:border-lab-orange group hover:bg-gray-50 transition-all'
							>
								<div className='mb-4 text-lab-orange flex justify-center'>
									<FileText size={48} />
								</div>
								<h3 className='font-pixel text-2xl mb-4'>{track.title}</h3>
								<p className='text-gray-600 mb-6'>{track.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* VENUE */}
			<section ref={venueRef} className='py-24 px-6 bg-gray-100'>
				<div className='max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center'>
					<div className='flex-1'>
						<h2 className='font-pixel text-4xl text-lab-dark mb-8'>{CONTENT.venueSection.title}</h2>
						<div className='space-y-4 font-mono text-gray-700'>
							<div className='flex gap-4'>
								<MapPin className='text-lab-orange flex-shrink-0' />
								<p>{CONTENT.venueSection.address}</p>
							</div>
							<div className='flex gap-4'>
								<DefaultsIcon className='text-lab-orange flex-shrink-0' />
								<p className='whitespace-pre-line'>{CONTENT.venueSection.transport}</p>
							</div>
						</div>
						<a
							href={CONTENT.venueSection.mapLink}
							target='_blank'
							className='inline-flex items-center gap-2 mt-8 bg-lab-dark text-white px-6 py-3 font-pixel hover:bg-lab-orange transition-colors'
						>
							OPEN MAP <ExternalLink size={16} />
						</a>
					</div>
					<div className='flex-1 w-full h-64 bg-gray-300 rounded overflow-hidden relative'>
						{/* Simple Map Placeholder */}
						<iframe
							width='100%'
							height='100%'
							frameBorder='0'
							scrolling='no'
							marginHeight={0}
							marginWidth={0}
							src='https://maps.google.com/maps?q=National%20Taiwan%20University&t=&z=13&ie=UTF8&iwloc=&output=embed'
							className='filter grayscale hover:grayscale-0 transition-all'
						></iframe>
					</div>
				</div>
			</section>

			{/* REGISTRATION */}
			<section ref={registrationRef} className='py-24 px-6 bg-lab-orange text-white text-center'>
				<div className='max-w-2xl mx-auto'>
					<h2 className='font-pixel text-5xl mb-8'>{CONTENT.registrationSection.title}</h2>
					<p className='font-mono text-xl opacity-80 mb-12'>{CONTENT.registrationSection.info}</p>
					<button className='bg-white text-lab-orange font-pixel text-2xl px-12 py-4 rounded hover:scale-105 transition-transform'>
						{CONTENT.registrationSection.button}
					</button>
				</div>
			</section>

			{/* ORGANIZATION (COMMITTEE) */}
			<section ref={organizationRef} className='py-24 px-6 md:px-20 bg-lab-white'>
				<div className='max-w-7xl mx-auto'>
					<h2 className='font-pixel text-5xl text-lab-dark mb-12'>{CONTENT.committeeSection.title}</h2>
					{(() => {
						// Group committee members by Chair Type
						const groupedMembers: Record<string, PersonItem[]> = {};
						committeeMembers.forEach((member) => {
							const chairType = member.chairType || 'Committee Member';
							if (!groupedMembers[chairType]) {
								groupedMembers[chairType] = [];
							}
							groupedMembers[chairType].push(member);
						});

						// Sort groups by predefined order from CONFIG (case-insensitive)
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
								{sortedChairTypes.map((chairType) => (
									<div key={chairType}>
										<h3 className='font-pixel text-3xl text-lab-orange mb-8 uppercase'>{chairType}</h3>
										<div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
											{groupedMembers[chairType].map((member) => (
												<div
													key={member.id}
													className='group border border-gray-200 p-4 hover:border-lab-orange transition-colors text-center'
												>
													<div className='w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4'>
														<img src={member.image} className='w-full h-full object-cover' alt={member.name} />
													</div>
													<h4 className='font-bold text-lg mb-1'>{member.name}</h4>
													<p className='text-xs text-gray-500'>{member.institution + member.department}</p>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						);
					})()}
				</div>
			</section>

			{/* FOOTER */}
			<footer className='bg-lab-dark text-white py-12 px-6 border-t border-gray-800'>
				<div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 font-mono text-xs'>
					<div>
						<pre className='font-pixel text-2xl leading-none mb-4'>{CONTENT.footer.title}</pre>
						<p className='text-gray-500'>{CONTENT.footer.copyright}</p>
					</div>
					<div className='text-right'>
						<p className='text-gray-400 mb-2'>{CONTENT.footer.credits}</p>
						<p>{CONTENT.contact.email}</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

// Icon fix since I used DefaultsIcon by mistake above
const DefaultsIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<circle cx='12' cy='12' r='10' />
		<path d='M12 6v6l4 2' />
	</svg>
);

export default App;
