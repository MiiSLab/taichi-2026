import { Download, ExternalLink, FileText } from 'lucide-react';
import React from 'react';
import CountdownTimer from '../components/CountdownTimer';
import { CONTENT } from '../content';

const isHeading = (text: string) => ['Full Paper', 'Pictorial', 'Poster', '投稿格式', '備註'].includes(text.trim());

const parseText = (text: string) => {
	const regex = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)|((?:https?:\/\/|mailto:)[^\s)]+)/g;
	const parts = [];
	let lastIndex = 0;
	let match;
	let count = 0;
	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push(<span key={`text-${count}`}>{text.slice(lastIndex, match.index)}</span>);
			count++;
		}
		if (match[1]) {
			parts.push(
				<strong key={`bold-${count}`} className='font-extrabold px-1'>
					{match[1]}
				</strong>,
			);
		} else if (match[4]) {
			parts.push(
				<a
					key={`url-${count}`}
					href={match[4]}
					className='text-[#3399FF] font-mono hover:underline break-all'
					target='_blank'
					rel='noreferrer'
				>
					{match[4]}
				</a>,
			);
		} else {
			parts.push(
				<a
					key={`link-${count}`}
					href={match[3]}
					className='text-[#3399FF] font-mono hover:underline break-all'
					target='_blank'
					rel='noreferrer'
				>
					{match[2]}
				</a>,
			);
		}
		count++;
		lastIndex = regex.lastIndex;
	}
	if (lastIndex < text.length) {
		parts.push(<span key={`text-${count}`}>{text.slice(lastIndex)}</span>);
	}
	return parts;
};

// Advanced CSS Mask for True Rounded Inverse Corners
const CutoutMask = ({ position, width = '80px', height = '80px', radius = 24 }: any) => {
	const r = `${radius}px`;
	const r1 = `${radius + 0.5}px`;

	if (position === 'TR') {
		return (
			<div className='absolute top-0 right-0 z-0 pointer-events-none' style={{ width, height }}>
				<div className='absolute top-0 right-0 w-full h-full bg-black' style={{ borderBottomLeftRadius: r }} />
				<div
					className='absolute top-0 right-full'
					style={{ width: r, height: r, background: `radial-gradient(circle at 0% 100%, transparent ${r}, #000 ${r1})` }}
				/>
				<div
					className='absolute top-full right-0'
					style={{ width: r, height: r, background: `radial-gradient(circle at 0% 100%, transparent ${r}, #000 ${r1})` }}
				/>
			</div>
		);
	}
	if (position === 'TL') {
		return (
			<div className='absolute top-0 left-0 z-0 pointer-events-none' style={{ width, height }}>
				<div className='absolute top-0 left-0 w-full h-full bg-black' style={{ borderBottomRightRadius: r }} />
				<div
					className='absolute top-0 left-full'
					style={{ width: r, height: r, background: `radial-gradient(circle at 100% 100%, transparent ${r}, #000 ${r1})` }}
				/>
				<div
					className='absolute top-full left-0'
					style={{ width: r, height: r, background: `radial-gradient(circle at 100% 100%, transparent ${r}, #000 ${r1})` }}
				/>
			</div>
		);
	}
	if (position === 'BR') {
		return (
			<div className='absolute bottom-0 right-0 z-0 pointer-events-none' style={{ width, height }}>
				<div className='absolute bottom-0 right-0 w-full h-full bg-black' style={{ borderTopLeftRadius: r }} />
				<div
					className='absolute bottom-0 right-full'
					style={{ width: r, height: r, background: `radial-gradient(circle at 0% 0%, transparent ${r}, #000 ${r1})` }}
				/>
				<div
					className='absolute bottom-full right-0'
					style={{ width: r, height: r, background: `radial-gradient(circle at 0% 0%, transparent ${r}, #000 ${r1})` }}
				/>
			</div>
		);
	}
	if (position === 'BL') {
		return (
			<div className='absolute bottom-0 left-0 z-0 pointer-events-none' style={{ width, height }}>
				<div className='absolute bottom-0 left-0 w-full h-full bg-black' style={{ borderTopRightRadius: r }} />
				<div
					className='absolute bottom-0 left-full'
					style={{ width: r, height: r, background: `radial-gradient(circle at 100% 0%, transparent ${r}, #000 ${r1})` }}
				/>
				<div
					className='absolute bottom-full left-0'
					style={{ width: r, height: r, background: `radial-gradient(circle at 100% 0%, transparent ${r}, #000 ${r1})` }}
				/>
			</div>
		);
	}
	return null;
};

const CFPPage: React.FC = () => {
	return (
		<section className='bg-black w-full h-[100dvh] overflow-y-auto snap-y snap-proximity relative text-white scroll-smooth'>
			{/* Top Hero Section */}
			<div className="bg-[url('/images/cfp_bg.png')] bg-cover bg-center bg-fixed w-full min-h-[100dvh] snap-start flex flex-col items-center justify-center px-6 md:px-20 py-24 relative">
				<div className='absolute inset-0 bg-black/20'></div>
				<div className='flex flex-col items-center max-w-4xl relative z-10'>
					<div className='transform scale-75 md:scale-100 mt-[-5rem] mb-12'>
						<CountdownTimer />
					</div>
					<h2 className='text-5xl md:text-8xl font-pixel text-white mb-6 text-center tracking-widest leading-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]'>
						CALL FOR PAPERS
					</h2>
					<p className='font-pixel text-xl md:text-2xl text-lab-pink text-center mb-12 tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'>
						{CONTENT.cfpSection.subtitle}
					</p>

					{CONTENT.cfpSection.submissionLink && (
						<button className='bg-lab-pink text-white font-bold py-4 px-16 rounded-full hover:bg-white hover:text-lab-pink transition-colors text-xl tracking-wider shadow-[0_0_20px_rgba(255,0,102,0.6)]'>
							SUBMIT NOW
						</button>
					)}
				</div>
			</div>

			{/* Categories */}
			<div className='w-full'>
				{CONTENT.cfpSection.categories.map((cat) => {
					const headingIdx = cat.description.findIndex((desc) => isHeading(desc));
					const topDesc = headingIdx === -1 ? cat.description : cat.description.slice(0, headingIdx);
					const bottomDesc = headingIdx === -1 ? [] : cat.description.slice(headingIdx);

					return (
						<div
							key={cat.id}
							className='w-full min-h-[100dvh] snap-start flex flex-col items-center px-4 md:px-20 py-24 relative bg-black'
						>
							<div className='w-full max-w-5xl bg-lab-lime text-lab-black rounded-lg shadow-2xl p-8 md:p-12 relative flex-shrink-0 mb-16'>
								{/* Corner Screws/Dots */}
								<div
									className='absolute top-4 left-4 w-6 h-6 bg-gray-800 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] z-10 flex items-center justify-center'
									style={{ background: 'linear-gradient(135deg, #444, #111)' }}
								>
									<div className='w-3 h-[2px] bg-black/90 rotate-45 absolute'></div>
									<div className='w-3 h-[2px] bg-black/90 -rotate-45 absolute'></div>
								</div>
								<div
									className='absolute top-4 right-4 w-6 h-6 bg-gray-800 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] z-10 flex items-center justify-center'
									style={{ background: 'linear-gradient(135deg, #444, #111)' }}
								>
									<div className='w-3 h-[2px] bg-black/90 rotate-75 absolute'></div>
									<div className='w-3 h-[2px] bg-black/90 -rotate-15 absolute'></div>
								</div>
								<div
									className='absolute bottom-4 left-4 w-6 h-6 bg-gray-800 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] z-10 flex items-center justify-center'
									style={{ background: 'linear-gradient(135deg, #444, #111)' }}
								>
									<div className='w-3 h-[2px] bg-black/90 rotate-12 absolute'></div>
									<div className='w-3 h-[2px] bg-black/90 rotate-102 absolute'></div>
								</div>
								<div
									className='absolute bottom-4 right-4 w-6 h-6 bg-gray-800 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] z-10 flex items-center justify-center'
									style={{ background: 'linear-gradient(135deg, #444, #111)' }}
								>
									<div className='w-3 h-[2px] bg-black/90 rotate-45 absolute'></div>
									<div className='w-3 h-[2px] bg-black/90 -rotate-45 absolute'></div>
								</div>

								<div className='flex flex-col mb-4 pt-4'>
									<h3 className='font-mono font-bold text-3xl md:text-5xl text-lab-black pb-2 text-center md:text-left indent-8'>
										{cat.title}
									</h3>
									<div className='flex flex-col gap-1 text-sm font-mono mt-2 mb-6 indent-8'>
										<div className='flex gap-2 font-bold'>
											<FileText size={18} className='mt-[-2px]' /> Description & Format
										</div>
										<p className='opacity-80 ml-6'>Format: {cat.format}</p>
									</div>
								</div>

								<div className='flex flex-col space-y-4 text-lab-black leading-relaxed text-sm md:text-base font-medium pl-6 pr-6'>
									{topDesc.map((desc, i) => (
										<p key={i}>{parseText(desc)}</p>
									))}
								</div>
							</div>

							<div className='w-full max-w-5xl flex flex-col space-y-6 text-white leading-relaxed text-sm md:text-base px-2'>
								{bottomDesc.map((desc, i) => {
									if (isHeading(desc)) {
										return (
											<h4 key={i} className='font-bold text-2xl md:text-3xl mt-12 mb-2 text-lab-lime font-mono'>
												{desc}
											</h4>
										);
									}
									if (desc.trim().startsWith('●')) {
										const textToParse = desc.substring(1);
										return (
											<div key={i} className='pl-6 flex items-start gap-4'>
												<span className='text-[#3399FF] font-bold mt-0.5 opacity-80'>•</span>
												<div className='break-all md:break-words w-full font-mono text-white/90'>
													{parseText(textToParse)}
												</div>
											</div>
										);
									}
									return (
										<p key={i} className='indent-[2em] font-mono text-white/90'>
											{parseText(desc)}
										</p>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>

			{/* Topics Section */}
			<div className='w-full min-h-[100dvh] flex flex-col items-center justify-center px-4 md:px-20 py-24 bg-black overflow-hidden'>
				<h3 className='font-mono font-bold text-3xl md:text-5xl text-white mb-16 text-center tracking-widest leading-tight z-10 relative'>
					{CONTENT.cfpSection.topicsTitle}
				</h3>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 max-w-7xl w-full relative z-10'>
					{/* Decorative green dots as requested in Figma */}
					<div className='hidden md:block absolute left-[-4rem] top-[8%] w-[50px] h-[50px] bg-[#A8F020] rounded-full z-0'></div>
					<div className='hidden md:block absolute left-[45%] top-[25%] w-[50px] h-[50px] bg-[#A8F020] rounded-full z-0'></div>

					{[
						{ en: 'Usability and User Experience', cut: 'BR' },
						{ en: 'Interaction Techniques and Devices', cut: 'BL' },
						{ en: 'Understanding Users and Human Behavior', cut: 'TL' },
						{ en: 'Design Methods and Processes', cut: 'TR' },
						{ en: 'Mobile and Ubiquitous Computing', cut: 'BR' },
						{ en: 'Virtual, Augmented, Mixed, and Extended Reality (VR, AR, MR, XR)', cut: 'BL', tall: true },
						{ en: 'Human-AI Interaction', cut: 'TL' },
						{ en: 'DECORATION', cut: 'NONE' },
						{ en: 'More-than-Human Design', cut: 'TR' },
						{ en: 'Ethics, Accessibility, and Inclusive Design', cut: 'TL' },
						{ en: 'Specific Application Areas', cut: 'NONE' },
						{ en: 'Social Computing and Collaboration', cut: 'NONE' },
					].map((slot, idx) => {
						if (slot.en === 'DECORATION') {
							return (
								<div key='deco' className='flex items-center justify-center py-4 z-0 relative'>
									{/* The Union of green ellipses from Figma */}
									<div
										className='grid grid-cols-2 gap-1 w-[124px] h-[124px] transform -rotate-12 absolute'
										style={{ left: '10%' }}
									>
										<div className='w-full h-full bg-[#A8F020] rounded-[30px] flex items-center justify-center'>
											<div className='w-[50px] h-[50px] bg-black rounded-full'></div>
										</div>
										<div className='w-full h-full bg-[#A8F020] rounded-[30px] flex items-center justify-center'>
											<div className='w-[50px] h-[50px] bg-black rounded-full'></div>
										</div>
									</div>
								</div>
							);
						}

						const topic = CONTENT.cfpSection.topics.find((t) => t.en === slot.en);
						if (!topic) return <div key={idx} className='hidden' />;

						return (
							<div
								key={idx}
								className={`bg-[#D9D9D9] text-black relative flex flex-col h-full font-mono rounded-[24px] shadow-2xl transition-transform duration-300 hover:-translate-y-1 ${slot.tall ? 'row-span-2' : ''}`}
								style={{ padding: slot.cut === 'TL' || slot.cut === 'TR' ? '80px 48px 48px' : '48px 48px' }}
							>
								{slot.cut !== 'NONE' && <CutoutMask position={slot.cut} width='25%' height='90px' radius={24} />}

								<div className='relative z-10 flex flex-col flex-1'>
									<h4 className='font-bold text-lg md:text-xl leading-snug mb-2 tracking-tight'>{topic.en}</h4>
									<p className='font-bold text-base md:text-lg leading-snug mb-6'>{topic.ch}</p>

									{'details' in topic && topic.details && Array.isArray(topic.details) && (
										<ul className='space-y-2 text-sm md:text-base font-medium text-black/90 tracking-tight'>
											{topic.details.map((detail, dIdx) => (
												<li key={dIdx} className='flex gap-3 items-start'>
													<span className='mt-[4px] text-black font-black text-xs'>•</span>
													<span className='leading-normal'>{detail}</span>
												</li>
											))}
										</ul>
									)}
								</div>
							</div>
						);
					})}
				</div>

				<div className='w-full max-w-5xl mt-32 mb-12 relative z-10'>
					<div className='bg-lab-pink text-white font-mono font-bold text-center py-4 px-6 rounded-md tracking-wider text-sm md:text-base uppercase shadow-xl mx-auto'>
						NOTE: 所有投稿論文皆採用 ACM SIGCHI 格式規範，截稿時間為台灣時間 (GMT+8) 23:59。
					</div>
				</div>
			</div>
		</section>
	);
};

export default CFPPage;
