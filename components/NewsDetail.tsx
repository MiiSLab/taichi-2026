import { Calendar, ExternalLink, MapPin, User, X, ZoomIn } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface NewsDetailProps {
	item: NewsItem;
	onClose: () => void;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ item, onClose }) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	// Lock body scroll when modal is open
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, []);

	return (
		<>
			<div className='fixed inset-0 z-[60] bg-lab-white/95 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200'>
				<div className='relative w-full max-w-4xl bg-white border-2 border-lab-orange shadow-[8px_8px_0px_0px_rgba(255,192,0,1)] flex flex-col max-h-[90vh] overflow-hidden'>
					{/* Header Bar */}
					<div className='flex justify-between items-center bg-lab-orange text-white p-4'>
						<div className='font-pixel text-lg tracking-wider'>EVENT_LOG_VIEWER</div>
						<button onClick={onClose} className='hover:bg-white hover:text-lab-orange p-1 transition-colors'>
							<X size={24} />
						</button>
					</div>

					<div className='overflow-y-auto p-6 md:p-10'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
							{/* Left Column: Image & Speaker */}
							<div className='space-y-6'>
								<div className='relative aspect-video w-full overflow-hidden border border-black bg-gray-100'>
									<img src={item.mainImage} alt={item.title} className='w-full h-full object-cover' />
									<div className='absolute top-0 left-0 bg-lab-orange text-white px-3 py-1 font-mono text-xs font-bold'>
										{item.topic}
									</div>
								</div>

								{/* Speakers List */}
								{item.speakers && item.speakers.length > 0 && (
									<div className='space-y-4'>
										{item.speakers.map((speaker, idx) => (
											<div key={idx} className='bg-gray-50 border border-gray-200 p-4 flex gap-4 items-start'>
												<div className='w-16 h-16 border border-gray-300 overflow-hidden flex-shrink-0'>
													<img
														src={speaker.headPhoto}
														alt={speaker.name}
														className='w-full h-full object-cover'
													/>
												</div>
												<div>
													<h4 className='font-pixel text-xl text-lab-orange'>{speaker.name}</h4>
													{speaker.bio && (
														<p className='font-sans text-sm text-gray-600 leading-snug'>{speaker.bio}</p>
													)}
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Right Column: Details */}
							<div className='flex flex-col h-full'>
								<div className='mb-6'>
									<div className='font-mono text-sm text-gray-500 mb-2'>{item.date}</div>
									<h2 className='font-pixel text-4xl md:text-5xl text-lab-dark leading-tight mb-6'>{item.title}</h2>

									<div className='space-y-3 font-mono text-sm border-t border-b border-gray-200 py-4 mb-6'>
										<div className='flex items-center gap-3'>
											<Calendar size={16} className='text-lab-orange' />
											<span>{item.date}</span>
										</div>
										{item.place && (
											<div className='flex items-center gap-3'>
												<MapPin size={16} className='text-lab-orange' />
												<span>{item.place}</span>
											</div>
										)}
										{item.speakers.length > 0 && (
											<div className='flex items-center gap-3'>
												<User size={16} className='text-lab-orange flex-shrink-0' />
												<span>
													{item.speakers[0].name}
													{item.speakers.length > 1 && (
														<span className='italic text-gray-500'> (+ {item.speakers.length - 1} others)</span>
													)}
												</span>
											</div>
										)}
									</div>

									<p className='font-sans text-lg leading-relaxed text-gray-800 mb-4'>{item.brief}</p>

									{item.briefCh && <p className='font-sans text-lg leading-relaxed text-gray-800 mb-8'>{item.briefCh}</p>}
								</div>

								<div>
									{item.registrationLink ? (
										<a
											href={item.registrationLink}
											target='_blank'
											rel='noopener noreferrer'
											className='block w-full bg-lab-orange text-white font-pixel text-xl text-center py-3 hover:bg-lab-dark transition-colors flex items-center justify-center gap-2'
										>
											REGISTER_NOW <ExternalLink size={20} />
										</a>
									) : (
										<div className='w-full bg-gray-200 text-gray-500 font-pixel text-xl text-center py-3 cursor-not-allowed'>
											REGISTRATION_CLOSED
										</div>
									)}
								</div>
							</div>
						</div>

						{/* EVENT RECAP SECTION */}
						{item.recapGallery && item.recapGallery.length > 0 && (
							<div className='mt-16 pt-10 border-t-2 border-black border-dashed'>
								<div className='flex items-center gap-4 mb-8'>
									<div className='font-pixel text-3xl text-lab-orange'>EVENT_RECAP</div>
									<div className='h-0.5 bg-lab-orange flex-1 opacity-20'></div>
								</div>

								{item.recapDescription && (
									<p className='font-sans text-lg text-gray-700 leading-relaxed mb-4 max-w-3xl'>
										{item.recapDescription}
									</p>
								)}
								{item.recapDescriptionCh && (
									<p className='font-sans text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl'>
										{item.recapDescriptionCh}
									</p>
								)}

								<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
									{item.recapGallery.map((img, idx) => (
										<div
											key={idx}
											className='group relative aspect-square bg-gray-100 overflow-hidden cursor-zoom-in border border-transparent hover:border-lab-orange'
											onClick={() => setSelectedImage(img)}
										>
											<img
												src={img}
												alt={`Recap ${idx}`}
												className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
											/>
											<div className='absolute inset-0 bg-lab-orange/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
												<ZoomIn className='text-white drop-shadow-md' size={32} />
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Lightbox Overlay */}
			{selectedImage && (
				<div
					className='fixed inset-0 z-[70] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200'
					onClick={() => setSelectedImage(null)}
				>
					<button
						className='absolute top-6 right-6 text-white hover:text-lab-orange transition-colors z-50'
						onClick={() => setSelectedImage(null)}
					>
						<X size={40} />
					</button>

					<img
						src={selectedImage}
						alt='Full size recap'
						className='max-w-full max-h-[80vh] object-contain shadow-2xl'
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
			)}
		</>
	);
};

export default NewsDetail;
