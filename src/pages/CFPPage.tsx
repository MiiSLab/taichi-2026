import { Download, ExternalLink, FileText } from 'lucide-react';
import React from 'react';
import CountdownTimer from '../components/CountdownTimer';
import { CONTENT } from '../content';

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
			// **text** match
			parts.push(
				<strong key={`bold-${count}`} className='font-bold text-lab-orange px-1'>
					{match[1]}
				</strong>,
			);
		} else if (match[4]) {
			// raw url match
			parts.push(
				<a
					key={`url-${count}`}
					href={match[4]}
					className='text-blue-700 font-bold hover:text-blue-900 underline break-all'
					target='_blank'
					rel='noreferrer'
				>
					{match[4]}
				</a>,
			);
		} else {
			// [label](url) match
			parts.push(
				<a
					key={`link-${count}`}
					href={match[3]}
					className='text-blue-700 font-bold hover:text-blue-900 underline break-all'
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

const CFPPage: React.FC = () => {
	return (
		<section className="bg-[url('/images/cfp_bg.png')] bg-cover bg-center bg-fixed w-full h-[100dvh] overflow-y-scroll snap-y snap-mandatory relative text-white">
			{/* Top Hero Section */}
			<div className='w-full min-h-[100dvh] snap-start flex flex-col items-center justify-center px-6 md:px-20 py-24'>
				<div className='flex flex-col items-center max-w-4xl'>
					<div className='transform scale-75 md:scale-100 mt-[-5rem] mb-12'>
						<CountdownTimer />
					</div>
					<h2 className='text-5xl md:text-8xl font-pixel text-white mb-6 text-center tracking-widest leading-tight'>
						CALL FOR PAPERS
					</h2>
					<p className='font-pixel text-xl md:text-2xl text-lab-pink text-center mb-12 tracking-widest'>
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
				{CONTENT.cfpSection.categories.map((cat) => (
					<div
						key={cat.id}
						className='w-full min-h-[100dvh] snap-start flex items-center justify-center px-4 md:px-20 py-16 relative'
					>
						<div className='w-full max-w-5xl bg-lab-lime text-lab-black border-4 border-lab-black shadow-2xl p-8 md:p-14 relative'>
							{/* Corner Screws/Dots */}
							<div
								className='absolute top-3 left-3 w-5 h-5 bg-gray-800 rounded-full shadow-inner z-10'
								style={{ background: 'radial-gradient(circle at 30% 30%, #666, #111)' }}
							>
								<div className='w-full h-full border border-black/50 rounded-full flex items-center justify-center'>
									<div className='w-4 h-[2px] bg-black/60 rotate-45'></div>
								</div>
							</div>
							<div
								className='absolute top-3 right-3 w-5 h-5 bg-gray-800 rounded-full shadow-inner z-10'
								style={{ background: 'radial-gradient(circle at 30% 30%, #666, #111)' }}
							>
								<div className='w-full h-full border border-black/50 rounded-full flex items-center justify-center'>
									<div className='w-4 h-[2px] bg-black/60 rotate-45'></div>
								</div>
							</div>
							<div
								className='absolute bottom-3 left-3 w-5 h-5 bg-gray-800 rounded-full shadow-inner z-10'
								style={{ background: 'radial-gradient(circle at 30% 30%, #666, #111)' }}
							>
								<div className='w-full h-full border border-black/50 rounded-full flex items-center justify-center'>
									<div className='w-4 h-[2px] bg-black/60 rotate-45'></div>
								</div>
							</div>
							<div
								className='absolute bottom-3 right-3 w-5 h-5 bg-gray-800 rounded-full shadow-inner z-10'
								style={{ background: 'radial-gradient(circle at 30% 30%, #666, #111)' }}
							>
								<div className='w-full h-full border border-black/50 rounded-full flex items-center justify-center'>
									<div className='w-4 h-[2px] bg-black/60 rotate-45'></div>
								</div>
							</div>

							<div className='relative z-10 max-h-[80vh] overflow-y-auto pr-4 custom-scrollbar'>
								<div className='mb-6 pb-4 border-b-2 border-lab-black/20'>
									<div className='flex gap-4 items-center mb-2'>
										<h3 className='font-mono font-bold text-3xl md:text-4xl text-lab-black'>{cat.title}</h3>
									</div>
									<div className='flex flex-col gap-1 text-sm font-mono mt-2'>
										<div className='flex gap-2'>
											<FileText size={16} /> <strong>Description & Format</strong>
										</div>
										<p className='opacity-80 ml-6'>Format: {cat.format}</p>
									</div>
								</div>

								<div className='grid grid-cols-1'>
									<div className='space-y-6'>
										<div>
											<div className='flex flex-col space-y-4 text-lab-black leading-relaxed text-sm md:text-base'>
												{cat.description.map((desc, i) => {
													if (
														desc.trim() === '備註' ||
														desc.trim() === 'Full Paper' ||
														desc.trim() === 'Pictorial' ||
														desc.trim() === 'Poster' ||
														desc.trim() === '投稿格式'
													) {
														return (
															<h5 key={i} className='font-bold text-xl mt-6 text-lab-black font-mono w-max'>
																{desc}
															</h5>
														);
													}
													if (desc.trim().startsWith('●')) {
														const textToParse = desc.substring(1);
														return (
															<div key={i} className='pl-4 flex items-start gap-2'>
																<span className='text-lab-black font-bold mt-0.5'>•</span>
																<div className='break-all md:break-words w-full font-medium'>
																	{parseText(textToParse)}
																</div>
															</div>
														);
													}
													return (
														<p key={i} className='indent-[2em] font-medium'>
															{parseText(desc)}
														</p>
													);
												})}
											</div>

											{cat.links && cat.links.length > 0 && (
												<div className='mt-8 pt-6 border-t-2 border-lab-black/20'>
													<h5 className='text-sm font-bold text-lab-black mb-3 uppercase tracking-wider font-mono'>
														Download Templates:
													</h5>
													<div className='flex gap-3 flex-wrap'>
														{cat.links.map((link, lIdx) => (
															<a
																key={lIdx}
																href={link.url}
																target='_blank'
																rel='noopener noreferrer'
																className='px-3 py-1.5 border-2 border-lab-black text-lab-black rounded-lg text-xs font-bold hover:bg-lab-black hover:text-lab-lime transition-colors flex items-center gap-1 font-mono'
															>
																<Download size={14} />
																{link.label}
															</a>
														))}
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Topics */}
			<div className='w-full min-h-[100dvh] snap-start flex flex-col items-center justify-center px-4 md:px-20 py-24'>
				<h3 className='font-mono font-bold text-3xl md:text-5xl text-white mb-16 text-center tracking-widest leading-tight'>
					{CONTENT.cfpSection.topicsTitle}
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full'>
					{CONTENT.cfpSection.topics.map((topic, idx) => (
						<div
							key={idx}
							className='p-8 bg-[#D9D9D9] text-lab-black transition-transform hover:-translate-y-1 relative'
							style={{
								clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px))',
							}}
						>
							<h4 className='font-bold font-mono text-xl mb-2'>{topic.en}</h4>
							<p className='text-lab-black font-medium mb-4'>{topic.ch}</p>

							{'details' in topic && topic.details && Array.isArray(topic.details) && (
								<ul className='list-disc pl-5 mt-2 space-y-2 text-sm md:text-base font-medium text-lab-black/90'>
									{topic.details.map((detail, dIdx) => (
										<li key={dIdx}>{detail}</li>
									))}
								</ul>
							)}
						</div>
					))}
				</div>

				<div className='w-full max-w-5xl mt-24 mb-12'>
					<div className='bg-lab-pink text-white font-mono font-bold text-center py-4 px-6 rounded-md tracking-wider text-sm md:text-base uppercase shadow-xl mx-auto'>
						NOTE: 所有投稿論文皆採用 ACM SIGCHI 格式規範，截稿時間為台灣時間 (GMT+8) 23:59。
					</div>
				</div>
			</div>
		</section>
	);
};

export default CFPPage;
