import { Download, ExternalLink, FileText } from 'lucide-react';
import React from 'react';
import { CONTENT } from '../content';

const parseText = (text: string) => {
	const regex = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;
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
					className='text-blue-600 hover:text-blue-800 underline break-all'
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
					className='text-blue-600 hover:text-blue-800 underline break-all'
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
		<section className='pt-32 pb-24 px-6 md:px-20 bg-lab-white min-h-screen'>
			<div className='max-w-6xl mx-auto'>
				<div className='flex flex-col items-center justify-center mb-16'>
					<h2 className='text-5xl md:text-7xl font-pixel text-lab-dark mb-4 text-center'>{CONTENT.cfpSection.title}</h2>
					<p className='font-mono text-xl md:text-2xl text-lab-orange text-center mb-8'>{CONTENT.cfpSection.subtitle}</p>
					{CONTENT.cfpSection.submissionLink && (
						<a
							href={CONTENT.cfpSection.submissionLink}
							target='_blank'
							rel='noopener noreferrer'
							className='flex items-center gap-2 bg-lab-dark text-white px-8 py-4 font-pixel text-xl rounded-lg hover:bg-lab-orange transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1'
						>
							SUBMIT NOW <ExternalLink size={20} />
						</a>
					)}
				</div>

				{/* Categories */}
				<div className='space-y-16 mb-24'>
					{CONTENT.cfpSection.categories.map((cat) => (
						<div
							key={cat.id}
							className='bg-white border border-gray-200 shadow-sm p-8 md:p-12 rounded-3xl relative overflow-hidden group'
						>
							<div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
								<FileText size={200} />
							</div>

							<div className='relative z-10'>
								<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6 gap-4'>
									<h3 className='font-pixel text-4xl text-lab-dark'>{cat.title}</h3>
									<div className='px-6 py-3 bg-lab-orange text-white rounded-full font-mono text-sm shadow-lg transform rotate-0 md:-rotate-2 group-hover:rotate-0 transition-transform'>
										Deadline: {cat.date}
									</div>
									{cat.extendedDate && (
										<div className='absolute top-24 right-8 md:right-12 px-4 py-2 bg-red-500 text-white rounded-lg font-bold shadow-xl animate-bounce transform rotate-3'>
											EXTENDED: {cat.extendedDate}
										</div>
									)}
								</div>

								<div className='grid md:grid-cols-3 gap-12'>
									<div className='md:col-span-2 space-y-6'>
										<div>
											<h4 className='font-bold text-gray-900 mb-2 flex items-center gap-2'>
												<FileText size={18} /> Description & Format
											</h4>
											<p className='font-mono text-sm text-gray-500 mb-2 bg-gray-50 inline-block px-2 py-1 rounded'>
												Format: {cat.format}
											</p>

											<div className='flex flex-col space-y-4 text-gray-700 leading-relaxed text-sm md:text-base'>
												{cat.description.map((desc, i) => {
													if (
														desc.trim() === '備註' ||
														desc.trim() === 'Full Paper' ||
														desc.trim() === 'Pictorial'
													) {
														return (
															<h5
																key={i}
																className='font-bold text-lg mt-6 text-lab-dark bg-gray-100 inline-block px-3 py-1 rounded w-max'
															>
																{desc}
															</h5>
														);
													}
													if (desc.trim().startsWith('●')) {
														const textToParse = desc.substring(1);
														return (
															<div key={i} className='pl-4 flex items-start gap-2'>
																<span className='text-lab-dark font-bold mt-0.5'>•</span>
																<div className='break-all md:break-words w-full'>
																	{parseText(textToParse)}
																</div>
															</div>
														);
													}
													return (
														<p key={i} className='indent-[2em]'>
															{parseText(desc)}
														</p>
													);
												})}
											</div>

											{cat.links && cat.links.length > 0 && (
												<div className='mt-8 pt-6 border-t border-gray-100'>
													<h5 className='text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider'>
														Download Templates
													</h5>
													<div className='flex gap-2 flex-wrap'>
														{cat.links.map((link, lIdx) => (
															<a
																key={lIdx}
																href={link.url}
																target='_blank'
																rel='noopener noreferrer'
																className='px-3 py-1 border border-gray-300 rounded text-xs hover:bg-lab-orange hover:text-white hover:border-lab-orange transition-colors flex items-center gap-1'
															>
																<Download size={12} />
																{link.label}
															</a>
														))}
													</div>
												</div>
											)}
										</div>
									</div>

									{cat.specs && (
										<div className='bg-gray-50 p-6 rounded-2xl border border-gray-100'>
											<h4 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
												<ExternalLink size={18} /> Specifications
											</h4>
											<ul className='space-y-3 text-sm text-gray-600'>
												{cat.specs.map((spec, i) => (
													<li key={i} className='flex gap-2'>
														<span className='text-lab-orange'>•</span>
														<span>{spec}</span>
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Topics */}
				<div className='mb-24 mt-24'>
					<h3 className='font-pixel text-3xl text-lab-orange mb-10 text-center'>{CONTENT.cfpSection.topicsTitle}</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{CONTENT.cfpSection.topics.map((topic, idx) => (
							<div
								key={idx}
								className='p-6 border-l-4 border-lab-orange bg-gray-50 hover:bg-white hover:shadow-md transition-all'
							>
								<h4 className='font-bold text-lg mb-2 text-lab-dark'>{topic.en}</h4>
								<p className='text-gray-600 font-medium mb-3'>{topic.ch}</p>

								{'details' in topic && topic.details && Array.isArray(topic.details) && (
									<ul className='list-disc pl-5 mt-2 space-y-1 text-sm text-gray-700'>
										{topic.details.map((detail, dIdx) => (
											<li key={dIdx}>{detail}</li>
										))}
									</ul>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
export default CFPPage;
