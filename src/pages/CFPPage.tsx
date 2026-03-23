import { Download, ExternalLink, FileText } from 'lucide-react';
import React from 'react';
import CountdownTimer from '../components/CountdownTimer';
import WarpBackground from '../components/WarpBackground';
import { CONTENT } from '../content';

const isHeading = (text: string) =>
	[
		'論文（Full Paper）',
		'圖像式論文（Pictorial）',
		'Poster',
		'投稿格式',
		'備註',
		'Paper Chairs',
		'Poster Chairs',
		'Demo Chairs',
	].includes(text.trim());

const parseText = (text: string) => {
	// 支援 **紅色粗體** (match[1])、支援 __單純粗體__ (match[2])
	const regex = /\*\*([^*]+)\*\*|__([^_]+)__|\[(.*?)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)|((?:https?:\/\/|mailto:)[^\s)]+)/g;
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
			// **文字** -> 紅色粗體
			parts.push(
				<strong key={`bold-red-${count}`} className='font-extrabold px-1 text-[#FF0033]'>
					{match[1]}
				</strong>,
			);
		} else if (match[2]) {
			// __文字__ -> 單純粗體
			parts.push(
				<strong key={`bold-only-${count}`} className='font-extrabold px-1 text-white'>
					{match[2]}
				</strong>,
			);
		} else if (match[5]) {
			// 原始網址 (沒有 [] 包裝的網址)
			parts.push(
				<a
					key={`url-${count}`}
					href={match[5]}
					className='text-[#3399FF] font-roboto hover:underline break-all'
					target='_blank'
					rel='noreferrer'
				>
					{match[5]}
				</a>,
			);
		} else {
			// [中括號標題](小括號網址)
			parts.push(
				<a
					key={`link-${count}`}
					href={match[4]}
					className='text-[#3399FF] font-roboto hover:underline break-all'
					target='_blank'
					rel='noreferrer'
				>
					{match[3]}
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
		<section className='bg-black w-full relative text-white' id='important-dates'>
			{/* Top Hero Section */}
			<div className='bg-black w-full min-h-[100dvh] flex flex-col items-center justify-center px-6 md:px-20 py-32 relative overflow-hidden'>
				<WarpBackground />

				<div className='flex flex-col items-center max-w-7xl relative z-10 w-full mt-8 md:mt-0'>
					<h2 className='text-5xl md:text-8xl font-pixel text-white mb-6 text-center tracking-widest leading-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]'>
						CALL FOR PAPERS
					</h2>
					<p
						className='font-pixel text-2xl md:text-3xl text-lab-pink text-center mb-16 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
						style={{ letterSpacing: '0.3em' }}
					>
						{CONTENT.cfpSection.subtitle}
					</p>

					<div className='flex flex-col gap-10 md:gap-6 w-full mb-16'>
						<div className='flex flex-col lg:flex-row items-center justify-between w-full max-w-5xl mx-auto gap-2 lg:gap-8 bg-white/5 border border-white/10 rounded-2xl px-6 py-4'>
							<div className='text-white font-roboto font-bold text-center lg:text-left'>
								<div className='text-xl md:text-2xl text-lab-lime mb-1 tracking-wider'>Deadline 截稿日</div>
								<div className='text-sm md:text-base text-gray-300 font-normal'>2026/6/18(四) 23:59(台灣時區)</div>
							</div>
							<div>
								<CountdownTimer targetDateStr='2026-06-18T23:59:00+08:00' small />
							</div>
						</div>

						<div className='flex flex-col lg:flex-row items-center justify-between w-full max-w-5xl mx-auto gap-2 lg:gap-8 bg-white/5 border border-white/10 rounded-2xl px-6 py-4'>
							<div className='text-white font-roboto font-bold text-center lg:text-left'>
								<div className='text-xl md:text-2xl text-lab-lime mb-1 tracking-wider'>Notification 結果通知</div>
								<div className='text-sm md:text-base text-gray-300 font-normal'>2026/7/21(二) 23:59(台灣時區)</div>
							</div>
							<div>
								<CountdownTimer targetDateStr='2026-07-21T23:59:00+08:00' small />
							</div>
						</div>

						<div className='flex flex-col lg:flex-row items-center justify-between w-full max-w-5xl mx-auto gap-2 lg:gap-8 bg-white/5 border border-white/10 rounded-2xl px-6 py-4'>
							<div className='text-white font-roboto font-bold text-center lg:text-left'>
								<div className='text-xl md:text-2xl text-lab-lime mb-1 tracking-wider'>Camera-Ready 完稿日</div>
								<div className='text-sm md:text-base text-gray-300 font-normal'>2026/7/27(一) 23:59(台灣時區)</div>
							</div>
							<div>
								<CountdownTimer targetDateStr='2026-07-27T23:59:00+08:00' small />
							</div>
						</div>
					</div>

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
							key={`block-${cat.id}`}
							className='w-full min-h-[100dvh] flex flex-col items-center px-4 md:px-20 py-24 relative bg-black'
						>
							<div
								id={cat.id}
								className='max-w-6xl bg-lab-lime text-lab-black rounded-lg shadow-2xl pt-4 pb-12 px-12 md:px-24 relative flex-shrink-0 mb-4'
							>
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
											<h4 key={i} className='pt-5 font-bold text-xl md:text-2xl mt-12 mb-2 text-lab-lime font-roboto'>
												{desc}
											</h4>
										);
									}
									if (desc.trim().startsWith('●')) {
										// 處理第二層縮排 (雙圈圈)
										if (desc.trim().startsWith('● ●')) {
											// 第一個圈圈以外的文字，去掉第二個圈圈
											const textToParse = desc.substring(desc.indexOf('●', desc.indexOf('●') + 1) + 1).trim();
											return (
												<div key={i} className='pl-8 md:pl-12 flex items-start gap-4'>
													<span className='text-white font-bold mt-0.5 opacity-60 text-sm'>◦</span>
													<div className='break-all md:break-words w-full font-roboto text-white/80'>
														{parseText(textToParse)}
													</div>
												</div>
											);
										}

										// 一般層級縮排 (單圈圈)
										const textToParse = desc.substring(1).trim();
										return (
											<div key={i} className='pl-2 md:pl-6 flex items-start gap-4'>
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
				<h3 className='font-roboto font-bold text-xl md:text-3xl text-white mb-16 text-center tracking-widest leading-tight z-10 relative'>
					{CONTENT.cfpSection.topicsTitle}
				</h3>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 max-w-7xl w-full relative z-10 grid-flow-row-dense'>
					{/* Left decorative dot removed */}

					{[
						{ en: 'Usability and User Experience', cut: 'BR', row: 0 },
						{ en: 'Interaction Techniques and Devices', cut: 'BC', row: 0 },
						{ en: 'Understanding Users and Human Behavior', cut: 'TL', row: 1 },
						{ en: 'Design Methods and Processes', cut: 'TL', row: 1 },
						{ en: 'Mobile and Ubiquitous Computing', cut: 'BC', row: 2 },
						{ en: 'Virtual, Augmented, Mixed, and Extended Reality (VR, AR, MR, XR)', cut: 'BL', row: 2, tall: true },
						{ en: 'Human-AI Interaction', cut: 'BR', row: 3 },

						{ en: 'More-than-Human Design', cut: 'TL', row: 4 },
						{ en: 'Ethics, Accessibility, and Inclusive Design', cut: 'TC', row: 4 },
						{ en: 'Specific Application Areas', cut: 'NONE', row: 5 },
						{ en: 'Social Computing and Collaboration', cut: 'NONE', row: 5 },
					].map((slot, idx) => {
						const topic = CONTENT.cfpSection.topics.find((t) => t.en === slot.en);
						if (!topic) return <div key={idx} className='hidden' />;

						let bgUrl = '';
						if (slot.tall) {
							bgUrl = 'url(/images/tall_bottom_left.svg)';
						} else {
							if (slot.cut === 'BR') bgUrl = 'url(/images/bottom_right.svg)';
							else if (slot.cut === 'BC') bgUrl = 'url(/images/bottom_center.svg)';
							else if (slot.cut === 'TC') bgUrl = 'url(/images/top_center.svg)';
							else if (slot.cut === 'TL') bgUrl = 'url(/images/top_left.svg)';
							else bgUrl = 'none';
						}

						return (
							<div
								key={idx}
								className={`relative group transition-transform duration-300 hover:-translate-y-1 ${slot.tall ? 'row-span-2' : ''}`}
							>
								<div
									className={`h-full text-black flex flex-col font-roboto p-2 ${['TR', 'TL'].includes(slot.cut) ? 'pt-10' : ''} relative ${bgUrl === 'none' ? 'bg-[#D9D9D9] rounded-2xl shadow-xl' : ''}`}
									style={
										bgUrl !== 'none'
											? {
													backgroundImage: bgUrl,
													backgroundSize: '100% 100%',
													backgroundRepeat: 'no-repeat',
													filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.5))',
												}
											: {}
									}
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
							</div>
						);
					})}

					{/* Green dot centered junction removed */}
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
