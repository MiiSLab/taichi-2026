import { Download, ExternalLink, FileText } from 'lucide-react';
import React from 'react';
import CountdownTimer from '../components/CountdownTimer';
import WarpBackground from '../components/WarpBackground';
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
					className='text-[#3399FF] font-roboto hover:underline break-all'
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
					className='text-[#3399FF] font-roboto hover:underline break-all'
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

// CutoutMask removed. Using CSS clip-path instead.

const CFPPage: React.FC = () => {
	return (
		<section className='bg-black w-full relative text-white'>
			{/* Top Hero Section */}
			<div className='bg-black w-full min-h-[100dvh] flex flex-col items-center justify-center px-6 md:px-20 py-24 relative overflow-hidden'>
				<WarpBackground />

				<div className='flex flex-col items-center max-w-4xl relative z-10'>
					<div className='transform scale-75 md:scale-100 mt-[-5rem] mb-12'>
						<CountdownTimer />
					</div>
					<h2 className='text-5xl md:text-8xl font-pixel text-white mb-6 text-center tracking-widest leading-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]'>
						CALL FOR PAPERS
					</h2>
					<p
						className='font-pixel text-3xl text-lab-pink text-center mb-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
						style={{ letterSpacing: '0.3em' }}
					>
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
			<div className='w-full font-roboto'>
				{CONTENT.cfpSection.categories.map((cat) => {
					const headingIdx = cat.description.findIndex((desc) => isHeading(desc));
					const topDesc = headingIdx === -1 ? cat.description : cat.description.slice(0, headingIdx);
					const bottomDesc = headingIdx === -1 ? [] : cat.description.slice(headingIdx);

					return (
						<div
							key={cat.id}
							className='w-full min-h-[100dvh] flex flex-col items-center px-4 md:px-20 py-24 relative bg-black'
						>
							<div className='max-w-6xl bg-lab-lime text-lab-black rounded-lg shadow-2xl pt-4 pb-12 px-12 md:px-24 relative flex-shrink-0 mb-16'>
								{/* Corner Screws/Dots */}
								<div className='absolute top-2 left-2 w-6 h-6 bg-[#525252] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] z-10 flex items-center justify-center'>
									<div className='w-5 h-[2px] bg-black/90 rotate-45 absolute'></div>
									<div className='w-5 h-[2px] bg-black/90 -rotate-45 absolute'></div>
								</div>
								<div className='absolute top-2 right-2 w-6 h-6 bg-[#525252] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] z-10 flex items-center justify-center'>
									<div className='w-5 h-[2px] bg-black/90 rotate-75 absolute'></div>
									<div className='w-5 h-[2px] bg-black/90 -rotate-15 absolute'></div>
								</div>
								<div className='absolute bottom-2 left-2 w-6 h-6 bg-[#525252] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] z-10 flex items-center justify-center'>
									<div className='w-5 h-[2px] bg-black/90 rotate-12 absolute'></div>
									<div className='w-5 h-[2px] bg-black/90 rotate-102 absolute'></div>
								</div>
								<div className='absolute bottom-2 right-2 w-6 h-6 bg-[#525252] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] z-10 flex items-center justify-center'>
									<div className='w-5 h-[2px] bg-black/90 rotate-45 absolute'></div>
									<div className='w-5 h-[2px] bg-black/90 -rotate-45 absolute'></div>
								</div>

								<div className='flex flex-col mb-2 pt-4'>
									<h3 className='font-roboto font-bold text-xl md:text-2xl text-lab-black pb-2 text-left'>{cat.title}</h3>
									<div className='flex flex-col gap-1 text-sm font-roboto mt-2 mb-2'>
										<div className='flex gap-2 font-bold'>
											<FileText size={18} className='mt-[-2px]' /> Description & Format
										</div>
										<p className='ml-6'>Format: {cat.format}</p>
									</div>
								</div>

								<div className='flex flex-col space-y-3 text-lab-black text-sm md:text-base font-medium'>
									{topDesc.map((desc, i) => (
										<p key={i}>{parseText(desc)}</p>
									))}
								</div>
							</div>

							<div className='w-full max-w-5xl flex flex-col space-y-4 text-white text-sm md:text-base px-2 md:px-6'>
								{bottomDesc.map((desc, i) => {
									if (isHeading(desc)) {
										return (
											<h4 key={i} className='font-bold text-2xl md:text-3xl mt-12 mb-2 text-lab-lime font-roboto'>
												{desc}
											</h4>
										);
									}
									if (desc.trim().startsWith('●')) {
										const textToParse = desc.substring(1);
										return (
											<div key={i} className='pl-6 flex items-start gap-4'>
												<span className='text-white font-bold mt-0.5 opacity-80'>•</span>
												<div className='break-all md:break-words w-full font-roboto text-white/90'>
													{parseText(textToParse)}
												</div>
											</div>
										);
									}
									return (
										<p key={i} className='indent-[2em] font-roboto text-white/90'>
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
				<h3 className='font-roboto font-bold text-3xl md:text-5xl text-white mb-16 text-center tracking-widest leading-tight z-10 relative'>
					{CONTENT.cfpSection.topicsTitle}
				</h3>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 max-w-7xl w-full relative z-10'>
					{/* Left decorative dot */}
					<div className='hidden md:block absolute left-[-3rem] top-[13%] w-[36px] h-[36px] bg-[#A8F020] rounded-full z-20'></div>

					{[
						{ en: 'Usability and User Experience', cut: 'BR', row: 0 },
						{ en: 'Interaction Techniques and Devices', cut: 'BL', row: 0 },
						{ en: 'Understanding Users and Human Behavior', cut: 'TR', row: 1 },
						{ en: 'Design Methods and Processes', cut: 'TL', row: 1 },
						{ en: 'Mobile and Ubiquitous Computing', cut: 'BR', row: 2 },
						{ en: 'Virtual, Augmented, Mixed, and Extended Reality (VR, AR, MR, XR)', cut: 'BL', row: 2, tall: true },
						{ en: 'Human-AI Interaction', cut: 'TR', row: 3 },
						{ en: 'DECORATION', cut: 'NONE', row: 3 },
						{ en: 'More-than-Human Design', cut: 'TL', row: 4 },
						{ en: 'Ethics, Accessibility, and Inclusive Design', cut: 'BR', row: 4 },
						{ en: 'Specific Application Areas', cut: 'NONE', row: 5 },
						{ en: 'Social Computing and Collaboration', cut: 'NONE', row: 5 },
					].map((slot, idx) => {
						if (slot.en === 'DECORATION') {
							return (
								<div key='deco' className='hidden md:flex items-center justify-center relative'>
									{/* Green pinwheel decoration from Figma */}
									<div
										className='grid grid-cols-2 gap-2 w-[110px] h-[110px] transform rotate-12 absolute'
										style={{ left: '15%' }}
									>
										<div className='w-full h-full bg-[#A8F020] rounded-[24px] flex items-center justify-center'>
											<div className='w-[44px] h-[44px] bg-black rounded-full'></div>
										</div>
										<div className='w-full h-full bg-[#A8F020] rounded-[24px] flex items-center justify-center'>
											<div className='w-[44px] h-[44px] bg-black rounded-full'></div>
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
								className={`rounded-2xl bg-[#D9D9D9] text-black flex flex-col font-roboto shadow-2xl transition-transform duration-300 hover:-translate-y-1 p-10 ${slot.tall ? 'row-span-2' : ''}`}
							>
								<h4 className='font-bold text-base md:text-lg leading-snug mb-1 tracking-tight'>{topic.en}</h4>
								<p className='font-bold text-sm md:text-base leading-snug mb-4 opacity-70'>{topic.ch}</p>

								{'details' in topic && topic.details && Array.isArray(topic.details) && (
									<ul className='space-y-2 text-xs md:text-sm font-medium text-black/80 tracking-tight'>
										{topic.details.map((detail, dIdx) => (
											<li key={dIdx} className='flex gap-2 items-start'>
												<span className='mt-[3px] text-black font-black text-xs flex-shrink-0'>•</span>
												<span className='leading-normal'>{detail}</span>
											</li>
										))}
									</ul>
								)}
							</div>
						);
					})}

					{/* Green dot centered at the BR/BL junction of row 0 and TR/TL of row 1  */}
					{/* Positioned between row 1 bottom-right and row 2 top-left in the grid gap */}
					<div
						className='hidden md:block absolute w-[40px] h-[40px] bg-[#A8F020] rounded-full z-20 pointer-events-none'
						style={{ left: 'calc(50% - 20px)', top: 'calc(25% - 20px)' }}
					></div>
				</div>

				<div className='w-full max-w-5xl mt-32 mb-12 relative z-10'>
					<div className='bg-lab-pink text-white font-roboto font-bold text-center py-4 px-6 rounded-md tracking-wider text-sm md:text-base uppercase shadow-xl mx-auto'>
						NOTE: 所有投稿必須遵循 ACM SIGCHI 格式規範，並透過大會指定的 CMT 系統進行上傳。
					</div>
				</div>
			</div>
		</section>
	);
};

export default CFPPage;
